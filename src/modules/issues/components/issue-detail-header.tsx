import { PriorityBadge } from '@/shared/components/data-display/priority-badge'
import { StatusBadge } from '@/shared/components/data-display/status-badge'
import { timeAgo } from '@/lib/utils/date'
import type { Priority, IssueStatus } from '@/shared/types/common.types'

interface IssueDetailHeaderProps {
  issue: {
    title: string
    description: string | null
    priority: Priority
    status: IssueStatus
    created_at: string
    machine?: { id: string; name: string; type: string } | null
    project?: { id: string; name: string; color: string } | null
  }
}

export function IssueDetailHeader({ issue }: IssueDetailHeaderProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-lg font-bold text-primary">{issue.title}</h1>
        <PriorityBadge priority={issue.priority} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={issue.status} />
        {issue.project && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: `${issue.project.color}20`, color: issue.project.color }}
          >
            {issue.project.name}
          </span>
        )}
        {issue.machine && (
          <span className="text-xs text-secondary bg-elevated px-2 py-0.5 rounded">
            {issue.machine.name}
          </span>
        )}
        <span className="text-xs text-secondary">{timeAgo(issue.created_at)}</span>
      </div>

      {issue.description && (
        <p className="text-sm text-secondary leading-relaxed">{issue.description}</p>
      )}
    </div>
  )
}
