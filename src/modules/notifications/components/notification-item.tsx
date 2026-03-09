import { timeAgo } from '@/lib/utils/date'
import { AlertTriangle, UserCheck, ArrowRight, CheckCircle, Wrench, Plus } from 'lucide-react'

interface NotificationItemProps {
  notification: {
    id: string
    action: string
    description: string
    created_at: string
    actor?: { id: string; name: string; avatar_url: string | null } | null
    project?: { id: string; name: string; color: string } | null
  }
}

const actionIcons: Record<string, typeof AlertTriangle> = {
  issue_created: AlertTriangle,
  issue_assigned: UserCheck,
  status_changed: ArrowRight,
  work_order_created: Plus,
  maintenance_logged: Wrench,
  resolved: CheckCircle,
  machine_added: Plus,
  project_created: Plus,
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const Icon = actionIcons[notification.action] || ArrowRight

  return (
    <div className="flex gap-3 rounded-lg p-2 hover:bg-elevated transition-colors cursor-pointer">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated">
        {notification.actor?.avatar_url ? (
          <img
            src={notification.actor.avatar_url}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <Icon className="h-4 w-4 text-secondary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-primary">
          <span className="font-medium">{notification.actor?.name || 'System'}</span>
          {' '}{notification.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {notification.project && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${notification.project.color}20`, color: notification.project.color }}
            >
              {notification.project.name}
            </span>
          )}
          <span className="text-xs text-secondary">{timeAgo(notification.created_at)}</span>
        </div>
      </div>
    </div>
  )
}
