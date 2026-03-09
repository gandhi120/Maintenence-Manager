'use client'

import { Plus } from 'lucide-react'

const workOrders = {
  open: [
    { id: 1, title: 'Hydraulic oil leak', machine: 'Tower Crane', priority: 'high', due: 'Mar 12' },
  ],
  assigned: [
    { id: 2, title: 'Belt replacement', machine: 'Generator', assigned: 'Amit', priority: 'medium', due: 'Mar 14' },
  ],
  inProgress: [
    { id: 3, title: 'Engine inspection', machine: 'Excavator', assigned: 'Priya', priority: 'low', due: 'Mar 15' },
    { id: 4, title: 'Cooling system repair', machine: 'Generator', assigned: 'Amit', priority: 'high', due: 'Mar 13' },
  ],
  completed: [
    { id: 5, title: 'Overheating fix', machine: 'Compressor', assigned: 'Amit', priority: 'medium', due: 'Mar 8' },
  ],
}

function getPriorityDot(priority: string) {
  if (priority === 'high') return 'bg-[#F43F5E]'
  if (priority === 'medium') return 'bg-[#F59E0B]'
  return 'bg-[#10B981]'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function KanbanBoard({ projectId }: { projectId: string }) {
  const columns = [
    { title: 'Open', items: workOrders.open, color: 'text-[#A1A1AA]' },
    { title: 'Assigned', items: workOrders.assigned, color: 'text-[#38BDF8]' },
    { title: 'In Progress', items: workOrders.inProgress, color: 'text-[#8B5CF6]' },
    { title: 'Completed', items: workOrders.completed, color: 'text-[#10B981]' },
  ]

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
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${getPriorityDot(order.priority)}`}></div>
                    <h4 className="text-sm font-medium text-[#FAFAFA] flex-1">{order.title}</h4>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mb-2">{order.machine}</p>
                  <div className="flex items-center justify-between">
                    {'assigned' in order && order.assigned && (
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                          {(order.assigned as string).charAt(0)}
                        </div>
                        <span className="text-xs text-[#A1A1AA]">{order.assigned}</span>
                      </div>
                    )}
                    <span className="text-xs text-[#A1A1AA]">{order.due}</span>
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
