'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { NotificationItem } from './notification-item'
import { getNotifications } from '@/modules/notifications/actions/notification.actions'
import { LoadingSpinner } from '@/shared/components/feedback/loading-spinner'

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Activity {
  id: string
  action: string
  description: string
  created_at: string
  actor?: { id: string; name: string; avatar_url: string | null } | null
  project?: { id: string; name: string; color: string } | null
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getNotifications().then((data) => {
        setNotifications(data as Activity[])
        setLoading(false)
      })
    }
  }, [open])

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
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
                    {grouped.today.map(n => <NotificationItem key={n.id} notification={n} />)}
                  </div>
                </div>
              )}
              {grouped.yesterday.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-secondary uppercase mb-2">Yesterday</h3>
                  <div className="space-y-1">
                    {grouped.yesterday.map(n => <NotificationItem key={n.id} notification={n} />)}
                  </div>
                </div>
              )}
              {grouped.earlier.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-secondary uppercase mb-2">Earlier</h3>
                  <div className="space-y-1">
                    {grouped.earlier.map(n => <NotificationItem key={n.id} notification={n} />)}
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
