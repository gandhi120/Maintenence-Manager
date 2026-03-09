import { getMachines } from '@/modules/machines/actions/machine.actions'
import { MachinesGrid } from '@/modules/machines/components/machines-grid'

export default async function MachinesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  let machines: Awaited<ReturnType<typeof getMachines>> = []
  try {
    machines = await getMachines(projectId)
  } catch {
    // Supabase not configured
  }

  return <MachinesGrid machines={machines} projectId={projectId} />
}
