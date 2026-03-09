'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTechnicianStats(userId: string) {
  const supabase = await createClient()

  // Assigned (non-completed) WOs
  const { count: assignedWOs } = await supabase
    .from('work_orders')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_to', userId)
    .neq('status', 'completed')

  // Urgent tasks (high priority, non-completed)
  const { count: urgentTasks } = await supabase
    .from('work_orders')
    .select('*, issue:issues!inner(priority)', { count: 'exact', head: true })
    .eq('assigned_to', userId)
    .neq('status', 'completed')
    .eq('issues.priority', 'high')

  // Completed this week
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const { count: completedThisWeek } = await supabase
    .from('work_orders')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_to', userId)
    .eq('status', 'completed')
    .gte('actual_completion', startOfWeek.toISOString().split('T')[0])

  // Upcoming deadlines (within 3 days)
  const threeDays = new Date()
  threeDays.setDate(threeDays.getDate() + 3)
  const { count: upcomingDeadlines } = await supabase
    .from('work_orders')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_to', userId)
    .neq('status', 'completed')
    .not('estimated_completion', 'is', null)
    .lte('estimated_completion', threeDays.toISOString().split('T')[0])

  return {
    assignedWOs: assignedWOs || 0,
    urgentTasks: urgentTasks || 0,
    completedThisWeek: completedThisWeek || 0,
    upcomingDeadlines: upcomingDeadlines || 0,
  }
}

export async function getActiveWorkOrders(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_orders')
    .select(`
      *,
      issue:issues(id, title, priority, machine_id, machine:machines(id, name)),
      assignee:users!work_orders_assigned_to_fkey(id, name, avatar_url)
    `)
    .eq('assigned_to', userId)
    .neq('status', 'completed')
    .order('created_at', { ascending: false })

  return data || []
}

export async function getOverdueWorkOrders(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('work_orders')
    .select(`
      *,
      issue:issues(id, title, priority, machine_id, machine:machines(id, name)),
      assignee:users!work_orders_assigned_to_fkey(id, name, avatar_url)
    `)
    .eq('assigned_to', userId)
    .neq('status', 'completed')
    .not('estimated_completion', 'is', null)
    .lt('estimated_completion', today)

  return data || []
}

export async function getRecentlyCompleted(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_orders')
    .select(`
      *,
      issue:issues(id, title, priority, machine_id, machine:machines(id, name))
    `)
    .eq('assigned_to', userId)
    .eq('status', 'completed')
    .order('actual_completion', { ascending: false })
    .limit(3)

  return data || []
}

export async function getTechnicianProjects(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('team_members')
    .select('project:projects(id, name, color)')
    .eq('user_id', userId)

  return data?.map(d => d.project).filter(Boolean) || []
}
