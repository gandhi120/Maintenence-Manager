import { cn } from '@/lib/utils/cn'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('min-h-screen bg-background pb-20', className)}>
      {children}
    </div>
  )
}
