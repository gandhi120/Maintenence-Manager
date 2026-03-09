'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, User } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Projects', icon: Briefcase, path: '/projects' },
  { label: 'Profile', icon: User, path: '/profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#18181B] border-t border-[#3F3F46] px-4 py-3 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path ||
            (item.path !== '/dashboard' && pathname.startsWith(item.path))

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center gap-1 min-w-16 relative"
            >
              <div className="relative">
                <item.icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'
                  }`}
                />
              </div>
              <span
                className={`text-xs ${
                  isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'
                }`}
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
