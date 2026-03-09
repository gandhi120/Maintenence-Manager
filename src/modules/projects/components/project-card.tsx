import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { HealthIndicator } from '@/shared/components/data-display/health-indicator'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    location: string
    description: string | null
    color: string
    created_at: string
    open_issue_count?: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}/machines`}
      className="block rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px] hover:bg-white/[0.06] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="mt-1 h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-primary truncate">{project.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-secondary" />
              <span className="text-xs text-secondary truncate">{project.location}</span>
            </div>
            {project.description && (
              <p className="mt-1 text-xs text-secondary line-clamp-1">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <HealthIndicator openIssueCount={project.open_issue_count || 0} />
          <ChevronRight className="h-4 w-4 text-secondary" />
        </div>
      </div>
    </Link>
  )
}
