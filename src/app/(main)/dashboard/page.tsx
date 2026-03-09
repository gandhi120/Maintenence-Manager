import { getDashboardStats, getCriticalIssues, getUpcomingMaintenance, getRecentActivity } from '@/modules/dashboard/actions/dashboard.actions'
import { StatsGrid } from '@/modules/dashboard/components/stats-grid'
import { CriticalIssuesFeed } from '@/modules/dashboard/components/critical-issues-feed'
import { UpcomingMaintenance } from '@/modules/dashboard/components/upcoming-maintenance'
import { RecentActivity } from '@/modules/dashboard/components/recent-activity'
import { NotificationBell } from '@/modules/notifications/components/notification-bell'

export default async function DashboardPage() {
  let stats = null
  let criticalIssues: never[] = []
  let upcomingMaintenance: never[] = []
  let recentActivity: never[] = []

  try {
    const results = await Promise.all([
      getDashboardStats(),
      getCriticalIssues(),
      getUpcomingMaintenance(),
      getRecentActivity(),
    ])
    stats = results[0]
    criticalIssues = results[1] as never[]
    upcomingMaintenance = results[2] as never[]
    recentActivity = results[3] as never[]
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#FAFAFA]">Welcome back, Rajesh</h1>
            <p className="text-sm text-[#A1A1AA]">Monday, March 9, 2026</p>
          </div>
          <NotificationBell />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Critical Issues */}
        <CriticalIssuesFeed issues={criticalIssues as never[]} />

        {/* Upcoming Maintenance */}
        <UpcomingMaintenance machines={upcomingMaintenance as never[]} />

        {/* Recent Activity */}
        <RecentActivity activities={recentActivity as never[]} />
      </div>
    </div>
  )
}
