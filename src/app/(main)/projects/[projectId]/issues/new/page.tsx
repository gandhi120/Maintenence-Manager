import { ReportIssueForm } from '@/modules/issues/components/report-issue-form'

export default async function NewIssuePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  return <ReportIssueForm projectId={projectId} />
}
