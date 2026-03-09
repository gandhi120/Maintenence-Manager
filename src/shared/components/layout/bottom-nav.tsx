'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/shared/providers/auth-provider'
import { getNavItems } from '@/lib/config/navigation'

export function BottomNav() {
  const pathname = usePathname()
  const { role } = useAuth()
  const navItems = getNavItems(role)

  const accentColor = role === 'technician' ? '#38BDF8' : '#8B5CF6'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#18181B] border-t border-[#3F3F46] px-4 py-3 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 min-w-16 relative"
            >
              <div className="relative">
                <item.icon
                  className="w-6 h-6"
                  style={{ color: isActive ? accentColor : '#A1A1AA' }}
                />
              </div>
              <span
                className="text-xs"
                style={{ color: isActive ? accentColor : '#A1A1AA' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
