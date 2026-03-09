import { Clock } from 'lucide-react'

interface Activity {
  id: string | number
  action: string
  description: string
  created_at: string
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Recent Activity</h2>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-[#52525B]" />
          </div>
          <p className="text-sm text-[#A1A1AA]">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-[#FAFAFA]">{activity.description}</p>
                <p className="text-xs text-[#A1A1AA]">
                  {new Date(activity.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
