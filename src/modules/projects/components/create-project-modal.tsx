'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MapPin } from 'lucide-react'
import { createProject } from '@/modules/projects/actions/project.actions'

const colors = [
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#38BDF8', label: 'Sky' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#F43F5E', label: 'Rose' },
  { value: '#06B6D4', label: 'Cyan' },
]

const defaultFormData = {
  name: '',
  location: '',
  description: '',
  color: '#8B5CF6',
}

export function CreateProjectModal({ open, onOpenChange, onClose: onCloseProp }: { open?: boolean; onOpenChange?: (open: boolean) => void; onClose?: () => void }) {
  const onClose = onCloseProp || (() => onOpenChange?.(false))
  const router = useRouter()
  const [formData, setFormData] = useState(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (open === false) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await createProject(formData)
      if (result.error) {
        setError(result.error)
        return
      }
      setFormData(defaultFormData)
      onClose()
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center px-4 z-50">
        <div className="relative bg-[#18181B] border border-[#3F3F46] rounded-xl w-full max-w-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[#FAFAFA]">Create New Project</h1>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#27272A] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#A1A1AA]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-[#A1A1AA] mb-2">
                Project Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Construction Site A"
                className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm text-[#A1A1AA] mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm text-[#A1A1AA] mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description..."
                className="w-full h-24 px-4 py-3 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">
                Project Color
              </label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color.value
                        ? 'ring-2 ring-offset-2 ring-offset-[#18181B] scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: color.value,
                    }}
                    title={color.label}
                  />
                ))}
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
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
