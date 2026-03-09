import { Construction } from 'lucide-react'

export default async function IssuesPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 pt-20">
      <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-[#F59E0B]" />
      </div>
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-2">Issues - Coming Soon</h2>
      <p className="text-sm text-[#A1A1AA] text-center max-w-xs">
        Report and track machine issues, assign priorities, and monitor resolution progress.
      </p>
      <span className="mt-4 text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-3 py-1 rounded-full font-medium">
        Upcoming Feature
      </span>
    </div>
  )
}
