'use client'

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: string
}

export function StatCard({ title, value, icon: Icon, trend, trendValue, color = '#8B5CF6' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-2 flex items-center gap-1">
          <span className={cn(
            'text-xs font-medium',
            trend === 'up' && 'text-success',
            trend === 'down' && 'text-danger',
            trend === 'neutral' && 'text-secondary',
          )}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
          </span>
          <span className="text-xs text-secondary">vs last week</span>
        </div>
      )}
    </div>
  )
}
