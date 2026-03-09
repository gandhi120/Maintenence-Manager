'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function updateProfile(formData: { name?: string; avatar_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const updateData = Object.fromEntries(
    Object.entries(formData).filter(([, v]) => v !== undefined)
  )
  if (Object.keys(updateData).length === 0) return { success: true }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}

export async function getTeamMembers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get projects owned by user
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)

  if (!projects?.length) return []

  const projectIds = projects.map(p => p.id)

  const { data } = await supabase
    .from('team_members')
    .select(`
      *,
      user:users(id, name, mobile_number, avatar_url)
    `)
    .in('project_id', projectIds)

  return data || []
}
