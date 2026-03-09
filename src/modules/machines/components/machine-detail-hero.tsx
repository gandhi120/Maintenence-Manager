import { Wrench, MapPin, Hash } from 'lucide-react'
import { StatusBadge } from '@/shared/components/data-display/status-badge'
import type { Machine } from '@/shared/types/common.types'

interface MachineDetailHeroProps {
  machine: Machine & { project?: { id: string; name: string; color: string } | null }
}

export function MachineDetailHero({ machine }: MachineDetailHeroProps) {
  return (
    <div>
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
            <Wrench className="h-12 w-12 text-secondary/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">{machine.name}</h1>
            <p className="text-sm text-secondary">{machine.type}</p>
          </div>
          <StatusBadge status={machine.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {machine.serial_number && (
            <div className="flex items-center gap-1.5 text-sm text-secondary">
              <Hash className="h-3.5 w-3.5" />
              <span>{machine.serial_number}</span>
            </div>
          )}
          {machine.zone && (
            <div className="flex items-center gap-1.5 text-sm text-secondary">
              <MapPin className="h-3.5 w-3.5" />
              <span>{machine.zone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
