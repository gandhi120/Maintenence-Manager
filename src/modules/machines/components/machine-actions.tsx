'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Wrench } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { LogMaintenanceModal } from './log-maintenance-modal'

interface MachineActionsProps {
  machineId: string
  projectId: string
}

export function MachineActions({ machineId, projectId }: MachineActionsProps) {
  const [logOpen, setLogOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="space-y-3 p-4">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => router.push(`/projects/${projectId}/issues/new?machineId=${machineId}`)}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Report Issue
      </Button>
      <Button
        className="w-full"
        onClick={() => setLogOpen(true)}
      >
        <Wrench className="mr-2 h-4 w-4" />
        Log Maintenance
      </Button>
      <LogMaintenanceModal
        open={logOpen}
        onOpenChange={setLogOpen}
        machineId={machineId}
        projectId={projectId}
      />
    </div>
  )
}
