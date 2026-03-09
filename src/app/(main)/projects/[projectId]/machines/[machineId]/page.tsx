import { getMachine } from '@/modules/machines/actions/machine.actions'
import { MachineDetailView } from '@/modules/machines/components/machine-detail-view'

export default async function MachineDetailPage({ params }: { params: Promise<{ projectId: string; machineId: string }> }) {
  const { projectId, machineId } = await params
  let machine = null
  try {
    machine = await getMachine(machineId)
  } catch {
    // Supabase not configured
  }

  return <MachineDetailView machine={machine} projectId={projectId} machineId={machineId} />
}
