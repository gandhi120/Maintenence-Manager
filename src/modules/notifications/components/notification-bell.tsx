'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { NotificationPanel } from './notification-panel'
import { getUnreadCount } from '@/modules/notifications/actions/notification.actions'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    getUnreadCount().then(setUnreadCount).catch(() => setUnreadCount(0))
  }, [])

  // Refresh count when panel closes
  useEffect(() => {
    if (!open) {
      getUnreadCount().then(setUnreadCount).catch(() => setUnreadCount(0))
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 hover:bg-[#27272A] rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-[#A1A1AA]" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-[#F43F5E] rounded-full flex items-center justify-center text-[10px] text-white font-medium px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      <NotificationPanel open={open} onOpenChange={setOpen} />
    </>
  )
}
