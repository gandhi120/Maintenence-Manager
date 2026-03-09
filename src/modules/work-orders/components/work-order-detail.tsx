'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, Save } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { StatusBadge } from '@/shared/components/data-display/status-badge'
import { WorkOrderStepper } from './work-order-stepper'
import { updateWorkOrderStatus, updateWorkOrderNotes } from '@/modules/work-orders/actions/work-order.actions'
import { formatDate } from '@/lib/utils/date'
import { toast } from 'sonner'

interface WorkOrderDetailProps {
  workOrder: {
    id: string
    status: string
    assigned_to: string | null
    estimated_completion: string | null
    actual_completion: string | null
    notes: string | null
    created_at: string
    assignee?: { id: string; name: string; avatar_url: string | null } | null
  }
  projectId: string
  issueId: string
}

export function WorkOrderDetail({ workOrder, projectId, issueId }: WorkOrderDetailProps) {
  const [notes, setNotes] = useState(workOrder.notes || '')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    const result = await updateWorkOrderStatus(workOrder.id, projectId, newStatus, issueId)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`Status updated to ${newStatus.replace(/_/g, ' ')}`)
    router.refresh()
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    const result = await updateWorkOrderNotes(workOrder.id, projectId, notes, issueId)
    setSaving(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Notes saved')
  }

  const nextStatuses: Record<string, string> = {
    open: 'assigned',
    assigned: 'in_progress',
    in_progress: 'completed',
  }

  const nextStatus = nextStatuses[workOrder.status]

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-accent" />
          <h3 className="text-sm font-semibold text-primary">Work Order</h3>
        </div>
        <StatusBadge status={workOrder.status} />
      </div>

      {/* Stepper */}
      <WorkOrderStepper currentStatus={workOrder.status} />

      {/* Details */}
      <div className="space-y-2 text-sm">
        {workOrder.assignee && (
          <div className="flex justify-between">
            <span className="text-secondary">Assigned to</span>
            <span className="text-primary font-medium">{workOrder.assignee.name}</span>
          </div>
        )}
        {workOrder.estimated_completion && (
          <div className="flex justify-between">
            <span className="text-secondary">Est. completion</span>
            <span className="text-primary">{formatDate(workOrder.estimated_completion)}</span>
          </div>
        )}
        {workOrder.actual_completion && (
          <div className="flex justify-between">
            <span className="text-secondary">Completed</span>
            <span className="text-success">{formatDate(workOrder.actual_completion)}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary">Repair Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add repair notes..."
          rows={3}
          disabled={workOrder.status === 'completed'}
        />
        {notes !== (workOrder.notes || '') && workOrder.status !== 'completed' && (
          <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={saving}>
            <Save className="mr-2 h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save Notes'}
          </Button>
        )}
      </div>

      {/* Status Action */}
      {nextStatus && (
        <Button className="w-full" onClick={() => handleStatusChange(nextStatus)}>
          {nextStatus === 'assigned' && 'Mark as Assigned'}
          {nextStatus === 'in_progress' && 'Start Work'}
          {nextStatus === 'completed' && 'Mark as Completed'}
        </Button>
      )}
    </div>
  )
}
