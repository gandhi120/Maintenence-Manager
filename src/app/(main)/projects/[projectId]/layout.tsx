import { getProject } from '@/modules/projects/actions/project.actions'
import { ProjectHeader } from '@/modules/projects/components/project-header'
import { ProjectTabs } from '@/modules/projects/components/project-tabs'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  let project = null
  try {
    project = await getProject(projectId)
  } catch {
    // Supabase not configured
  }

  if (!project) {
    // Demo project for display
    project = { id: projectId, name: 'Construction Site A', location: 'Mumbai', color: '#8B5CF6', description: '' }
  }

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      <div className="bg-[#18181B] border-b border-[#3F3F46]">
        <ProjectHeader project={project} />
        <ProjectTabs projectId={projectId} />
      </div>
      {children}
    </div>
  )
}
