import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { PriorityBadge } from '@/shared/components/data-display/priority-badge'
import { StatusBadge } from '@/shared/components/data-display/status-badge'
import { timeAgo } from '@/lib/utils/date'
import type { Priority, IssueStatus } from '@/shared/types/common.types'

interface IssueCardProps {
  issue: {
    id: string
    title: string
    priority: Priority
    status: IssueStatus
    created_at: string
    machine?: { id: string; name: string } | null
  }
  projectId: string
}

export function IssueCard({ issue, projectId }: IssueCardProps) {
  const borderColor = {
    high: 'border-l-danger',
    medium: 'border-l-warning',
    low: 'border-l-success',
  }[issue.priority]

  return (
    <Link
      href={`/projects/${projectId}/issues/${issue.id}`}
      className={`block rounded-xl border border-white/[0.06] border-l-[3px] ${borderColor} bg-white/[0.04] p-4 backdrop-blur-[12px] hover:bg-white/[0.06] transition-colors`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-primary truncate">{issue.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {issue.machine && (
              <span className="text-xs text-secondary bg-elevated px-2 py-0.5 rounded">
                {issue.machine.name}
              </span>
            )}
            <StatusBadge status={issue.status} />
            <span className="flex items-center gap-1 text-xs text-secondary">
              <Clock className="h-3 w-3" />
              {timeAgo(issue.created_at)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityBadge priority={issue.priority} />
          <ChevronRight className="h-4 w-4 text-secondary" />
        </div>
      </div>
    </Link>
  )
}
