const demoMaintenance = [
  { machine: 'Excavator A-10', project: 'Construction Site A', projectColor: 'bg-[#8B5CF6]', dueIn: '2 days' },
  { machine: 'Compressor Unit 5', project: 'Honda Factory', projectColor: 'bg-[#10B981]', dueIn: '5 days' },
  { machine: 'Pump System C', project: 'Tata Steel Plant', projectColor: 'bg-[#F59E0B]', dueIn: '7 days' },
]

interface UpcomingMaintenanceProps {
  machines: never[]
}

export function UpcomingMaintenance({ machines }: UpcomingMaintenanceProps) {
  const displayItems = machines.length > 0 ? machines : demoMaintenance

  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Upcoming Maintenance</h2>

      <div className="space-y-3">
        {(displayItems as typeof demoMaintenance).map((item, index) => (
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
    </div>
  )
}
