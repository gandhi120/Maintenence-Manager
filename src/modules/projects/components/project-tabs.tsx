'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ProjectTabsProps {
  projectId: string
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname()

  const tabs = [
    { id: 'machines', label: 'Machines', href: `/projects/${projectId}/machines`, upcoming: false },
    { id: 'issues', label: 'Issues', href: `/projects/${projectId}/issues`, upcoming: true },
    { id: 'work-orders', label: 'Work Orders', href: `/projects/${projectId}/work-orders`, upcoming: true },
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
            {tab.upcoming && (
              <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                Soon
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
