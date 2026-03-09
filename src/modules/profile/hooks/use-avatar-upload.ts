'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadImage } from '@/lib/supabase/storage'
import { validateImageFile, resizeImage } from '@/lib/utils/image'
import { updateProfile } from '../actions/profile.actions'

export function useAvatarUpload(userId: string) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  function triggerFilePicker() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so the same file can be re-selected
    e.target.value = ''

    const validationError = validateImageFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setUploading(true)
    try {
      const resized = await resizeImage(file)
      const path = `${userId}/avatar.jpg`
      const publicUrl = await uploadImage('avatars', path, resized, { upsert: true })

      // Append cache-buster so browser doesn't serve stale image
      const avatarUrl = `${publicUrl}?t=${Date.now()}`
      const result = await updateProfile({ avatar_url: avatarUrl })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Profile photo updated')
      }
    } catch {
      toast.error('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  return { uploading, fileInputRef, triggerFilePicker, handleFileChange }
}
