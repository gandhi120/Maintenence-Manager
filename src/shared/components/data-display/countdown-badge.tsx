import { cn } from '@/lib/utils/cn'
import { daysUntil } from '@/lib/utils/date'

interface CountdownBadgeProps {
  date: string
  className?: string
}

export function CountdownBadge({ date, className }: CountdownBadgeProps) {
  const days = daysUntil(date)
  if (days === null) return null

  const getStyle = () => {
    if (days <= 0) return 'bg-danger/20 text-danger'
    if (days <= 3) return 'bg-danger/20 text-danger'
    if (days <= 7) return 'bg-warning/20 text-warning'
    return 'bg-success/20 text-success'
  }

  const getText = () => {
    if (days <= 0) return 'Overdue'
    if (days === 1) return '1 day'
    return `${days} days`
  }

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getStyle(), className)}>
      {getText()}
    </span>
  )
}
