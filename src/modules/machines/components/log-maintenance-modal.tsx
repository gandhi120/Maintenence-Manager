'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X, Check, Square } from 'lucide-react'
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
import { maintenanceLogSchema, type ChecklistItem } from '@/lib/utils/validation'
import { MAINTENANCE_TYPES, MAINTENANCE_CHECKLISTS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'
import { z } from 'zod'

type FormData = z.infer<typeof maintenanceLogSchema>

function getDefaultChecklist(type: string): ChecklistItem[] {
  const items = MAINTENANCE_CHECKLISTS[type] || []
  return items.map((label) => ({ label, checked: false }))
}

interface LogMaintenanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  machineId: string
  projectId: string
}

export function LogMaintenanceModal({ open, onOpenChange, machineId, projectId }: LogMaintenanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('repair')
  const [checklist, setChecklist] = useState<ChecklistItem[]>(getDefaultChecklist('repair'))
  const [newItemText, setNewItemText] = useState('')

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(maintenanceLogSchema),
    defaultValues: {
      maintenance_type: 'repair',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const handleTypeChange = (val: string) => {
    setSelectedType(val)
    setValue('maintenance_type', val as FormData['maintenance_type'])
    setChecklist(getDefaultChecklist(val))
  }

  const toggleItem = (index: number) => {
    setChecklist((prev) => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item))
  }

  const removeItem = (index: number) => {
    setChecklist((prev) => prev.filter((_, i) => i !== index))
  }

  const addCustomItem = () => {
    const text = newItemText.trim()
    if (!text) return
    setChecklist((prev) => [...prev, { label: text, checked: false }])
    setNewItemText('')
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = await logMaintenance(machineId, projectId, {
      ...data,
      maintenance_type: selectedType,
      checklist,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Maintenance logged!')
    reset()
    setSelectedType('repair')
    setChecklist(getDefaultChecklist('repair'))
    setNewItemText('')
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
              onValueChange={handleTypeChange}
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

          {/* Checklist */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">Checklist</label>
            <div className="border border-[#3F3F46] rounded-lg overflow-hidden">
              {checklist.length > 0 && (
                <div className="divide-y divide-[#3F3F46]">
                  {checklist.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-3 px-3 py-2 hover:bg-[#27272A] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(index)}
                        className="flex-shrink-0"
                      >
                        {item.checked ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#A1A1AA]" />
                        )}
                      </button>
                      <span
                        className={cn(
                          'flex-1 text-sm',
                          item.checked ? 'line-through text-[#71717A]' : 'text-[#FAFAFA]'
                        )}
                      >
                        {item.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#3F3F46] rounded"
                      >
                        <X className="w-3 h-3 text-[#A1A1AA]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 border-t border-[#3F3F46]">
                <Plus className="w-4 h-4 text-[#A1A1AA] flex-shrink-0" />
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomItem()
                    }
                  }}
                  placeholder="Add custom item..."
                  className="flex-1 bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomItem}
                  disabled={!newItemText.trim()}
                  className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] disabled:text-[#52525B] font-medium px-2 py-1"
                >
                  Add
                </button>
              </div>
            </div>
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
