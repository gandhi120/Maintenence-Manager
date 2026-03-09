'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Phone, Bell, Moon, Info, LogOut, Camera, ChevronRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/shared/providers/auth-provider'
import { useAvatarUpload } from '../hooks/use-avatar-upload'
import { AddTechnicianModal } from './add-technician-modal'
import { EditNameModal } from './edit-name-modal'
import { EditPhoneModal } from './edit-phone-modal'

interface ProfileViewProps {
  profile: { id: string; name: string; mobile_number: string; avatar_url: string | null; role: string } | null
  teamMembers?: Array<{
    id: string
    user: { id: string; name: string; mobile_number: string; avatar_url: string | null } | null
    role: string
  }>
}

export function ProfileView({ profile, teamMembers }: ProfileViewProps) {
  const router = useRouter()
  const { role } = useAuth()
  const [showAddTechnician, setShowAddTechnician] = useState(false)
  const [showEditName, setShowEditName] = useState(false)
  const [showEditPhone, setShowEditPhone] = useState(false)
  const { uploading, fileInputRef, triggerFilePicker, handleFileChange } = useAvatarUpload(profile?.id || '')
  const name = profile?.name || ''
  const phone = profile?.mobile_number || ''
  const displayRole = role === 'technician' ? 'Technician' : 'Manager'
  const isManager = role !== 'technician'

  const roleBadgeColor = role === 'technician'
    ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
    : 'bg-[#8B5CF6]/20 text-[#8B5CF6]'

  const avatarGradient = role === 'technician'
    ? 'from-[#38BDF8] to-[#0284C7]'
    : 'from-[#8B5CF6] to-[#6D28D9]'

  const team = (teamMembers || []).map(m => ({
    name: m.user?.name || '',
    phone: m.user?.mobile_number || '',
    role: m.role === 'technician' ? 'Technician' : 'Manager',
    status: 'online' as const,
  }))

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <h1 className="text-xl font-bold text-[#FAFAFA]">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* User Profile Card */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center overflow-hidden`}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={triggerFilePicker}
                disabled={uploading}
                className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#18181B] ${role === 'technician' ? 'bg-[#38BDF8]' : 'bg-[#8B5CF6]'}`}
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {name ? (
              <>
                <h2 className="text-xl font-bold text-[#FAFAFA] mb-1">{name}</h2>
                <p className="text-sm text-[#A1A1AA] mb-2">{phone}</p>
              </>
            ) : (
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-2">{phone}</h2>
            )}
            <span className={`text-xs px-3 py-1 rounded-full ${roleBadgeColor}`}>
              {displayRole}
            </span>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#3F3F46]">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Account</h3>
          </div>
          <button onClick={() => setShowEditName(true)} className="w-full flex items-center gap-3 p-4 hover:bg-[#27272A] transition-colors border-b border-[#3F3F46]">
            <User className="w-5 h-5 text-[#A1A1AA]" />
            <span className="flex-1 text-left text-[#FAFAFA]">Edit Name</span>
            <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
          </button>
          <button onClick={() => setShowEditPhone(true)} className="w-full flex items-center gap-3 p-4 hover:bg-[#27272A] transition-colors">
            <Phone className="w-5 h-5 text-[#A1A1AA]" />
            <span className="flex-1 text-left text-[#FAFAFA]">Edit Phone</span>
            <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
          </button>
        </div>

        {/* Preferences Section */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#3F3F46]">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Preferences</h3>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-[#3F3F46]">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#A1A1AA]" />
              <span className="text-[#FAFAFA]">Dark Mode</span>
            </div>
            <span className="text-xs text-[#A1A1AA] bg-[#27272A] px-2 py-1 rounded-md">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-[#3F3F46]">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#A1A1AA]" />
              <span className="text-[#FAFAFA]">Push Notifications</span>
            </div>
            <span className="text-xs text-[#A1A1AA] bg-[#27272A] px-2 py-1 rounded-md">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#A1A1AA]" />
              <span className="text-[#FAFAFA]">Maintenance Reminders</span>
            </div>
            <span className="text-xs text-[#A1A1AA] bg-[#27272A] px-2 py-1 rounded-md">Coming Soon</span>
          </div>
        </div>

        {/* My Team Section — Manager only */}
        {isManager && (
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#3F3F46]">
              <h3 className="text-sm font-semibold text-[#FAFAFA]">My Team</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-xs text-[#A1A1AA] bg-[#27272A] px-2 py-1 rounded-md">Coming Soon</span>
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#3F3F46]">
            <h3 className="text-sm font-semibold text-[#FAFAFA]">About</h3>
          </div>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-[#27272A] transition-colors border-b border-[#3F3F46]">
            <Info className="w-5 h-5 text-[#A1A1AA]" />
            <div className="flex-1 text-left">
              <span className="text-[#FAFAFA]">App Version</span>
              <p className="text-xs text-[#A1A1AA]">2.0.0</p>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => router.push('/login')}
          className="w-full flex items-center justify-center gap-2 h-12 bg-[#F43F5E] text-white rounded-lg hover:bg-[#E11D48] transition-colors font-medium shadow-lg shadow-[#F43F5E]/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Add Technician Modal */}
      {isManager && (
        <AddTechnicianModal
          open={showAddTechnician}
          onOpenChange={setShowAddTechnician}
        />
      )}

      {/* Edit Name Modal */}
      <EditNameModal
        open={showEditName}
        onOpenChange={setShowEditName}
        currentName={name}
      />

      {/* Edit Phone Modal */}
      <EditPhoneModal
        open={showEditPhone}
        onOpenChange={setShowEditPhone}
        currentPhone={phone}
      />
    </div>
  )
}
