'use client'

import { useState } from 'react'
import { Search, Plus, MapPin, Settings, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/shared/providers/auth-provider'
import { canCreateProject } from '@/lib/utils/permissions'

const demoProjects = [
  {
    id: '1',
    name: 'Construction Site A',
    location: 'Mumbai',
    machines: 12,
    openIssues: 5,
    activeOrders: 2,
    color: 'bg-[#8B5CF6]',
    health: 'amber',
  },
  {
    id: '2',
    name: 'Honda Factory Line 2',
    location: 'Pune',
    machines: 18,
    openIssues: 2,
    activeOrders: 1,
    color: 'bg-[#10B981]',
    health: 'green',
  },
  {
    id: '3',
    name: 'Tata Steel Plant',
    location: 'Jamshedpur',
    machines: 25,
    openIssues: 8,
    activeOrders: 5,
    color: 'bg-[#F59E0B]',
    health: 'red',
  },
  {
    id: '4',
    name: 'My Workshop',
    location: 'Surat',
    machines: 6,
    openIssues: 1,
    activeOrders: 0,
    color: 'bg-[#38BDF8]',
    health: 'green',
  },
]

function getHealthColor(health: string) {
  if (health === 'green') return 'bg-[#10B981]'
  if (health === 'amber') return 'bg-[#F59E0B]'
  return 'bg-[#F43F5E]'
}

interface ProjectsListProps {
  projects: Array<{ id: string; name: string; location: string | null; color: string }>
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [search, setSearch] = useState('')
  const { role } = useAuth()
  const showCreate = canCreateProject(role)

  const displayProjects = projects.length > 0 ? projects.map(p => ({
    ...p,
    location: p.location || 'Unknown',
    machines: 0,
    openIssues: 0,
    activeOrders: 0,
    color: `bg-[${p.color}]`,
    health: 'green',
  })) : demoProjects

  const filtered = displayProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <h1 className="text-xl font-bold text-[#FAFAFA] mb-3">Projects</h1>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
            />
          </div>
          {showCreate && (
            <Link
              href="/projects/new"
              className="h-10 px-4 bg-[#8B5CF6] text-white rounded-lg flex items-center gap-2 hover:bg-[#7C3AED] transition-colors whitespace-nowrap font-medium"
            >
              <Plus className="w-5 h-5" />
              New
            </Link>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-4 space-y-3">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 hover:border-[#8B5CF6]/50 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                  <h2 className="text-base font-semibold text-[#FAFAFA]">{project.name}</h2>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#A1A1AA]">
                  <MapPin className="w-3 h-3" />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#27272A] rounded-md text-xs">
                <Settings className="w-3 h-3 text-[#A1A1AA]" />
                <span className="text-[#FAFAFA]">{project.machines}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#27272A] rounded-md text-xs">
                <AlertCircle className="w-3 h-3 text-[#F43F5E]" />
                <span className="text-[#FAFAFA]">{project.openIssues}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#27272A] rounded-md text-xs">
                <FileText className="w-3 h-3 text-[#8B5CF6]" />
                <span className="text-[#FAFAFA]">{project.activeOrders}</span>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-1 bg-[#27272A] rounded-full overflow-hidden">
              <div className={`h-full ${getHealthColor(project.health)}`} style={{ width: '65%' }}></div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
