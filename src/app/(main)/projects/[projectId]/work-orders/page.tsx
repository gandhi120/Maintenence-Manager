import { KanbanBoard } from '@/modules/work-orders/components/kanban-board'

export default async function WorkOrdersPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  return <KanbanBoard projectId={projectId} />
}
