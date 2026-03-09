'use client'

import { Plus } from 'lucide-react'

interface WorkOrderItem {
  id: string
  status: string
  issue?: {
    id: string
    title: string
    priority: string
    machine?: { id: string; name: string } | null
  } | null
  assignee?: { id: string; name: string; avatar_url: string | null } | null
  estimated_completion: string | null
}

interface KanbanBoardProps {
  projectId: string
  workOrders: WorkOrderItem[]
}

function getPriorityDot(priority: string) {
  if (priority === 'high') return 'bg-[#F43F5E]'
  if (priority === 'medium') return 'bg-[#F59E0B]'
  return 'bg-[#10B981]'
}

export function KanbanBoard({ projectId, workOrders }: KanbanBoardProps) {
  const open = workOrders.filter(wo => wo.status === 'open')
  const assigned = workOrders.filter(wo => wo.status === 'assigned')
  const inProgress = workOrders.filter(wo => wo.status === 'in_progress')
  const completed = workOrders.filter(wo => wo.status === 'completed')

  const columns = [
    { title: 'Open', items: open, color: 'text-[#A1A1AA]' },
    { title: 'Assigned', items: assigned, color: 'text-[#38BDF8]' },
    { title: 'In Progress', items: inProgress, color: 'text-[#8B5CF6]' },
    { title: 'Completed', items: completed, color: 'text-[#10B981]' },
  ]

  if (workOrders.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-8 text-center">
          <p className="text-sm text-[#A1A1AA]">Work orders are not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <button className="mb-4 h-10 px-4 bg-[#8B5CF6] text-white rounded-lg flex items-center gap-2 hover:bg-[#7C3AED] transition-colors font-medium ml-auto">
        <Plus className="w-4 h-4" />
        New Order
      </button>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.title} className="flex-shrink-0 w-64">
            <div className="flex items-center gap-2 mb-3">
              <h3 className={`text-sm font-semibold ${column.color}`}>{column.title}</h3>
              <span className="text-xs bg-[#27272A] text-[#A1A1AA] px-2 py-0.5 rounded-full">
                {column.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {column.items.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-[#18181B] border border-[#3F3F46] rounded-lg hover:border-[#8B5CF6]/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${getPriorityDot(order.issue?.priority || 'medium')}`}></div>
                    <h4 className="text-sm font-medium text-[#FAFAFA] flex-1">{order.issue?.title || 'Work Order'}</h4>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mb-2">{order.issue?.machine?.name || ''}</p>
                  <div className="flex items-center justify-between">
                    {order.assignee && (
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                          {order.assignee.name.charAt(0)}
                        </div>
                        <span className="text-xs text-[#A1A1AA]">{order.assignee.name}</span>
                      </div>
                    )}
                    {order.estimated_completion && (
                      <span className="text-xs text-[#A1A1AA]">{order.estimated_completion}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
