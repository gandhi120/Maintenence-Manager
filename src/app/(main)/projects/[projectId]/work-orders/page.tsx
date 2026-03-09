import { Construction } from 'lucide-react'

export default async function WorkOrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 pt-20">
      <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-[#F59E0B]" />
      </div>
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-2">Work Orders - Coming Soon</h2>
      <p className="text-sm text-[#A1A1AA] text-center max-w-xs">
        Create and manage work orders, assign technicians, and track repair progress with a Kanban board.
      </p>
      <span className="mt-4 text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-3 py-1 rounded-full font-medium">
        Upcoming Feature
      </span>
    </div>
  )
}
