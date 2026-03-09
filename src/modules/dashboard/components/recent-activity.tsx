const demoActivities = [
  {
    id: 1,
    color: 'bg-[#10B981]',
    text: <><span className="font-medium">Amit</span> resolved <span className="text-[#8B5CF6]">Hydraulic leak</span></>,
    subtitle: 'Tower Crane • Site A • 2h ago',
  },
  {
    id: 2,
    color: 'bg-[#38BDF8]',
    text: <><span className="font-medium">Priya</span> logged maintenance</>,
    subtitle: 'Generator • Honda Factory • 5h ago',
  },
  {
    id: 3,
    color: 'bg-[#F43F5E]',
    text: <>New issue reported by <span className="font-medium">Rajesh</span></>,
    subtitle: 'Excavator • Site A • 8h ago',
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RecentActivity({ activities }: { activities: never[] }) {
  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {demoActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
            <div className="flex-1">
              <p className="text-sm text-[#FAFAFA]">{activity.text}</p>
              <p className="text-xs text-[#A1A1AA]">{activity.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
