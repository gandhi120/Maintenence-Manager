'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get projects owned by user or where user is a team member
  const { data: ownedProjects } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)

  const { data: teamProjects } = await supabase
    .from('team_members')
    .select('project_id')
    .eq('user_id', user.id)

  const projectIds = [
    ...(ownedProjects?.map(p => p.id) || []),
    ...(teamProjects?.map(t => t.project_id) || []),
  ]

  const totalProjects = projectIds.length

  // Get machine count
  const { count: totalMachines } = await supabase
    .from('machines')
    .select('*', { count: 'exact', head: true })
    .in('project_id', projectIds.length ? projectIds : ['none'])

  // Get open issues count
  const { count: openIssues } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .in('project_id', projectIds.length ? projectIds : ['none'])
    .neq('status', 'resolved')

  // Get maintenance due count (within 7 days)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const { count: maintenanceDue } = await supabase
    .from('machines')
    .select('*', { count: 'exact', head: true })
    .in('project_id', projectIds.length ? projectIds : ['none'])
    .not('next_maintenance_date', 'is', null)
    .lte('next_maintenance_date', nextWeek.toISOString().split('T')[0])

  return {
    totalProjects,
    totalMachines: totalMachines || 0,
    openIssues: openIssues || 0,
    maintenanceDue: maintenanceDue || 0,
  }
}

export async function getCriticalIssues() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('issues')
    .select(`
      *,
      machine:machines(id, name),
      project:projects(id, name, color)
    `)
    .eq('priority', 'high')
    .neq('status', 'resolved')
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

export async function getUpcomingMaintenance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('machines')
    .select(`
      id, name, next_maintenance_date, maintenance_cycle_days, last_maintenance_date,
      project:projects(id, name, color)
    `)
    .not('next_maintenance_date', 'is', null)
    .order('next_maintenance_date', { ascending: true })
    .limit(5)

  return data || []
}

export async function getRecentActivity() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('activity_log')
    .select(`
      *,
      actor:users!activity_log_actor_id_fkey(id, name, avatar_url),
      project:projects(id, name, color)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}
