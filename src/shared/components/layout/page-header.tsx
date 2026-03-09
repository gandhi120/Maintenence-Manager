'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, showBack, action, className }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn('flex items-center justify-between px-4 py-3', className)}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-elevated transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-secondary">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
