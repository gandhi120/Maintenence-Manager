'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, UserPlus, Calendar } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { createWorkOrder } from '@/modules/work-orders/actions/work-order.actions'
import { toast } from 'sonner'

interface CreateWorkOrderFormProps {
  issueId: string
  projectId: string
  team: Array<{ id: string; name: string; avatar_url: string | null }>
}

export function CreateWorkOrderForm({ issueId, projectId, team }: CreateWorkOrderFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assignedTo, setAssignedTo] = useState('')
  const [estimatedCompletion, setEstimatedCompletion] = useState('')
  const [notes, setNotes] = useState('')
  const router = useRouter()

  if (!expanded) {
    return (
      <div className="rounded-xl border border-dashed border-accent/30 bg-accent/5 p-4">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="h-5 w-5 text-accent" />
          <h3 className="text-sm font-semibold text-primary">Work Order</h3>
        </div>
        <p className="text-sm text-secondary mb-3">
          Create a work order to assign this issue to a technician.
        </p>
        <Button onClick={() => setExpanded(true)} size="sm">
          Create Work Order
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await createWorkOrder(projectId, issueId, {
      assigned_to: assignedTo || undefined,
      estimated_completion: estimatedCompletion || undefined,
      notes: notes || undefined,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Work order created!')
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-[12px]">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="h-5 w-5 text-accent" />
        <h3 className="text-sm font-semibold text-primary">Create Work Order</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary flex items-center gap-2">
            <UserPlus className="h-3.5 w-3.5" />
            Assign Technician
          </label>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {team.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name || 'Unnamed'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Estimated Completion
          </label>
          <Input
            type="date"
            value={estimatedCompletion}
            onChange={(e) => setEstimatedCompletion(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">Notes</label>
          <Textarea
            placeholder="Initial notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setExpanded(false)}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  )
}
