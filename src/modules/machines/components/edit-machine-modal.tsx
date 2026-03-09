'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { updateMachine } from '@/modules/machines/actions/machine.actions'
import { useRouter } from 'next/navigation'

interface EditMachineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  machine: {
    id: string
    name: string
    type: string
    serial_number: string | null
    zone: string | null
    status: string
    maintenance_cycle_days: number
  }
  projectId: string
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Under Repair', value: 'under_repair' },
]

export function EditMachineModal({ open, onOpenChange, machine, projectId }: EditMachineModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: machine.name,
    type: machine.type,
    serial_number: machine.serial_number || '',
    zone: machine.zone || '',
    status: machine.status,
    maintenance_cycle_days: String(machine.maintenance_cycle_days),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await updateMachine(machine.id, projectId, {
        name: formData.name,
        type: formData.type,
        serial_number: formData.serial_number || null,
        zone: formData.zone || null,
        status: formData.status,
        maintenance_cycle_days: parseInt(formData.maintenance_cycle_days) || 30,
      })

      if (result.error) {
        setError(result.error)
        return
      }

      onOpenChange(false)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 pointer-events-none">
        <div className="relative bg-[#18181B] border border-[#3F3F46] rounded-xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#FAFAFA]">Edit Machine</h2>
            <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-[#27272A] rounded-lg transition-colors">
              <X className="w-5 h-5 text-[#A1A1AA]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm text-[#A1A1AA] mb-2">Machine Name</label>
              <input id="edit-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required />
            </div>

            <div>
              <label htmlFor="edit-type" className="block text-sm text-[#A1A1AA] mb-2">Machine Type</label>
              <select id="edit-type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required>
                <option value="Crane">Crane</option>
                <option value="Excavator">Excavator</option>
                <option value="Generator">Generator</option>
                <option value="Compressor">Compressor</option>
                <option value="Pump">Pump</option>
                <option value="Conveyor">Conveyor</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-serial" className="block text-sm text-[#A1A1AA] mb-2">Serial Number</label>
              <input id="edit-serial" type="text" value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" />
            </div>

            <div>
              <label htmlFor="edit-zone" className="block text-sm text-[#A1A1AA] mb-2">Zone/Location</label>
              <input id="edit-zone" type="text" value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" />
            </div>

            <div>
              <label htmlFor="edit-cycle" className="block text-sm text-[#A1A1AA] mb-2">Maintenance Cycle (days)</label>
              <input id="edit-cycle" type="number" value={formData.maintenance_cycle_days} onChange={(e) => setFormData({ ...formData, maintenance_cycle_days: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required />
            </div>

            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Status</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#27272A] border border-[#3F3F46] rounded-lg">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: opt.value })}
                    className={`h-10 rounded-md text-sm font-medium transition-all ${
                      formData.status === opt.value
                        ? 'bg-[#8B5CF6] text-white shadow-lg'
                        : 'text-[#A1A1AA] hover:bg-[#3F3F46]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => onOpenChange(false)} className="flex-1 h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
