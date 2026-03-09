'use client'

import { ProgressRing } from '@/shared/components/ui/progress-ring'
import { maintenanceProgress, daysUntil, formatDate } from '@/lib/utils/date'

interface MaintenanceProgressRingProps {
  lastMaintenanceDate: string | null
  nextMaintenanceDate: string | null
  cycleDays: number
}

export function MaintenanceProgressRing({
  lastMaintenanceDate,
  nextMaintenanceDate,
  cycleDays,
}: MaintenanceProgressRingProps) {
  const progress = maintenanceProgress(lastMaintenanceDate, cycleDays)
  const daysLeft = nextMaintenanceDate ? daysUntil(nextMaintenanceDate) : null

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
      <h3 className="text-sm font-semibold text-primary mb-3">Maintenance Cycle</h3>
      <div className="flex items-center gap-4">
        <ProgressRing progress={progress} size={80} strokeWidth={8} />
        <div className="space-y-1">
          <div className="text-sm text-secondary">
            Last: {lastMaintenanceDate ? formatDate(lastMaintenanceDate) : 'Not set'}
          </div>
          <div className="text-sm text-secondary">
            Next: {nextMaintenanceDate ? formatDate(nextMaintenanceDate) : 'Not set'}
          </div>
          {daysLeft !== null && (
            <div className={`text-sm font-medium ${daysLeft <= 3 ? 'text-danger' : daysLeft <= 7 ? 'text-warning' : 'text-success'}`}>
              {daysLeft <= 0 ? 'Overdue!' : `${daysLeft} days remaining`}
            </div>
          )}
          <div className="text-xs text-secondary">Cycle: {cycleDays} days</div>
        </div>
      </div>
    </div>
  )
}
