'use client'

import { Bell } from 'lucide-react'

export function NotificationBell() {
  return (
    <button className="relative p-2 hover:bg-[#27272A] rounded-lg transition-colors">
      <Bell className="w-6 h-6 text-[#A1A1AA]" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-[#F43F5E] rounded-full"></span>
    </button>
  )
}
