import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

interface CriticalIssuesFeedProps {
  issues: Array<{
    id: string | number
    title: string
    project: string
    projectColor: string
    machine: string
    priority: string
    time: string
  }>
}

export function CriticalIssuesFeed({ issues }: CriticalIssuesFeedProps) {
  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#FAFAFA]">Critical Issues</h2>
        {issues.length > 0 && (
          <Link href="/projects" className="text-sm text-[#8B5CF6] hover:underline">
            View All
          </Link>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-[#52525B]" />
          </div>
          <p className="text-sm text-[#A1A1AA]">No critical issues yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-3 border-l-2 border-[#F43F5E] bg-[#27272A] rounded-lg hover:bg-[#27272A]/80 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-[#FAFAFA] flex-1">{issue.title}</h3>
                <span className="text-xs text-[#A1A1AA] ml-2">{issue.time}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`${issue.projectColor} text-white text-xs px-2 py-0.5 rounded-full`}>
                  {issue.project}
                </span>
                <span className="text-xs text-[#A1A1AA]">{issue.machine}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
