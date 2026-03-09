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

export function CriticalIssuesFeed({ issues: _issues }: CriticalIssuesFeedProps) {
  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#FAFAFA]">Critical Issues</h2>
        <span className="text-xs text-[#A1A1AA] bg-[#27272A] px-2 py-1 rounded-md">Coming Soon</span>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6 text-[#52525B]" />
        </div>
        <p className="text-sm text-[#A1A1AA]">This feature is coming soon</p>
      </div>
    </div>
  )
}
