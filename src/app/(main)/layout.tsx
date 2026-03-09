import { BottomNav } from '@/shared/components/layout/bottom-nav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <BottomNav />
    </div>
  )
}
