import { Wrench, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import type { MaintenanceLog } from '@/shared/types/common.types'

interface MaintenanceTimelineProps {
  logs: MaintenanceLog[]
}

export function MaintenanceTimeline({ logs }: MaintenanceTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
        <h3 className="text-sm font-semibold text-primary mb-3">Maintenance History</h3>
        <p className="text-sm text-secondary text-center py-4">No maintenance logged yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
      <h3 className="text-sm font-semibold text-primary mb-3">Maintenance History</h3>
      <div className="space-y-4">
        {logs.map((log, i) => (
          <div key={log.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Wrench className="h-4 w-4 text-accent" />
              </div>
              {i < logs.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-primary capitalize">
                {log.maintenance_type.replace(/_/g, ' ')}
              </p>
              {log.notes && (
                <p className="text-xs text-secondary mt-0.5">{log.notes}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-secondary" />
                <span className="text-xs text-secondary">{formatDate(log.date)}</span>
                {log.technician && (
                  <span className="text-xs text-secondary">by {log.technician.name}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
