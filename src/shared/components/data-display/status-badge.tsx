import { Badge } from '@/shared/components/ui/badge'
import { STATUS_COLORS } from '@/lib/utils/constants'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#A1A1AA'
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <Badge
      className={className}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </Badge>
  )
}
