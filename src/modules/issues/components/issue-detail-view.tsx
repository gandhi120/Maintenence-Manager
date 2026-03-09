'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react'

const statuses = [
  { label: 'Open', color: 'text-[#A1A1AA]' },
  { label: 'Assigned', color: 'text-[#38BDF8]' },
  { label: 'In Progress', color: 'text-[#8B5CF6]' },
  { label: 'Resolved', color: 'text-[#10B981]' },
]

const activity = [
  { action: 'Rajesh reported issue', time: '8 Mar 2:34 PM', user: 'R' },
  { action: 'Assigned to Amit', time: '8 Mar 3:00 PM', user: 'A' },
  { action: 'Amit: Parts ordered, repair scheduled', time: '9 Mar 10:15 AM', user: 'A' },
]

interface IssueDetailViewProps {
  issue: { id: string; title: string; description: string | null; priority: string; status: string } | null
  projectId: string
  issueId: string
}

export function IssueDetailView({ issue, projectId }: IssueDetailViewProps) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(2)
  const [formData, setFormData] = useState({
    technician: 'Amit Sharma',
    completionDate: '2025-03-12',
    repairNotes: 'Inspected hydraulic lines. Seal replacement needed. Parts ordered.',
  })

  const title = issue?.title || 'Hydraulic oil leak detected in boom section'
  const description = issue?.description || 'Noticed hydraulic fluid pooling beneath the boom section during routine inspection. Appears to be coming from the main cylinder seal.'
  const priority = issue?.priority || 'high'

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push(`/projects/${projectId}/issues`)}
            className="p-2 hover:bg-[#27272A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#FAFAFA]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#FAFAFA]">Issue Detail</h1>
          </div>
        </div>
        <p className="text-xs text-[#A1A1AA] ml-14">Site A &gt; Issues &gt; Hydraulic oil leak</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Issue Summary Card */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 space-y-3">
          <h2 className="text-lg font-bold text-[#FAFAFA] mb-2">{title}</h2>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">{description}</p>

          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className={`text-xs px-2 py-1 rounded-md border ${
              priority === 'high' ? 'bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/30' :
              priority === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30' :
              'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
            }`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </span>
            <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded-md">
              In Progress
            </span>
            <span className="text-xs bg-[#27272A] text-[#A1A1AA] px-2 py-1 rounded-md">
              Tower Crane
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#3F3F46]">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center text-white text-xs font-medium">
              R
            </div>
            <div>
              <p className="text-sm text-[#FAFAFA]">Rajesh Kumar</p>
              <p className="text-xs text-[#A1A1AA]">8 Mar 2025, 2:34 PM</p>
            </div>
          </div>

          {/* Attached Photo placeholder */}
          <div className="w-full h-40 bg-[#27272A] rounded-lg border border-[#3F3F46]"></div>
        </div>

        {/* Work Order Section */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
          <h3 className="text-base font-semibold text-[#FAFAFA] mb-4">Work Order</h3>

          {/* Status Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between relative mb-2">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#3F3F46] z-0"></div>
              <div
                className="absolute top-4 left-0 h-0.5 bg-[#8B5CF6] z-0 transition-all"
                style={{ width: `${(currentStatus / (statuses.length - 1)) * 100}%` }}
              ></div>

              {statuses.map((status, index) => (
                <div key={index} className="flex flex-col items-center z-10 flex-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStatus(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all ${
                      index <= currentStatus
                        ? 'bg-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/30'
                        : 'bg-[#27272A] border-2 border-[#3F3F46]'
                    }`}
                  >
                    {index <= currentStatus && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-xs text-center ${
                    index <= currentStatus ? status.color : 'text-[#52525B]'
                  }`}>
                    {status.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Assigned to</label>
              <div className="flex items-center gap-3 p-3 bg-[#27272A] rounded-lg border border-[#3F3F46]">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#FAFAFA] font-medium">Amit Sharma</p>
                  <p className="text-xs text-[#A1A1AA]">Senior Technician</p>
                </div>
                <button className="text-xs text-[#8B5CF6] hover:underline">Change</button>
              </div>
            </div>

            <div>
              <label htmlFor="completionDate" className="block text-sm text-[#A1A1AA] mb-2">Est. Completion</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  id="completionDate"
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="repairNotes" className="block text-sm text-[#A1A1AA] mb-2">Repair Notes</label>
              <textarea
                id="repairNotes"
                value={formData.repairNotes}
                onChange={(e) => setFormData({ ...formData, repairNotes: e.target.value })}
                placeholder="Add repair notes..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B] resize-none"
              />
            </div>
          </div>

          <button className="w-full h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium mt-4">
            Update Status
          </button>
        </div>

        {/* Activity Timeline */}
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
          <h3 className="text-base font-semibold text-[#FAFAFA] mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Activity Log
          </h3>

          <div className="space-y-4">
            {activity.map((entry, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {entry.user}
                  </div>
                  {index < activity.length - 1 && (
                    <div className="w-px flex-1 bg-[#3F3F46] my-1 min-h-[20px]" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-[#FAFAFA] mb-1">{entry.action}</p>
                  <p className="text-xs text-[#A1A1AA]">{entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
