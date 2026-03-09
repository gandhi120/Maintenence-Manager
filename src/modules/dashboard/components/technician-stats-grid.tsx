'use client'

import { ClipboardList, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface TechnicianStatsGridProps {
  stats: {
    assignedWOs: number
    urgentTasks: number
    completedThisWeek: number
    upcomingDeadlines: number
  } | null
}

const demoStats = {
  assignedWOs: 4,
  urgentTasks: 1,
  completedThisWeek: 3,
  upcomingDeadlines: 2,
}

export function TechnicianStatsGrid({ stats }: TechnicianStatsGridProps) {
  const s = stats || demoStats

  const cards = [
    { label: 'Assigned', value: s.assignedWOs, icon: ClipboardList, color: '#38BDF8' },
    { label: 'Urgent', value: s.urgentTasks, icon: AlertTriangle, color: '#F43F5E' },
    { label: 'Done This Week', value: s.completedThisWeek, icon: CheckCircle, color: '#10B981' },
    { label: 'Due Soon', value: s.upcomingDeadlines, icon: Clock, color: '#F59E0B' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <card.icon className="w-4 h-4" style={{ color: card.color }} />
            <span className="text-xs text-[#A1A1AA]">{card.label}</span>
          </div>
          <p className="text-2xl font-bold text-[#FAFAFA]">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
