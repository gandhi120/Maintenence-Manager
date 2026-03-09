'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects(search?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.log('getProjects error:', error.message)
    return []
  }

  // Get open issue counts for each project
  if (data?.length) {
    const projectIds = data.map(p => p.id)
    const { data: issueCounts } = await supabase
      .from('issues')
      .select('project_id')
      .in('project_id', projectIds)
      .neq('status', 'resolved')

    const countMap: Record<string, number> = {}
    issueCounts?.forEach(i => {
      countMap[i.project_id] = (countMap[i.project_id] || 0) + 1
    })

    return data.map(p => ({ ...p, open_issue_count: countMap[p.id] || 0 }))
  }

  return data || []
}

export async function getProject(projectId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!data) return null

  // Get open issue count
  const { count } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .neq('status', 'resolved')

  return { ...data, open_issue_count: count || 0 }
}

export async function createProject(formData: {
  name: string
  location: string
  description?: string
  color: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  console.log('createProject: user.id =', user.id)

  // Debug: check what auth.uid() returns in the DB context
  const { data: uidCheck } = await supabase.rpc('get_uid_debug').maybeSingle()
  console.log('createProject: auth.uid() in DB =', uidCheck)

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...formData,
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.log('createProject error:', error.message, error.code, error.details)
    return { error: error.message }
  }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: data.id,
    actor_id: user.id,
    action: 'project_created',
    description: `created project "${data.name}"`,
  })

  revalidatePath('/projects')
  revalidatePath('/dashboard')
  return { data }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) return { error: error.message }

  revalidatePath('/projects')
  revalidatePath('/dashboard')
  return { success: true }
}
