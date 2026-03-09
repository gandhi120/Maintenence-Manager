'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { LoadingSpinner } from '@/shared/components/feedback/loading-spinner'
import { getNotifications, markAsRead, markAllAsRead } from '@/modules/notifications/actions/notification.actions'
import { CheckCheck } from 'lucide-react'

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface NotificationData {
  id: string
  type: string
  title: string
  body: string
  is_read: boolean
  reference_type: string | null
  reference_id: string | null
  created_at: string
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getNotifications().then((data) => {
        setNotifications(data as NotificationData[])
        setLoading(false)
      }).catch(() => {
        setNotifications([])
        setLoading(false)
      })
    }
  }, [open])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  // Group by day
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const grouped = {
    today: notifications.filter(n => new Date(n.created_at) >= today),
    yesterday: notifications.filter(n => {
      const d = new Date(n.created_at)
      return d >= yesterday && d < today
    }),
    earlier: notifications.filter(n => new Date(n.created_at) < yesterday),
  }

  const hasUnread = notifications.some(n => !n.is_read)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#8B5CF6] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-4 -mx-6 px-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : notifications.length === 0 ? (
            <p className="text-sm text-secondary text-center py-12">No notifications yet</p>
          ) : (
            <div className="space-y-6">
              {grouped.today.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-secondary uppercase mb-2">Today</h3>
                  <div className="space-y-1">
                    {grouped.today.map(n => (
                      <NotificationRow key={n.id} notification={n} onMarkRead={handleMarkAsRead} />
                    ))}
                  </div>
                </div>
              )}
              {grouped.yesterday.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-secondary uppercase mb-2">Yesterday</h3>
                  <div className="space-y-1">
                    {grouped.yesterday.map(n => (
                      <NotificationRow key={n.id} notification={n} onMarkRead={handleMarkAsRead} />
                    ))}
                  </div>
                </div>
              )}
              {grouped.earlier.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-secondary uppercase mb-2">Earlier</h3>
                  <div className="space-y-1">
                    {grouped.earlier.map(n => (
                      <NotificationRow key={n.id} notification={n} onMarkRead={handleMarkAsRead} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function NotificationRow({ notification, onMarkRead }: { notification: NotificationData; onMarkRead: (id: string) => void }) {
  const timeAgo = getTimeAgo(notification.created_at)

  return (
    <div
      onClick={() => !notification.is_read && onMarkRead(notification.id)}
      className={`flex gap-3 rounded-lg p-3 transition-colors cursor-pointer ${
        notification.is_read ? 'opacity-60' : 'bg-[#8B5CF6]/5'
      } hover:bg-elevated`}
    >
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary">{notification.title}</p>
        <p className="text-sm text-secondary mt-0.5">{notification.body}</p>
        <span className="text-xs text-secondary mt-1 block">{timeAgo}</span>
      </div>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
