'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, AlertCircle, Wrench, Edit } from 'lucide-react'

const demoMaintenanceHistory = [
  { date: '10 Mar 2025', technician: 'Amit Sharma', type: 'Routine Checkup', notes: 'All systems normal. Hydraulic fluid level checked and topped off.' },
  { date: '8 Feb 2025', technician: 'Priya Patel', type: 'Oil Change', notes: 'Replaced hydraulic fluid. Inspected hoses and connections.' },
  { date: '5 Jan 2025', technician: 'Amit Sharma', type: 'Repair', notes: 'Fixed boom rotation motor. Replaced worn gear assembly.' },
]

interface MachineDetailViewProps {
  machine: { id: string; name: string; type: string; status: string; serial_number: string | null; zone: string | null; image_url: string | null; last_maintenance_date: string | null; maintenance_cycle_days: number; created_at: string } | null
  projectId: string
  machineId: string
}

export function MachineDetailView({ machine, projectId }: MachineDetailViewProps) {
  const router = useRouter()
  const name = machine?.name || 'Tower Crane'
  const type = machine?.type || 'Crane'
  const status = machine?.status === 'active' ? 'Active' : machine?.status === 'under_repair' ? 'Under Repair' : 'Inactive'
  const statusColor = status === 'Active' ? 'bg-[#10B981]' : status === 'Under Repair' ? 'bg-[#F43F5E]' : 'bg-[#71717A]'
  const serial = machine?.serial_number || '#TC-2024-001'
  const zone = machine?.zone || 'Zone 2'
  const imageUrl = machine?.image_url || 'https://images.unsplash.com/photo-1659449082344-53f79e1e4198?w=1080&fit=crop'
  const cycleDays = machine?.maintenance_cycle_days || 30
  const elapsed = 18
  const progress = Math.round((elapsed / cycleDays) * 100)

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push(`/projects/${projectId}/machines`)} className="p-2 hover:bg-[#27272A] rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#FAFAFA]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#FAFAFA]">{name}</h1>
          </div>
        </div>
        <p className="text-xs text-[#A1A1AA] ml-14">Site A &gt; {name}</p>
      </div>

      <div className="space-y-4">
        {/* Hero Image */}
        <div className="relative h-48 w-full bg-[#27272A] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent z-10"></div>
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">{name}</h2>
              <span className="text-xs bg-[#27272A]/80 text-[#A1A1AA] px-2 py-1 rounded-md backdrop-blur-sm">{type}</span>
            </div>
            <span className={`${statusColor} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              {status}
            </span>
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* Info Card */}
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#A1A1AA] mb-1">Serial Number</p>
                <p className="text-sm text-[#FAFAFA] font-medium">{serial}</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA] mb-1">Location</p>
                <p className="text-sm text-[#FAFAFA] font-medium">{zone}</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA] mb-1">Added</p>
                <p className="text-sm text-[#FAFAFA] font-medium">10 Jan 2025</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA] mb-1">Status</p>
                <span className={`text-sm font-medium ${status === 'Active' ? 'text-[#10B981]' : status === 'Under Repair' ? 'text-[#F43F5E]' : 'text-[#71717A]'}`}>{status}</span>
              </div>
            </div>
          </div>

          {/* Next Maintenance Card */}
          <div className="bg-[#18181B] border-l-4 border-[#F59E0B] border-r border-t border-b border-r-[#3F3F46] border-t-[#3F3F46] border-b-[#3F3F46] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F59E0B] blur-lg opacity-20"></div>
                <Calendar className="relative w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Next Maintenance</h3>
                <p className="text-lg font-bold text-[#FAFAFA] mb-1">April 9, 2025</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded-md">12 days away</span>
                  <span className="text-xs text-[#A1A1AA]">Cycle: {cycleDays} days</span>
                </div>
                {/* Progress Ring */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg className="transform -rotate-90 w-12 h-12">
                      <circle cx="24" cy="24" r="20" stroke="#27272A" strokeWidth="4" fill="none" />
                      <circle cx="24" cy="24" r="20" stroke="#8B5CF6" strokeWidth="4" fill="none" strokeDasharray={`${(elapsed / cycleDays) * 125.6} 125.6`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-[#FAFAFA]">{progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#A1A1AA]">{elapsed} of {cycleDays} days elapsed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance History */}
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
            <h3 className="text-base font-semibold text-[#FAFAFA] mb-4">Maintenance History</h3>
            <div className="space-y-4">
              {demoMaintenanceHistory.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                    {index < demoMaintenanceHistory.length - 1 && (
                      <div className="w-px flex-1 bg-[#3F3F46] my-1 min-h-[40px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#FAFAFA]">{entry.date}</span>
                      <span className="text-xs text-[#A1A1AA]">•</span>
                      <span className="text-xs text-[#A1A1AA]">{entry.technician}</span>
                    </div>
                    <span className="text-xs bg-[#38BDF8]/20 text-[#38BDF8] px-2 py-0.5 rounded-md inline-block mb-2">{entry.type}</span>
                    <p className="text-sm text-[#A1A1AA]">{entry.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.push(`/projects/${projectId}/issues/new`)} className="h-12 bg-[#F43F5E] text-white rounded-lg hover:bg-[#E11D48] transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#F43F5E]/20">
              <AlertCircle className="w-4 h-4" />
              Report Issue
            </button>
            <button className="h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium flex items-center justify-center gap-2">
              <Wrench className="w-4 h-4" />
              Log Maintenance
            </button>
          </div>
          <button className="w-full h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Machine
          </button>
        </div>
      </div>
    </div>
  )
}
