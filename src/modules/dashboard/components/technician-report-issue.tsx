'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

interface TechnicianReportIssueProps {
  projects: Array<{ id: string; name: string; color: string }>
}

const demoProjects = [
  { id: '1', name: 'Construction Site A', color: '#8B5CF6' },
  { id: '2', name: 'Honda Factory Line 2', color: '#10B981' },
]

export function TechnicianReportIssue({ projects }: TechnicianReportIssueProps) {
  const displayProjects = projects.length > 0 ? projects : demoProjects

  if (displayProjects.length === 0) return null

  return (
    <div>
      <h2 className="text-base font-semibold text-[#FAFAFA] mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#F43F5E]" />
        Report Issue
      </h2>
      <div className="space-y-2">
        {displayProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}/issues/new`}
            className="flex items-center gap-3 p-4 bg-[#18181B] border border-[#3F3F46] rounded-xl hover:border-[#F43F5E]/50 transition-all"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-sm text-[#FAFAFA] flex-1">{project.name}</span>
            <span className="text-xs text-[#F43F5E] font-medium">Report</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
