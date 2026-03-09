import Link from 'next/link'

const demoIssues = [
  {
    id: 1,
    title: 'Hydraulic oil leak detected',
    project: 'Construction Site A',
    projectColor: 'bg-[#8B5CF6]',
    machine: 'Tower Crane',
    priority: 'High',
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Engine overheating',
    project: 'Honda Factory',
    projectColor: 'bg-[#10B981]',
    machine: 'Generator Unit 3',
    priority: 'High',
    time: '4h ago',
  },
  {
    id: 3,
    title: 'Belt worn out',
    project: 'Tata Steel Plant',
    projectColor: 'bg-[#F59E0B]',
    machine: 'Conveyor B-12',
    priority: 'Medium',
    time: '6h ago',
  },
]

interface CriticalIssuesFeedProps {
  issues: never[]
}

export function CriticalIssuesFeed({ issues }: CriticalIssuesFeedProps) {
  const displayIssues = issues.length > 0 ? issues : demoIssues

  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#FAFAFA]">Critical Issues</h2>
        <Link href="/projects" className="text-sm text-[#8B5CF6] hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {(displayIssues as typeof demoIssues).map((issue) => (
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
    </div>
  )
}
