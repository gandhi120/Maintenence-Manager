'use client'

import { useState } from 'react'
import { Search, Plus, MapPin, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/shared/providers/auth-provider'
import { canCreateProject } from '@/lib/utils/permissions'
import { CreateProjectModal } from './create-project-modal'

interface ProjectsListProps {
  projects: Array<{ id: string; name: string; location: string | null; color: string; machine_count?: number }>
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { role } = useAuth()
  const showCreate = canCreateProject(role)

  const displayProjects = projects.map(p => ({
    ...p,
    location: p.location || 'Unknown',
    machines: p.machine_count || 0,
  }))

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
            <button
              onClick={() => setShowModal(true)}
              className="h-10 px-4 bg-[#8B5CF6] text-white rounded-lg flex items-center gap-2 hover:bg-[#7C3AED] transition-colors whitespace-nowrap font-medium"
            >
              <Plus className="w-5 h-5" />
              New
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-4 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#27272A] flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-[#52525B]" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA] mb-1">No projects found</h3>
            <p className="text-sm text-[#A1A1AA]">
              {search ? 'Try a different search term' : 'You have no assigned projects yet'}
            </p>
          </div>
        )}
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 hover:border-[#8B5CF6]/50 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }}></div>
                  <h2 className="text-base font-semibold text-[#FAFAFA]">{project.name}</h2>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#A1A1AA]">
                  <MapPin className="w-3 h-3" />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#27272A] rounded-md text-xs">
                <Settings className="w-3 h-3 text-[#A1A1AA]" />
                <span className="text-[#FAFAFA]">{project.machines}</span>
                <span className="text-[#A1A1AA]">Machines</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CreateProjectModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
