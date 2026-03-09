'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'

interface ActiveWorkOrder {
  id: string
  status: string
  estimated_completion: string | null
  project_id: string
  issue?: {
    id: string
    title: string
    priority: string
    machine?: { id: string; name: string } | null
  } | null
}

interface ActiveWorkOrdersListProps {
  workOrders: ActiveWorkOrder[]
}

const demoWorkOrders: ActiveWorkOrder[] = [
  { id: '1', status: 'in_progress', estimated_completion: '2026-03-12', project_id: '1', issue: { id: '1', title: 'Hydraulic oil leak in boom section', priority: 'high', machine: { id: '1', name: 'Tower Crane' } } },
  { id: '2', status: 'assigned', estimated_completion: '2026-03-14', project_id: '1', issue: { id: '2', title: 'Belt replacement needed', priority: 'medium', machine: { id: '3', name: 'Generator Unit 3' } } },
  { id: '3', status: 'in_progress', estimated_completion: '2026-03-15', project_id: '2', issue: { id: '3', title: 'Engine inspection overdue', priority: 'low', machine: { id: '2', name: 'Excavator B-12' } } },
]

function getPriorityDot(priority: string) {
  if (priority === 'high') return 'bg-[#F43F5E]'
  if (priority === 'medium') return 'bg-[#F59E0B]'
  return 'bg-[#10B981]'
}

function getStatusBadge(status: string) {
  if (status === 'in_progress') return { label: 'In Progress', color: 'bg-[#8B5CF6]/20 text-[#8B5CF6]' }
  if (status === 'assigned') return { label: 'Assigned', color: 'bg-[#38BDF8]/20 text-[#38BDF8]' }
  return { label: 'Open', color: 'bg-[#27272A] text-[#A1A1AA]' }
}

function daysUntil(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `${diff}d left`
}

export function ActiveWorkOrdersList({ workOrders }: ActiveWorkOrdersListProps) {
  const items = workOrders.length > 0 ? workOrders : demoWorkOrders

  if (items.length === 0) {
    return (
      <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6">
        <p className="text-sm text-[#A1A1AA] text-center">No active work orders</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-[#FAFAFA] mb-3">Active Work Orders</h2>
      <div className="space-y-2">
        {items.map((wo) => {
          const statusBadge = getStatusBadge(wo.status)
          const deadline = daysUntil(wo.estimated_completion)
          const isOverdue = wo.estimated_completion && new Date(wo.estimated_completion) < new Date()

          return (
            <Link
              key={wo.id}
              href={`/projects/${wo.project_id}/issues/${wo.issue?.id}`}
              className="block bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 hover:border-[#38BDF8]/50 transition-all"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getPriorityDot(wo.issue?.priority || 'medium')}`} />
                <h3 className="text-sm font-medium text-[#FAFAFA] flex-1">{wo.issue?.title || 'Work Order'}</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#A1A1AA]">{wo.issue?.machine?.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md ${statusBadge.color}`}>{statusBadge.label}</span>
                {deadline && (
                  <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-[#F43F5E]' : 'text-[#A1A1AA]'}`}>
                    <Clock className="w-3 h-3" />
                    {deadline}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
