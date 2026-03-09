'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/modules/notifications/actions/notification.actions'

export async function getWorkOrders(projectId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_orders')
    .select(`
      *,
      issue:issues(id, title, priority, machine_id, machine:machines(id, name)),
      assignee:users!work_orders_assigned_to_fkey(id, name, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getWorkOrderByIssue(issueId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_orders')
    .select(`
      *,
      assignee:users!work_orders_assigned_to_fkey(id, name, avatar_url)
    `)
    .eq('issue_id', issueId)
    .single()

  return data
}

export async function createWorkOrder(projectId: string, issueId: string, formData: {
  assigned_to?: string
  estimated_completion?: string
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if work order already exists for this issue
  const { data: existing } = await supabase
    .from('work_orders')
    .select('id')
    .eq('issue_id', issueId)
    .single()

  if (existing) return { error: 'Work order already exists for this issue' }

  const status = formData.assigned_to ? 'assigned' : 'open'

  const { data, error } = await supabase
    .from('work_orders')
    .insert({
      ...formData,
      project_id: projectId,
      issue_id: issueId,
      status,
      assigned_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Update issue status
  if (formData.assigned_to) {
    await supabase.from('issues').update({ status: 'assigned' }).eq('id', issueId)

    // Notify assigned technician
    await createNotification({
      user_id: formData.assigned_to,
      type: 'work_order_assigned',
      title: 'New Work Order Assigned',
      body: 'You have been assigned a new work order.',
      reference_type: 'work_order',
      reference_id: data.id,
    })
  }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    issue_id: issueId,
    work_order_id: data.id,
    actor_id: user.id,
    action: 'work_order_created',
    description: 'created work order',
  })

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  revalidatePath(`/projects/${projectId}/work-orders`)
  revalidatePath('/dashboard')
  return { data }
}

export async function updateWorkOrderStatus(workOrderId: string, projectId: string, status: string, issueId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('work_orders')
    .update({ status })
    .eq('id', workOrderId)

  if (error) return { error: error.message }

  // Update issue status to match (wo completed triggers auto-resolve via DB trigger)
  if (status === 'in_progress') {
    await supabase.from('issues').update({ status: 'in_progress' }).eq('id', issueId)
  }

  // Notify project owner on status change
  const { data: workOrder } = await supabase
    .from('work_orders')
    .select('assigned_by, assigned_to')
    .eq('id', workOrderId)
    .single()

  if (workOrder) {
    // Notify the manager who assigned it
    if (workOrder.assigned_by && workOrder.assigned_by !== user.id) {
      await createNotification({
        user_id: workOrder.assigned_by,
        type: 'status_changed',
        title: 'Work Order Status Updated',
        body: `Work order status changed to ${status.replace(/_/g, ' ')}.`,
        reference_type: 'work_order',
        reference_id: workOrderId,
      })
    }
    // Notify technician if manager changed status
    if (workOrder.assigned_to && workOrder.assigned_to !== user.id) {
      await createNotification({
        user_id: workOrder.assigned_to,
        type: 'status_changed',
        title: 'Work Order Status Updated',
        body: `Work order status changed to ${status.replace(/_/g, ' ')}.`,
        reference_type: 'work_order',
        reference_id: workOrderId,
      })
    }
  }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    issue_id: issueId,
    work_order_id: workOrderId,
    actor_id: user.id,
    action: 'status_changed',
    description: `changed work order status to ${status.replace(/_/g, ' ')}`,
  })

  revalidatePath(`/projects/${projectId}/work-orders`)
  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateWorkOrderNotes(workOrderId: string, projectId: string, notes: string, issueId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('work_orders')
    .update({ notes })
    .eq('id', workOrderId)

  if (error) return { error: error.message }

  await supabase.from('activity_log').insert({
    project_id: projectId,
    issue_id: issueId,
    work_order_id: workOrderId,
    actor_id: user.id,
    action: 'note_added',
    description: 'added repair notes',
  })

  revalidatePath(`/projects/${projectId}/issues/${issueId}`)
  return { success: true }
}

export async function getTeamForProject(projectId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('team_members')
    .select(`
      *,
      user:users(id, name, avatar_url)
    `)
    .eq('project_id', projectId)

  // Also get the project owner
  const { data: project } = await supabase
    .from('projects')
    .select('owner_id, users:users!projects_owner_id_fkey(id, name, avatar_url)')
    .eq('id', projectId)
    .single()

  const members = data?.map(d => d.user).filter(Boolean) || []
  if (project?.users) {
    members.unshift(project.users as unknown as { id: string; name: string; avatar_url: string | null })
  }

  return members
}

export async function getTechnicianWorkOrders(projectId: string, userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_orders')
    .select(`
      *,
      issue:issues(id, title, priority, machine_id, machine:machines(id, name)),
      assignee:users!work_orders_assigned_to_fkey(id, name, avatar_url)
    `)
    .eq('project_id', projectId)
    .eq('assigned_to', userId)
    .order('created_at', { ascending: false })

  return data || []
}
