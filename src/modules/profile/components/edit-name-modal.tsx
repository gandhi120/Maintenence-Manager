'use client'

import { useState, useEffect } from 'react'
import { X, User } from 'lucide-react'
import { updateProfile } from '@/modules/profile/actions/profile.actions'
import { toast } from 'sonner'

interface EditNameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
}

export function EditNameModal({ open, onOpenChange, currentName }: EditNameModalProps) {
  const [name, setName] = useState(currentName)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName(currentName)
      setError('')
    }
  }, [open, currentName])

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required')
      return
    }

    setSubmitting(true)
    setError('')

    const result = await updateProfile({ name: trimmed })

    if (result.error) {
      setError(result.error)
      toast.error('Failed to update name')
    } else {
      toast.success('Name updated successfully')
      onOpenChange(false)
    }
    setSubmitting(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-[#18181B] rounded-t-2xl sm:rounded-2xl border border-[#3F3F46]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3F3F46]">
          <h2 className="text-lg font-bold text-[#FAFAFA]">Edit Name</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-[#27272A] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#A1A1AA]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                placeholder="Enter your name"
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-[#F43F5E]">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 border border-[#3F3F46] text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
