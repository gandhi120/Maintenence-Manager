'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench } from 'lucide-react'
import Script from 'next/script'

declare global {
  interface Window {
    sendOtp: (identifier: string, onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) => void
    initSendOTP: (config: unknown) => void
  }
}

export function LoginForm() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [widgetReady, setWidgetReady] = useState(false)

  useEffect(() => {
    // Initialize MSG91 widget config
    const configuration = {
      widgetId: '356768674179373833323436',
      tokenAuth: '375653TEorlYytHsL660a6774P1',
      exposeMethods: true,
      success: (data: unknown) => {
        console.log('MSG91 widget success:', data)
      },
      failure: (error: unknown) => {
        console.log('MSG91 widget failure:', error)
      },
    }
    ;(window as unknown as Record<string, unknown>).configuration = configuration
  }, [])

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Enter a valid 10-digit mobile number')
      return
    }

    if (!widgetReady || !window.sendOtp) {
      setError('OTP service loading, please try again')
      return
    }

    setLoading(true)
    setError('')

    const mobile = `91${phoneNumber}`
    console.log('Sending OTP to:', mobile)

    window.sendOtp(
      mobile,
      (data) => {
        console.log('OTP sent success:', data)
        const reqId = (data as { message?: string })?.message || ''
        router.push(`/verify?phone=${encodeURIComponent(`+${mobile}`)}&requestId=${reqId}`)
      },
      (err) => {
        console.error('OTP send error:', err)
        setError('Failed to send OTP. Please try again.')
        setLoading(false)
      }
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4 relative overflow-hidden">
      <Script
        src="https://verify.msg91.com/otp-provider.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('MSG91 script loaded')
          const config = {
            widgetId: '356768674179373833323436',
            tokenAuth: '375653TEorlYytHsL660a6774P1',
            exposeMethods: true,
            success: (data: unknown) => {
              console.log('MSG91 success:', data)
            },
            failure: (error: unknown) => {
              console.log('MSG91 failure:', error)
            },
          }
          if (window.initSendOTP) {
            window.initSendOTP(config)
            setWidgetReady(true)
            console.log('MSG91 widget initialized')
          }
        }}
      />

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
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''))
                  setError('')
                }}
                placeholder="9876543210"
                className="flex-1 h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                maxLength={10}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-[#F43F5E]">{error}</p>
          )}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-all font-medium shadow-lg shadow-[#8B5CF6]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}
