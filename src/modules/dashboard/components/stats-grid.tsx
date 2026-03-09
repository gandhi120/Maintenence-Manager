import { Briefcase, Settings, AlertCircle, Calendar, TrendingUp } from 'lucide-react'

const defaultStats = [
  { label: 'Total Projects', value: '8', icon: Briefcase, color: 'bg-[#8B5CF6]', trend: '+2' },
  { label: 'Total Machines', value: '34', icon: Settings, color: 'bg-[#38BDF8]', trend: '+5' },
  { label: 'Open Issues', value: '12', icon: AlertCircle, color: 'bg-[#F43F5E]', trend: '-3' },
  { label: 'Maintenance Due', value: '6', icon: Calendar, color: 'bg-[#F59E0B]', trend: '+1' },
]

interface StatsGridProps {
  stats: { totalProjects: number; totalMachines: number; openIssues: number; maintenanceDue: number } | null
}

export function StatsGrid({ stats }: StatsGridProps) {
  const displayStats = stats ? [
    { label: 'Total Projects', value: String(stats.totalProjects), icon: Briefcase, color: 'bg-[#8B5CF6]', trend: '+2' },
    { label: 'Total Machines', value: String(stats.totalMachines), icon: Settings, color: 'bg-[#38BDF8]', trend: '+5' },
    { label: 'Open Issues', value: String(stats.openIssues), icon: AlertCircle, color: 'bg-[#F43F5E]', trend: '-3' },
    { label: 'Maintenance Due', value: String(stats.maintenanceDue), icon: Calendar, color: 'bg-[#F59E0B]', trend: '+1' },
  ] : defaultStats

  return (
    <div className="grid grid-cols-2 gap-3">
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl p-4 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">{stat.value}</div>
              <div className="text-xs text-[#A1A1AA]">{stat.label}</div>
            </div>
            <div className="flex items-center gap-1 text-[#10B981] text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>{stat.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
