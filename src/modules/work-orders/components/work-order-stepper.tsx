import { cn } from '@/lib/utils/cn'
import { Check } from 'lucide-react'

const steps = [
  { status: 'open', label: 'Open' },
  { status: 'assigned', label: 'Assigned' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'completed', label: 'Completed' },
]

interface WorkOrderStepperProps {
  currentStatus: string
}

export function WorkOrderStepper({ currentStatus }: WorkOrderStepperProps) {
  const currentIndex = steps.findIndex(s => s.status === currentStatus)

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex
        const isLast = i === steps.length - 1

        return (
          <div key={step.status} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isCompleted && 'bg-success text-white',
                  isCurrent && 'bg-accent text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]',
                  !isCompleted && !isCurrent && 'bg-elevated text-secondary'
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'mt-1 text-[10px] whitespace-nowrap',
                isCurrent ? 'text-accent font-medium' : 'text-secondary'
              )}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={cn(
                'h-px flex-1 mx-1',
                i < currentIndex ? 'bg-success' : 'bg-border'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
