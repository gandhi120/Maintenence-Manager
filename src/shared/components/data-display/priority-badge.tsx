import { Badge } from '@/shared/components/ui/badge'
import { PRIORITY_COLORS } from '@/lib/utils/constants'

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high'
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const color = PRIORITY_COLORS[priority]
  const label = priority.charAt(0).toUpperCase() + priority.slice(1)

  return (
    <Badge
      className={className}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </Badge>
  )
}
