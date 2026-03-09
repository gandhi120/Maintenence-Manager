import { getIssue } from '@/modules/issues/actions/issue.actions'
import { IssueDetailView } from '@/modules/issues/components/issue-detail-view'

export default async function IssueDetailPage({ params }: { params: Promise<{ projectId: string; issueId: string }> }) {
  const { projectId, issueId } = await params
  let issue = null
  try {
    issue = await getIssue(issueId)
  } catch {
    // Supabase not configured
  }

  return <IssueDetailView issue={issue} projectId={projectId} issueId={issueId} />
}
