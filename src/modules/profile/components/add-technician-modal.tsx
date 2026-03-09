'use client'

import { useState, useEffect } from 'react'
import { X, Phone, User, Check } from 'lucide-react'
import { addTechnician, getManagerProjects } from '@/modules/profile/actions/add-technician.actions'

interface AddTechnicianModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Project {
  id: string
  name: string
  color: string
}

export function AddTechnicianModal({ open, onOpenChange }: AddTechnicianModalProps) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      getManagerProjects().then(setProjects).catch(() => setProjects([]))
      setPhone('')
      setName('')
      setSelectedProjects([])
      setError('')
    }
  }, [open])

  const toggleProject = (id: string) => {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!phone.trim() || !name.trim()) {
      setError('Phone and name are required')
      return
    }
    if (selectedProjects.length === 0) {
      setError('Select at least one project')
      return
    }

    setSubmitting(true)
    setError('')

    const fullPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`
    const result = await addTechnician(fullPhone, name.trim(), selectedProjects)

    if (result.error) {
      setError(result.error)
    } else {
      onOpenChange(false)
    }
    setSubmitting(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-[#18181B] rounded-t-2xl sm:rounded-2xl border border-[#3F3F46] max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3F3F46]">
          <h2 className="text-lg font-bold text-[#FAFAFA]">Add Technician</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-[#27272A] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#A1A1AA]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Phone Input */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Phone Number</label>
            <div className="flex gap-2">
              <div className="h-12 px-3 bg-[#27272A] border border-[#3F3F46] rounded-lg flex items-center text-[#A1A1AA] text-sm">
                +91
              </div>
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                />
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Technician name"
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Assign to Projects</label>
            {projects.length === 0 ? (
              <p className="text-sm text-[#52525B] py-2">No projects found. Create a project first.</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => toggleProject(project.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedProjects.includes(project.id)
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                        : 'border-[#3F3F46] bg-[#27272A] hover:border-[#52525B]'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm text-[#FAFAFA] flex-1 text-left">{project.name}</span>
                    {selectedProjects.includes(project.id) && (
                      <Check className="w-4 h-4 text-[#8B5CF6]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-[#F43F5E]">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add Technician'}
          </button>
        </div>
      </div>
    </div>
  )
}
