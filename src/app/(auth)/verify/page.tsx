import { Suspense } from 'react'
import { OtpForm } from '@/modules/auth/components/otp-form'

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-[#A1A1AA]">Loading...</div>
      </div>
    }>
      <OtpForm />
    </Suspense>
  )
}
