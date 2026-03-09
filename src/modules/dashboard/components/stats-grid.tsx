import { Briefcase, Settings, AlertCircle, Calendar } from 'lucide-react'

interface StatsGridProps {
  stats: { totalProjects: number; totalMachines: number; openIssues: number; maintenanceDue: number } | null
}

export function StatsGrid({ stats }: StatsGridProps) {
  const displayStats = [
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, icon: Briefcase, color: 'bg-[#8B5CF6]' },
    { label: 'Total Machines', value: stats?.totalMachines ?? 0, icon: Settings, color: 'bg-[#38BDF8]' },
    { label: 'Open Issues', value: stats?.openIssues ?? 0, icon: AlertCircle, color: 'bg-[#F43F5E]' },
    { label: 'Maintenance Due', value: stats?.maintenanceDue ?? 0, icon: Calendar, color: 'bg-[#F59E0B]' },
  ]

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
          <div>
            <div className="text-2xl font-bold text-[#FAFAFA] mb-1">{stat.value}</div>
            <div className="text-xs text-[#A1A1AA]">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
