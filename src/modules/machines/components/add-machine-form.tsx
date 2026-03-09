'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'

interface AddMachineFormProps {
  projectId: string
  projectName?: string
}

export function AddMachineForm({ projectId, projectName }: AddMachineFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    lastMaintenanceDate: '',
    maintenanceCycle: '30',
    zone: '',
    status: 'Active',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/projects/${projectId}/machines`)
  }

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push(`/projects/${projectId}/machines`)}
            className="p-2 hover:bg-[#27272A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#FAFAFA]" />
          </button>
          <h1 className="text-xl font-bold text-[#FAFAFA]">Add Machine</h1>
        </div>
        <div className="ml-14">
          <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded-md">
            Project: {projectName || 'Construction Site A'}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-[#3F3F46] rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-[#8B5CF6] transition-colors cursor-pointer bg-[#27272A]">
          <Camera className="w-8 h-8 text-[#8B5CF6]" />
          <p className="text-sm text-[#FAFAFA]">Tap to Capture or Upload Photo</p>
          <p className="text-xs text-[#A1A1AA]">Supports JPG, PNG</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-[#A1A1AA] mb-2">Machine Name</label>
            <input id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Tower Crane" className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]" required />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm text-[#A1A1AA] mb-2">Machine Type</label>
            <select id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required>
              <option value="">Select type...</option>
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
            <label htmlFor="serialNumber" className="block text-sm text-[#A1A1AA] mb-2">Serial Number</label>
            <input id="serialNumber" type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} placeholder="e.g. TC-2024-001" className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]" required />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm text-[#A1A1AA] mb-2">Last Maintenance Date</label>
            <input id="date" type="date" value={formData.lastMaintenanceDate} onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required />
          </div>

          <div>
            <label htmlFor="cycle" className="block text-sm text-[#A1A1AA] mb-2">Maintenance Cycle (days)</label>
            <input id="cycle" type="number" value={formData.maintenanceCycle} onChange={(e) => setFormData({ ...formData, maintenanceCycle: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required />
          </div>

          <div>
            <label htmlFor="zone" className="block text-sm text-[#A1A1AA] mb-2">Zone/Location within Site</label>
            <input id="zone" type="text" value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} placeholder="e.g. Zone 2 - East Wing" className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]" required />
          </div>

          {/* Status Segmented Control */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Status</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#18181B] border border-[#3F3F46] rounded-lg">
              {['Active', 'Inactive', 'Under Repair'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`h-10 rounded-md text-sm font-medium transition-all ${
                    formData.status === status
                      ? 'bg-[#8B5CF6] text-white shadow-lg'
                      : 'text-[#A1A1AA] hover:bg-[#27272A]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium">
            Save Machine
          </button>
          <button type="button" onClick={() => router.push(`/projects/${projectId}/machines`)} className="flex-1 h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
