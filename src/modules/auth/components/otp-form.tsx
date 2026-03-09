'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function OtpForm() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(28)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerify = () => {
    if (otp.every((digit) => digit !== '')) {
      // Both roles go to /dashboard; the page handles branching by role
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#FAFAFA] mb-2">Enter Verification Code</h1>
          <p className="text-sm text-[#A1A1AA]">Code sent to +91 98765 43210</p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-14 text-center text-xl border border-[#3F3F46] bg-[#18181B] rounded-lg focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]"
              maxLength={1}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-all font-medium mb-6 shadow-lg shadow-[#8B5CF6]/20"
        >
          Verify & Continue
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-[#A1A1AA]">
            {timer > 0 ? (
              <>Resend in 0:{timer.toString().padStart(2, '0')}</>
            ) : (
              <button className="text-[#8B5CF6] hover:underline" onClick={() => setTimer(28)}>
                Resend OTP
              </button>
            )}
          </p>
          <button
            className="text-sm text-[#8B5CF6] hover:underline"
            onClick={() => router.push('/login')}
          >
            Change Number
          </button>
        </div>
      </div>
    </div>
  )
}
