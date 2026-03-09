'use client'

import { useState } from 'react'
import { Search, Plus, User } from 'lucide-react'
import Link from 'next/link'

const demoIssues = [
  {
    id: '1',
    title: 'Hydraulic oil leak detected',
    machine: 'Tower Crane',
    priority: 'High',
    priorityColor: 'border-[#F43F5E]',
    status: 'Open',
    statusColor: 'text-[#A1A1AA]',
    assigned: null,
    time: '2h ago',
  },
  {
    id: '2',
    title: 'Belt worn out in generator',
    machine: 'Generator Unit 3',
    priority: 'Medium',
    priorityColor: 'border-[#F59E0B]',
    status: 'Assigned',
    statusColor: 'text-[#38BDF8]',
    assigned: 'Amit Sharma',
    time: '5h ago',
  },
  {
    id: '3',
    title: 'Unusual engine noise',
    machine: 'Excavator B-12',
    priority: 'Low',
    priorityColor: 'border-[#10B981]',
    status: 'In Progress',
    statusColor: 'text-[#8B5CF6]',
    assigned: 'Priya Patel',
    time: '1d ago',
  },
  {
    id: '4',
    title: 'Overheating issue',
    machine: 'Air Compressor',
    priority: 'High',
    priorityColor: 'border-[#F43F5E]',
    status: 'Resolved',
    statusColor: 'text-[#10B981]',
    assigned: 'Amit Sharma',
    time: '2d ago',
  },
]

interface IssuesListProps {
  issues: Array<{ id: string; title: string; priority: string; status: string; machine_id: string }>
  projectId: string
}

export function IssuesList({ issues, projectId }: IssuesListProps) {
  const [search, setSearch] = useState('')
  const displayIssues = issues.length > 0 ? issues.map(i => ({
    id: i.id,
    title: i.title,
    machine: 'Machine',
    priority: i.priority,
    priorityColor: i.priority === 'high' ? 'border-[#F43F5E]' : i.priority === 'medium' ? 'border-[#F59E0B]' : 'border-[#10B981]',
    status: i.status,
    statusColor: i.status === 'open' ? 'text-[#A1A1AA]' : i.status === 'in_progress' ? 'text-[#8B5CF6]' : 'text-[#10B981]',
    assigned: null as string | null,
    time: 'Recently',
  })) : demoIssues

  const filtered = displayIssues.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4">
      {/* Filter Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] text-sm placeholder:text-[#52525B]"
          />
        </div>
        <Link
          href={`/projects/${projectId}/issues/new`}
          className="h-10 px-4 bg-[#F43F5E] text-white rounded-lg flex items-center gap-2 hover:bg-[#E11D48] transition-colors font-medium shadow-lg shadow-[#F43F5E]/20"
        >
          <Plus className="w-4 h-4" />
          Report
        </Link>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.map((issue) => (
          <Link
            key={issue.id}
            href={`/projects/${projectId}/issues/${issue.id}`}
            className={`block w-full p-3 border-l-[3px] ${issue.priorityColor} bg-[#18181B] border border-[#3F3F46] rounded-lg hover:bg-[#27272A] transition-colors`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#FAFAFA] flex-1">{issue.title}</h3>
              <span className="text-xs text-[#A1A1AA] ml-2">{issue.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 bg-[#27272A] text-[#A1A1AA] rounded-md">
                {issue.machine}
              </span>
              <span className={`text-xs font-medium ${issue.statusColor}`}>
                {issue.status}
              </span>
            </div>
            {issue.assigned && (
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-[#A1A1AA]" />
                <span className="text-xs text-[#A1A1AA]">{issue.assigned}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
