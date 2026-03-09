'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface OverdueWorkOrder {
  id: string
  estimated_completion: string | null
  project_id: string
  issue?: {
    id: string
    title: string
    priority: string
    machine?: { id: string; name: string } | null
  } | null
}

interface OverdueSectionProps {
  workOrders: OverdueWorkOrder[]
}

export function OverdueSection({ workOrders }: OverdueSectionProps) {
  if (workOrders.length === 0) return null

  return (
    <div>
      <h2 className="text-base font-semibold text-[#F43F5E] mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Overdue ({workOrders.length})
      </h2>
      <div className="space-y-2">
        {workOrders.map((wo) => {
          const daysOverdue = wo.estimated_completion
            ? Math.abs(Math.ceil((new Date(wo.estimated_completion).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : 0

          return (
            <Link
              key={wo.id}
              href={`/projects/${wo.project_id}/issues/${wo.issue?.id}`}
              className="block bg-[#F43F5E]/5 border border-[#F43F5E]/20 rounded-xl p-4 hover:border-[#F43F5E]/40 transition-all"
            >
              <div className="flex items-start gap-2 mb-1">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-[#F43F5E]" />
                <h3 className="text-sm font-medium text-[#FAFAFA] flex-1">{wo.issue?.title || 'Work Order'}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A1A1AA]">{wo.issue?.machine?.name}</span>
                <span className="text-xs text-[#F43F5E]">{daysOverdue}d overdue</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
