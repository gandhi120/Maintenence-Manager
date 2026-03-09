'use client'

import { ArrowLeft, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProjectHeaderProps {
  project: { id: string; name: string; location: string | null; color: string }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-3 px-4 pt-2 pb-1">
      <button
        onClick={() => router.push('/projects')}
        className="p-2 hover:bg-[#27272A] rounded-lg transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-[#FAFAFA]" />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }}></div>
          <h1 className="text-lg font-bold text-[#FAFAFA]">{project.name}</h1>
        </div>
        {project.location && (
          <div className="flex items-center gap-1 text-sm text-[#A1A1AA]">
            <MapPin className="w-3 h-3" />
            <span>{project.location}</span>
          </div>
        )}
      </div>
    </div>
  )
}
