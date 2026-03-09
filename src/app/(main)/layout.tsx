import { BottomNav } from '@/shared/components/layout/bottom-nav'
import { AuthProvider } from '@/shared/providers/auth-provider'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {children}
        <BottomNav />
      </div>
    </AuthProvider>
  )
}
