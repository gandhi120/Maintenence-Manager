import { getIssues } from '@/modules/issues/actions/issue.actions'
import { IssuesList } from '@/modules/issues/components/issues-list'

export default async function IssuesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  let issues: Awaited<ReturnType<typeof getIssues>> = []
  try {
    issues = await getIssues(projectId)
  } catch {
    // Supabase not configured
  }

  return <IssuesList issues={issues} projectId={projectId} />
}
