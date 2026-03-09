import { getWorkOrderByIssue, getTeamForProject } from '@/modules/work-orders/actions/work-order.actions'
import { WorkOrderDetail } from './work-order-detail'
import { CreateWorkOrderForm } from './create-work-order-form'

interface WorkOrderSectionProps {
  issueId: string
  projectId: string
}

export async function WorkOrderSection({ issueId, projectId }: WorkOrderSectionProps) {
  const [workOrder, team] = await Promise.all([
    getWorkOrderByIssue(issueId),
    getTeamForProject(projectId),
  ])

  return (
    <div className="px-4">
      {workOrder ? (
        <WorkOrderDetail workOrder={workOrder} projectId={projectId} issueId={issueId} />
      ) : (
        <CreateWorkOrderForm
          issueId={issueId}
          projectId={projectId}
          team={team as Array<{ id: string; name: string; avatar_url: string | null }>}
        />
      )}
    </div>
  )
}
