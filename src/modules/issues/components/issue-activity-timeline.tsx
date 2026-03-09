import { Clock, AlertTriangle, UserCheck, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react'
import { timeAgo } from '@/lib/utils/date'

interface ActivityItem {
  id: string
  action: string
  description: string
  created_at: string
  actor?: { id: string; name: string; avatar_url: string | null } | null
}

interface IssueActivityTimelineProps {
  activities: ActivityItem[]
}

const actionIcons: Record<string, typeof AlertTriangle> = {
  issue_created: AlertTriangle,
  issue_assigned: UserCheck,
  status_changed: ArrowRight,
  note_added: MessageSquare,
  resolved: CheckCircle,
}

export function IssueActivityTimeline({ activities }: IssueActivityTimelineProps) {
  return (
    <div className="px-4">
      <h3 className="text-sm font-semibold text-primary mb-3">Activity</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-secondary text-center py-4">No activity yet</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const Icon = actionIcons[activity.action] || ArrowRight
            return (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated">
                    <Icon className="h-3.5 w-3.5 text-secondary" />
                  </div>
                  {i < activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-primary">
                    <span className="font-medium">{activity.actor?.name || 'System'}</span>
                    {' '}{activity.description}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-secondary mt-0.5">
                    <Clock className="h-3 w-3" />
                    {timeAgo(activity.created_at)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
