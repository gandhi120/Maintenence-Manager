'use client'

import Link from 'next/link'
import { PriorityBadge } from '@/shared/components/data-display/priority-badge'
import { CountdownBadge } from '@/shared/components/data-display/countdown-badge'
import type { Priority } from '@/shared/types/common.types'

interface KanbanCardProps {
  item: {
    id: string
    issue_id: string
    estimated_completion: string | null
    issue?: {
      id: string
      title: string
      priority: string
      machine?: { id: string; name: string } | null
    } | null
    assignee?: { id: string; name: string; avatar_url: string | null } | null
  }
  projectId: string
  onDragStart: () => void
  onDragEnd: () => void
}

export function KanbanCard({ item, projectId, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id)
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-3 cursor-grab active:cursor-grabbing hover:bg-white/[0.06] transition-colors"
    >
      <Link href={`/projects/${projectId}/issues/${item.issue_id}`}>
        <h4 className="text-sm font-medium text-primary line-clamp-2">
          {item.issue?.title || 'Untitled'}
        </h4>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {item.issue?.machine && (
            <span className="text-xs text-secondary bg-elevated px-1.5 py-0.5 rounded">
              {item.issue.machine.name}
            </span>
          )}
          {item.issue?.priority && (
            <PriorityBadge priority={item.issue.priority as Priority} />
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {item.assignee && (
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-elevated flex items-center justify-center overflow-hidden">
                {item.assignee.avatar_url ? (
                  <img src={item.assignee.avatar_url} alt="" className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <span className="text-[10px] font-medium text-secondary">
                    {item.assignee.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <span className="text-xs text-secondary">{item.assignee.name}</span>
            </div>
          )}
          {item.estimated_completion && (
            <CountdownBadge date={item.estimated_completion} />
          )}
        </div>
      </Link>
    </div>
  )
}
