import { getDashboardStats, getCriticalIssues, getUpcomingMaintenance, getRecentActivity } from '@/modules/dashboard/actions/dashboard.actions'
import { getTechnicianStats, getActiveWorkOrders, getOverdueWorkOrders, getRecentlyCompleted, getTechnicianProjects } from '@/modules/dashboard/actions/technician-dashboard.actions'
import { getCurrentUser } from '@/modules/auth/actions/auth.actions'
import { StatsGrid } from '@/modules/dashboard/components/stats-grid'
import { CriticalIssuesFeed } from '@/modules/dashboard/components/critical-issues-feed'
import { UpcomingMaintenance } from '@/modules/dashboard/components/upcoming-maintenance'
import { RecentActivity } from '@/modules/dashboard/components/recent-activity'
import { TechnicianStatsGrid } from '@/modules/dashboard/components/technician-stats-grid'
import { ActiveWorkOrdersList } from '@/modules/dashboard/components/active-work-orders-list'
import { OverdueSection } from '@/modules/dashboard/components/overdue-section'
import { RecentlyCompleted } from '@/modules/dashboard/components/recently-completed'
import { NotificationBell } from '@/modules/notifications/components/notification-bell'
import { TechnicianReportIssue } from '@/modules/dashboard/components/technician-report-issue'

export default async function DashboardPage() {
  let currentUser: { id: string; name: string; role: string } | null = null

  try {
    currentUser = await getCurrentUser()
  } catch {
    // Supabase not configured
  }

  const isTechnician = currentUser?.role === 'technician'
  const userName = currentUser?.name || (currentUser as { mobile_number?: string } | null)?.mobile_number || 'User'

  if (isTechnician && currentUser) {
    // Technician Dashboard
    let techStats = null
    let activeWOs: never[] = []
    let overdueWOs: never[] = []
    let completedWOs: never[] = []
    let techProjects: never[] = []

    try {
      const results = await Promise.all([
        getTechnicianStats(currentUser.id),
        getActiveWorkOrders(currentUser.id),
        getOverdueWorkOrders(currentUser.id),
        getRecentlyCompleted(currentUser.id),
        getTechnicianProjects(currentUser.id),
      ])
      techStats = results[0]
      activeWOs = results[1] as never[]
      overdueWOs = results[2] as never[]
      completedWOs = results[3] as never[]
      techProjects = results[4] as never[]
    } catch {
      // Supabase not configured
    }

    return (
      <div className="min-h-screen bg-[#09090B]">
        {/* Header */}
        <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#FAFAFA]">My Tasks</h1>
              <p className="text-sm text-[#A1A1AA]">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <NotificationBell />
          </div>
        </div>

        <div className="p-4 space-y-6 pb-24">
          <TechnicianStatsGrid stats={techStats} />
          <OverdueSection workOrders={overdueWOs} />
          <ActiveWorkOrdersList workOrders={activeWOs} />
          <RecentlyCompleted workOrders={completedWOs} />
          <TechnicianReportIssue projects={techProjects as Array<{ id: string; name: string; color: string }>} />
        </div>
      </div>
    )
  }

  // Manager Dashboard (default / demo)
  let stats = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawCriticalIssues: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawUpcomingMaintenance: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawRecentActivity: any[] = []

  try {
    const results = await Promise.all([
      getDashboardStats(),
      getCriticalIssues(),
      getUpcomingMaintenance(),
      getRecentActivity(),
    ])
    stats = results[0]
    rawCriticalIssues = results[1] || []
    rawUpcomingMaintenance = results[2] || []
    rawRecentActivity = results[3] || []
  } catch {
    // Supabase not configured yet
  }

  // Transform critical issues to component format
  const criticalIssues = rawCriticalIssues.map((issue) => {
    const createdAt = new Date(issue.created_at)
    const hoursAgo = Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60))
    const timeLabel = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`
    return {
      id: issue.id,
      title: issue.title,
      project: issue.project?.name || 'Unknown',
      projectColor: `bg-[${issue.project?.color || '#8B5CF6'}]`,
      machine: issue.machine?.name || 'Unknown',
      priority: issue.priority,
      time: timeLabel,
    }
  })

  // Transform upcoming maintenance to component format
  const upcomingMaintenance = rawUpcomingMaintenance.map((m) => {
    const dueDate = new Date(m.next_maintenance_date)
    const daysUntil = Math.max(0, Math.round((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    return {
      machineId: m.id,
      projectId: m.project?.id,
      machine: m.name,
      project: m.project?.name || 'Unknown',
      projectColor: `bg-[${m.project?.color || '#8B5CF6'}]`,
      dueIn: daysUntil === 0 ? 'Today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
    }
  })

  // Transform recent activity
  const recentActivity = rawRecentActivity.map((a) => ({
    id: a.id,
    action: a.action,
    description: a.description,
    created_at: a.created_at,
  }))

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#FAFAFA]">Welcome back, {userName}</h1>
            <p className="text-sm text-[#A1A1AA]">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <NotificationBell />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        <StatsGrid stats={stats} />
        <CriticalIssuesFeed issues={criticalIssues} />
        <UpcomingMaintenance machines={upcomingMaintenance} />
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  )
}
