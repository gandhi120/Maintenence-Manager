import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
}

export function ErrorDisplay({ message = 'Something went wrong', onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-danger/20 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-danger" />
      </div>
      <p className="text-sm text-secondary mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
