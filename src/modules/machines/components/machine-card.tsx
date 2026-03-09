import Link from 'next/link'
import { Wrench, MapPin } from 'lucide-react'
import { StatusBadge } from '@/shared/components/data-display/status-badge'
import { CountdownBadge } from '@/shared/components/data-display/countdown-badge'
import type { Machine } from '@/shared/types/common.types'

interface MachineCardProps {
  machine: Machine
  projectId: string
}

export function MachineCard({ machine, projectId }: MachineCardProps) {
  return (
    <Link
      href={`/projects/${projectId}/machines/${machine.id}`}
      className="block rounded-xl border border-white/[0.06] bg-white/[0.04] overflow-hidden backdrop-blur-[12px] hover:bg-white/[0.06] transition-colors"
    >
      {/* Image */}
      <div className="aspect-video bg-elevated relative overflow-hidden">
        {machine.image_url ? (
          <img
            src={machine.image_url}
            alt={machine.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Wrench className="h-8 w-8 text-secondary/40" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={machine.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-primary truncate">{machine.name}</h3>
        <p className="text-xs text-secondary mt-0.5">{machine.type}</p>
        <div className="flex items-center justify-between mt-2">
          {machine.zone && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-secondary" />
              <span className="text-xs text-secondary truncate">{machine.zone}</span>
            </div>
          )}
          {machine.next_maintenance_date && (
            <CountdownBadge date={machine.next_maintenance_date} />
          )}
        </div>
      </div>
    </Link>
  )
}
