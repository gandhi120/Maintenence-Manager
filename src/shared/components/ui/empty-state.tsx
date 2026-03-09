import { cn } from '@/lib/utils/cn'
import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="rounded-full bg-elevated p-4 mb-4">
        <Icon className="h-8 w-8 text-secondary" />
      </div>
      <h3 className="text-base font-semibold text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-secondary max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
