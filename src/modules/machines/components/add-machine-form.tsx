'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, X } from 'lucide-react'
import { createMachine } from '@/modules/machines/actions/machine.actions'
import { uploadImage } from '@/lib/supabase/storage'

interface AddMachineFormProps {
  projectId: string
  projectName?: string
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Under Repair', value: 'under_repair' },
]

export function AddMachineForm({ projectId, projectName }: AddMachineFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    lastMaintenanceDate: '',
    maintenanceCycle: '30',
    zone: '',
    status: 'active',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl: string | undefined

      // Upload image if selected
      if (imageFile) {
        try {
          const ext = imageFile.name.split('.').pop() || 'jpg'
          const path = `${projectId}/${Date.now()}.${ext}`
          imageUrl = await uploadImage('machine-images', path, imageFile)
        } catch {
          setError('Failed to upload image. Please try again.')
          setLoading(false)
          return
        }
      }

      const result = await createMachine(projectId, {
        name: formData.name,
        type: formData.type,
        serial_number: formData.serialNumber || undefined,
        image_url: imageUrl,
        last_maintenance_date: formData.lastMaintenanceDate || undefined,
        maintenance_cycle_days: parseInt(formData.maintenanceCycle) || 30,
        zone: formData.zone || undefined,
        status: formData.status,
      })

      if (result.error) {
        setError(result.error)
        return
      }

      router.push(`/projects/${projectId}/machines`)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
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
        {projectName && (
          <div className="ml-14">
            <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded-md">
              Project: {projectName}
            </span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageSelect}
        />
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#3F3F46] rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-[#8B5CF6] transition-colors cursor-pointer bg-[#27272A]"
          >
            <Camera className="w-8 h-8 text-[#8B5CF6]" />
            <p className="text-sm text-[#FAFAFA]">Tap to Capture or Upload Photo</p>
            <p className="text-xs text-[#A1A1AA]">Supports JPG, PNG (max 5MB)</p>
          </div>
        )}

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
            <input id="serialNumber" type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} placeholder="e.g. TC-2024-001" className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]" />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm text-[#A1A1AA] mb-2">Last Maintenance Date</label>
            <input id="date" type="date" value={formData.lastMaintenanceDate} onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" />
          </div>

          <div>
            <label htmlFor="cycle" className="block text-sm text-[#A1A1AA] mb-2">Maintenance Cycle (days)</label>
            <input id="cycle" type="number" value={formData.maintenanceCycle} onChange={(e) => setFormData({ ...formData, maintenanceCycle: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]" required />
          </div>

          <div>
            <label htmlFor="zone" className="block text-sm text-[#A1A1AA] mb-2">Zone/Location within Site</label>
            <input id="zone" type="text" value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} placeholder="e.g. Zone 2 - East Wing" className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]" />
          </div>

          {/* Status Segmented Control */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Status</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#18181B] border border-[#3F3F46] rounded-lg">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: opt.value })}
                  className={`h-10 rounded-md text-sm font-medium transition-all ${
                    formData.status === opt.value
                      ? 'bg-[#8B5CF6] text-white shadow-lg'
                      : 'text-[#A1A1AA] hover:bg-[#27272A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Machine'}
          </button>
          <button type="button" onClick={() => router.push(`/projects/${projectId}/machines`)} className="flex-1 h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
