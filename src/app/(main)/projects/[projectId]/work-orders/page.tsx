import { KanbanBoard } from '@/modules/work-orders/components/kanban-board'
import { TechnicianWorkOrdersList } from '@/modules/work-orders/components/technician-work-orders-list'
import { getCurrentUser } from '@/modules/auth/actions/auth.actions'
import { getTechnicianWorkOrders } from '@/modules/work-orders/actions/work-order.actions'

export default async function WorkOrdersPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  let currentUser: { id: string; role: string } | null = null
  try {
    currentUser = await getCurrentUser()
  } catch {
    // Supabase not configured
  }

  if (currentUser?.role === 'technician') {
    let workOrders: never[] = []
    try {
      workOrders = await getTechnicianWorkOrders(projectId, currentUser.id) as never[]
    } catch {
      // Supabase not configured
    }
    return <TechnicianWorkOrdersList workOrders={workOrders} projectId={projectId} />
  }

  return <KanbanBoard projectId={projectId} />
}
