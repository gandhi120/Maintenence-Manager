'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ProjectTabsProps {
  projectId: string
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname()

  const tabs = [
    { id: 'machines', label: 'Machines', href: `/projects/${projectId}/machines` },
    { id: 'issues', label: 'Issues', href: `/projects/${projectId}/issues`, badge: '5' },
    { id: 'work-orders', label: 'Work Orders', href: `/projects/${projectId}/work-orders`, badge: '2' },
  ]

  return (
    <div className="flex gap-6 px-4 border-b border-[#3F3F46]">
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.id)
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`pb-3 px-1 text-sm font-medium relative flex items-center gap-2 ${
              isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className={`${
                isActive ? 'bg-[#8B5CF6]' : 'bg-[#3F3F46]'
              } text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center`}>
                {tab.badge}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6]" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
