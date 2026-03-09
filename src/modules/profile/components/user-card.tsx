'use client'

import { useState } from 'react'
import { Camera, Edit2, Save, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { updateProfile } from '@/modules/profile/actions/profile.actions'
import { toast } from 'sonner'

interface UserCardProps {
  user: {
    id: string
    name: string
    mobile_number: string
    avatar_url: string | null
    role: string
  }
}

export function UserCard({ user }: UserCardProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const result = await updateProfile({ name })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Profile updated')
    setEditing(false)
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-[12px]">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-full bg-elevated flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-secondary">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-accent flex items-center justify-center shadow-lg">
            <Camera className="h-3.5 w-3.5 text-white" />
          </button>
        </div>

        {editing ? (
          <div className="flex items-center gap-2 w-full max-w-[200px]">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 text-success" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
              <X className="h-4 w-4 text-danger" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-primary">{user.name || 'Set your name'}</h2>
            <button onClick={() => setEditing(true)}>
              <Edit2 className="h-4 w-4 text-secondary hover:text-primary transition-colors" />
            </button>
          </div>
        )}

        <p className="mt-1 text-sm text-secondary">{user.mobile_number}</p>
        <span className="mt-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent capitalize">
          {user.role}
        </span>
      </div>
    </div>
  )
}
