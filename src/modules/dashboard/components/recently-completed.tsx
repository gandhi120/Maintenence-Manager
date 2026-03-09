'use client'

import { CheckCircle } from 'lucide-react'

interface CompletedWorkOrder {
  id: string
  actual_completion: string | null
  issue?: {
    id: string
    title: string
    machine?: { id: string; name: string } | null
  } | null
}

interface RecentlyCompletedProps {
  workOrders: CompletedWorkOrder[]
}

const demoCompleted: CompletedWorkOrder[] = [
  { id: '1', actual_completion: '2026-03-08', issue: { id: '1', title: 'Overheating fix', machine: { id: '4', name: 'Air Compressor' } } },
  { id: '2', actual_completion: '2026-03-07', issue: { id: '2', title: 'Filter replacement', machine: { id: '2', name: 'Excavator B-12' } } },
  { id: '3', actual_completion: '2026-03-06', issue: { id: '3', title: 'Calibration check', machine: { id: '1', name: 'Tower Crane' } } },
]

export function RecentlyCompleted({ workOrders }: RecentlyCompletedProps) {
  const items = workOrders.length > 0 ? workOrders : demoCompleted

  if (items.length === 0) return null

  return (
    <div>
      <h2 className="text-base font-semibold text-[#FAFAFA] mb-3">Recently Completed</h2>
      <div className="space-y-2">
        {items.map((wo) => (
          <div
            key={wo.id}
            className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4"
          >
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#FAFAFA]">{wo.issue?.title || 'Work Order'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#A1A1AA]">{wo.issue?.machine?.name}</span>
                  {wo.actual_completion && (
                    <span className="text-xs text-[#10B981]">
                      Completed {new Date(wo.actual_completion).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
