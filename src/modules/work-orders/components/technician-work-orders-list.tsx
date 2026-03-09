'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'

interface WorkOrderItem {
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

interface TechnicianWorkOrdersListProps {
  workOrders: WorkOrderItem[]
  projectId: string
}

function getPriorityDot(priority: string) {
  if (priority === 'high') return 'bg-[#F43F5E]'
  if (priority === 'medium') return 'bg-[#F59E0B]'
  return 'bg-[#10B981]'
}

function getStatusBadge(status: string) {
  if (status === 'completed') return { label: 'Completed', color: 'bg-[#10B981]/20 text-[#10B981]' }
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

export function TechnicianWorkOrdersList({ workOrders, projectId }: TechnicianWorkOrdersListProps) {
  const items = workOrders

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold text-[#FAFAFA] mb-4">My Work Orders</h2>

      {items.length === 0 ? (
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6 text-center">
          <p className="text-sm text-[#A1A1AA]">No work orders assigned to you in this project.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((wo) => {
            const statusBadge = getStatusBadge(wo.status)
            const deadline = daysUntil(wo.estimated_completion)
            const isOverdue = wo.estimated_completion && new Date(wo.estimated_completion) < new Date() && wo.status !== 'completed'

            return (
              <Link
                key={wo.id}
                href={`/projects/${projectId}/issues/${wo.issue?.id}`}
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
      )}
    </div>
  )
}
