'use client'

import { Moon, Bell, Wrench } from 'lucide-react'

export function PreferencesSection() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
      <h3 className="mb-4 text-sm font-semibold text-primary">Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-secondary" />
            <span className="text-sm text-primary">Dark Mode</span>
          </div>
          <div className="relative h-6 w-11 rounded-full bg-accent cursor-pointer">
            <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-secondary" />
            <span className="text-sm text-primary">Push Notifications</span>
          </div>
          <div className="relative h-6 w-11 rounded-full bg-elevated cursor-pointer">
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white/60 shadow transition-transform" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-secondary" />
            <span className="text-sm text-primary">Maintenance Reminders</span>
          </div>
          <div className="relative h-6 w-11 rounded-full bg-accent cursor-pointer">
            <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}
