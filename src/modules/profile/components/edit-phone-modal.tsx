'use client'

import { useState, useEffect } from 'react'
import { X, Phone } from 'lucide-react'
import { toast } from 'sonner'
import Script from 'next/script'

declare global {
  interface Window {
    sendOtp: (identifier: string, onSuccess?: (data: unknown) => void, onError?: (error: unknown) => void) => void
    verifyOtp: (
      otp: number,
      onSuccess?: (data: unknown) => void,
      onError?: (error: unknown) => void,
      reqId?: string,
    ) => void
    retryOtp: (
      channel: string | null,
      onSuccess?: (data: unknown) => void,
      onError?: (error: unknown) => void,
      reqId?: string,
    ) => void
    initSendOTP: (config: unknown) => void
  }
}

interface EditPhoneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPhone: string
}

export function EditPhoneModal({ open, onOpenChange, currentPhone }: EditPhoneModalProps) {
  const [step, setStep] = useState<'input' | 'otp'>('input')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [widgetReady, setWidgetReady] = useState(false)
  const [requestId, setRequestId] = useState('')

  useEffect(() => {
    if (open) {
      setStep('input')
      setPhone('')
      setOtp(['', '', '', '', '', ''])
      setTimer(60)
      setError('')
      setRequestId('')
    }
  }, [open])

  // Check if MSG91 sendOtp is already available
  useEffect(() => {
    if (typeof window.sendOtp === 'function') {
      setWidgetReady(true)
    }
  }, [])

  // Timer countdown for OTP
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  const handleSendOtp = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number')
      return
    }

    const fullPhone = `+91${digits}`
    if (fullPhone === currentPhone) {
      setError('New number must be different from current number')
      return
    }

    if (!widgetReady || !window.sendOtp) {
      setError('OTP service loading, please try again')
      return
    }

    setLoading(true)
    setError('')

    const mobile = `91${digits}`

    window.sendOtp(
      mobile,
      (data) => {
        const reqId = (data as { message?: string })?.message || ''
        setRequestId(reqId)
        setStep('otp')
        setTimer(60)
        setLoading(false)
      },
      (err) => {
        console.error('OTP send error:', err)
        setError('Failed to send OTP. Please try again.')
        setLoading(false)
      }
    )
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      setError('')

      if (value && index < 5) {
        const nextInput = document.getElementById(`edit-phone-otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`edit-phone-otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''))
      const lastInput = document.getElementById('edit-phone-otp-5')
      lastInput?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Enter complete 6-digit OTP')
      return
    }

    if (!window.verifyOtp) {
      setError('Verification service loading, please try again')
      return
    }

    setLoading(true)
    setError('')

    const digits = phone.replace(/\D/g, '')
    const fullPhone = `+91${digits}`

    window.verifyOtp(
      parseInt(otpCode, 10),
      async () => {
        // OTP verified — now update phone in DB
        try {
          const res = await fetch('/api/auth/update-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPhone: fullPhone }),
          })

          const result = await res.json()

          if (!res.ok || result.error) {
            setError(result.error || 'Failed to update phone number')
            setLoading(false)
            return
          }

          toast.success('Phone number updated successfully')
          onOpenChange(false)
          // Reload to reflect new phone everywhere
          window.location.reload()
        } catch {
          setError('Something went wrong. Please try again.')
          setLoading(false)
        }
      },
      (err) => {
        console.error('OTP verify error:', err)
        setError('Invalid OTP. Please try again.')
        setLoading(false)
      },
      requestId || undefined,
    )
  }

  const handleResend = () => {
    setTimer(60)
    setError('')

    const digits = phone.replace(/\D/g, '')
    const mobile = `91${digits}`

    if (window.retryOtp) {
      window.retryOtp(
        mobile,
        () => toast.success('OTP resent'),
        (err) => {
          console.error('Resend error:', err)
          setError('Failed to resend OTP')
        },
      )
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <Script
        src="https://verify.msg91.com/otp-provider.js"
        strategy="afterInteractive"
        onLoad={() => {
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
          }
        }}
      />

      <div className="w-full max-w-md bg-[#18181B] rounded-t-2xl sm:rounded-2xl border border-[#3F3F46]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3F3F46]">
          <h2 className="text-lg font-bold text-[#FAFAFA]">
            {step === 'input' ? 'Edit Phone Number' : 'Verify OTP'}
          </h2>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-[#27272A] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#A1A1AA]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {step === 'input' ? (
            <>
              {/* Current phone */}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Current Phone</label>
                <p className="text-[#FAFAFA] text-sm bg-[#27272A] border border-[#3F3F46] rounded-lg h-12 flex items-center px-4">
                  {currentPhone}
                </p>
              </div>

              {/* New phone */}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">New Phone Number</label>
                <div className="flex gap-2">
                  <div className="h-12 px-3 bg-[#27272A] border border-[#3F3F46] rounded-lg flex items-center text-[#A1A1AA] text-sm">
                    +91
                  </div>
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-[#F43F5E]">{error}</p>}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-12 border border-[#3F3F46] text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* OTP step */}
              <p className="text-sm text-[#A1A1AA] text-center">
                Code sent to +91 {phone.slice(0, 2)}xxx {phone.slice(7)}
              </p>

              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`edit-phone-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl border border-[#3F3F46] bg-[#27272A] rounded-lg focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]"
                    maxLength={1}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-[#A1A1AA]">
                  {timer > 0 ? (
                    <>Resend in 0:{timer.toString().padStart(2, '0')}</>
                  ) : (
                    <button
                      className="text-[#8B5CF6] hover:underline"
                      onClick={handleResend}
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>

              {error && <p className="text-sm text-[#F43F5E] text-center">{error}</p>}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep('input'); setOtp(['', '', '', '', '', '']); setError('') }}
                  className="flex-1 h-12 border border-[#3F3F46] text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
