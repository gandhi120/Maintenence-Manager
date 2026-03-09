import { cn } from '@/lib/utils/cn'

interface HealthIndicatorProps {
  openIssueCount: number
  className?: string
}

export function HealthIndicator({ openIssueCount, className }: HealthIndicatorProps) {
  const getHealth = () => {
    if (openIssueCount > 5) return { color: 'bg-danger', label: 'Critical' }
    if (openIssueCount >= 3) return { color: 'bg-warning', label: 'Warning' }
    return { color: 'bg-success', label: 'Healthy' }
  }

  const { color, label } = getHealth()

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('h-2 w-2 rounded-full', color)} />
      <span className="text-xs text-secondary">{label}</span>
    </div>
  )
}
