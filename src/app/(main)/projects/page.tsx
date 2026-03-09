import { getProjects } from '@/modules/projects/actions/project.actions'
import { ProjectsList } from '@/modules/projects/components/projects-list'

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects()
  } catch {
    // Supabase not configured
  }

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      <ProjectsList projects={projects} />
    </div>
  )
}
