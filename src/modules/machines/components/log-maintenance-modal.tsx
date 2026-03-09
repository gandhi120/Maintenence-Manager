'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/shared/components/ui/modal'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { logMaintenance } from '@/modules/machines/actions/machine.actions'
import { maintenanceLogSchema } from '@/lib/utils/validation'
import { MAINTENANCE_TYPES } from '@/lib/utils/constants'
import { toast } from 'sonner'
import { z } from 'zod'

type FormData = z.infer<typeof maintenanceLogSchema>

interface LogMaintenanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  machineId: string
  projectId: string
}

export function LogMaintenanceModal({ open, onOpenChange, machineId, projectId }: LogMaintenanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('routine')

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(maintenanceLogSchema),
    defaultValues: {
      maintenance_type: 'routine',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = await logMaintenance(machineId, projectId, {
      ...data,
      maintenance_type: selectedType,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Maintenance logged!')
    reset()
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Log Maintenance</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">Type</label>
            <Select
              value={selectedType}
              onValueChange={(val) => { setSelectedType(val); setValue('maintenance_type', val as 'routine' | 'oil_change' | 'repair' | 'inspection' | 'custom') }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAINTENANCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">Date</label>
            <Input type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">Notes</label>
            <Textarea placeholder="Maintenance notes..." {...register('notes')} rows={3} />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Log Maintenance'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
