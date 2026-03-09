'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/modules/notifications/actions/notification.actions'

export async function getIssues(projectId: string, filters?: { priority?: string; status?: string; search?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('issues')
    .select(`
      *,
      machine:machines(id, name)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority)
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  const { data } = await query
  return data || []
}

export async function getIssue(issueId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('issues')
    .select(`
      *,
      machine:machines(id, name, type, image_url),
      project:projects(id, name, color)
    `)
    .eq('id', issueId)
    .single()

  return data
}

export async function createIssue(projectId: string, formData: {
  title: string
  description?: string
  priority: string
  machine_id: string
  image_urls?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('issues')
    .insert({
      ...formData,
      project_id: projectId,
      reported_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    issue_id: data.id,
    actor_id: user.id,
    action: 'issue_created',
    description: `reported "${data.title}"`,
  })

  // Notify project owner about new issue
  const { data: project } = await supabase
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single()

  if (project?.owner_id && project.owner_id !== user.id) {
    await createNotification({
      user_id: project.owner_id,
      type: 'issue_created',
      title: 'New Issue Reported',
      body: `"${data.title}" was reported.`,
      reference_type: 'issue',
      reference_id: data.id,
    })
  }

  revalidatePath(`/projects/${projectId}/issues`)
  revalidatePath('/dashboard')
  return { data }
}

export async function updateIssueStatus(issueId: string, projectId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const updateData: Record<string, unknown> = { status }
  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('issues')
    .update(updateData)
    .eq('id', issueId)

  if (error) return { error: error.message }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    issue_id: issueId,
    actor_id: user.id,
    action: 'status_changed',
    description: `changed issue status to ${status}`,
  })

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  revalidatePath(`/projects/${projectId}/issues`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getIssueActivity(issueId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('activity_log')
    .select(`
      *,
      actor:users!activity_log_actor_id_fkey(id, name, avatar_url)
    `)
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })

  return data || []
}
