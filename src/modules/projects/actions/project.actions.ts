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
    .or(`owner_id.eq.${user.id},id.in.(select project_id from team_members where user_id = '${user.id}')`)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data } = await query

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

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...formData,
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

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
