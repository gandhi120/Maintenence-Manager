import { Calendar } from 'lucide-react'

interface UpcomingMaintenanceProps {
  machines: Array<{
    machine: string
    project: string
    projectColor: string
    dueIn: string
  }>
}

export function UpcomingMaintenance({ machines }: UpcomingMaintenanceProps) {
  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Upcoming Maintenance</h2>

      {machines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-[#52525B]" />
          </div>
          <p className="text-sm text-[#A1A1AA]">No upcoming maintenance scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {machines.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#27272A] rounded-lg hover:bg-[#27272A]/80 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#FAFAFA] mb-1">{item.machine}</h3>
                <span className={`${item.projectColor} text-white text-xs px-2 py-0.5 rounded-full`}>
                  {item.project}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#F59E0B]">Due in {item.dueIn}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
