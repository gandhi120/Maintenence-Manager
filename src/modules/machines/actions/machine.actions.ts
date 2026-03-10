'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMachines(projectId: string, status?: string, search?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('machines')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data } = await query
  return data || []
}

export async function getMachine(machineId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('machines')
    .select(`
      *,
      project:projects(id, name, color, location)
    `)
    .eq('id', machineId)
    .single()

  return data
}

export async function createMachine(projectId: string, formData: {
  name: string
  type: string
  serial_number?: string
  image_url?: string
  last_maintenance_date?: string
  maintenance_cycle_days: number
  zone?: string
  status: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('machines')
    .insert({
      ...formData,
      project_id: projectId,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    actor_id: user.id,
    action: 'machine_added',
    description: `added machine "${data.name}"`,
  })

  revalidatePath(`/projects/${projectId}/machines`)
  revalidatePath('/dashboard')
  return { data }
}

export async function updateMachine(machineId: string, projectId: string, formData: Record<string, unknown>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('machines')
    .update(formData)
    .eq('id', machineId)

  if (error) return { error: error.message }

  revalidatePath(`/projects/${projectId}/machines/${machineId}`)
  revalidatePath(`/projects/${projectId}/machines`)
  return { success: true }
}

export async function getMaintenanceLog(machineId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('maintenance_log')
    .select(`
      *,
      technician:users!maintenance_log_technician_id_fkey(id, name)
    `)
    .eq('machine_id', machineId)
    .order('created_at', { ascending: false })

  return data || []
}

export async function logMaintenance(machineId: string, projectId: string, formData: {
  maintenance_type: string
  date: string
  notes?: string
  checklist?: Array<{ label: string; checked: boolean }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('maintenance_log')
    .insert({
      ...formData,
      machine_id: machineId,
      project_id: projectId,
      technician_id: user.id,
    })

  if (error) return { error: error.message }

  // Update machine's last maintenance date to the latest log entry
  const { data: latestLog } = await supabase
    .from('maintenance_log')
    .select('date')
    .eq('machine_id', machineId)
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (latestLog) {
    await supabase
      .from('machines')
      .update({ last_maintenance_date: latestLog.date })
      .eq('id', machineId)
  }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    actor_id: user.id,
    action: 'maintenance_logged',
    description: `logged ${formData.maintenance_type} maintenance`,
  })

  revalidatePath(`/projects/${projectId}/machines/${machineId}`)
  revalidatePath('/dashboard')
  return { success: true }
}
