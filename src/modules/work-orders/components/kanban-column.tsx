'use client'

import { KanbanCard } from './kanban-card'
import { cn } from '@/lib/utils/cn'

interface KanbanColumnProps {
  label: string
  color: string
  status: string
  items: Array<{
    id: string
    status: string
    issue_id: string
    notes: string | null
    estimated_completion: string | null
    issue?: {
      id: string
      title: string
      priority: string
      machine?: { id: string; name: string } | null
    } | null
    assignee?: { id: string; name: string; avatar_url: string | null } | null
  }>
  projectId: string
  onDrop: (workOrderId: string, newStatus: string) => void
  dragging: string | null
  setDragging: (id: string | null) => void
}

export function KanbanColumn({ label, color, status, items, projectId, onDrop, dragging, setDragging }: KanbanColumnProps) {
  return (
    <div
      className={cn(
        'min-w-[260px] flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3',
        dragging && 'ring-1 ring-accent/20'
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const workOrderId = e.dataTransfer.getData('text/plain')
        if (workOrderId) {
          onDrop(workOrderId, status)
          setDragging(null)
        }
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-primary">{label}</h3>
        <span className="text-xs text-secondary ml-auto">{items.length}</span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            projectId={projectId}
            onDragStart={() => setDragging(item.id)}
            onDragEnd={() => setDragging(null)}
          />
        ))}
      </div>
    </div>
  )
}
