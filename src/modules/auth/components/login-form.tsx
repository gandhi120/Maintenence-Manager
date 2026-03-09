'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSendOTP = () => {
    if (phoneNumber) {
      router.push('/verify')
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[#8B5CF6] blur-2xl opacity-30 rounded-full"></div>
            <div className="relative bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-2xl p-4">
              <Wrench className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#FAFAFA] mb-2">Smart Maintenance Manager</h1>
          <p className="text-[#A1A1AA] text-sm">Track. Report. Resolve.</p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm text-[#A1A1AA] mb-2">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-[#18181B] px-3 rounded-lg border border-[#3F3F46] h-12">
                <span className="text-[#FAFAFA]">+91</span>
              </div>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="flex-1 h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                maxLength={10}
              />
            </div>
          </div>

          <button
            onClick={handleSendOTP}
            className="w-full h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-all font-medium shadow-lg shadow-[#8B5CF6]/20"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  )
}
