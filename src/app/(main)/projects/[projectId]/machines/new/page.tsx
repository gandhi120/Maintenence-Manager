import { AddMachineForm } from '@/modules/machines/components/add-machine-form'

export default async function NewMachinePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  return <AddMachineForm projectId={projectId} />
}
