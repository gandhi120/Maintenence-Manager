'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Leaf, AlertTriangle, Flame } from 'lucide-react'

interface ReportIssueFormProps {
  projectId: string
}

export function ReportIssueForm({ projectId }: ReportIssueFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    machine: 'Tower Crane',
    title: '',
    description: '',
    priority: 'High',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/projects/${projectId}/issues`)
  }

  const priorities = [
    { value: 'Low', color: 'border-[#10B981]', bgColor: 'bg-[#10B981]', textColor: 'text-[#10B981]', icon: Leaf },
    { value: 'Medium', color: 'border-[#F59E0B]', bgColor: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]', icon: AlertTriangle },
    { value: 'High', color: 'border-[#F43F5E]', bgColor: 'bg-[#F43F5E]', textColor: 'text-[#F43F5E]', icon: Flame },
  ]

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push(`/projects/${projectId}/issues`)}
            className="p-2 hover:bg-[#27272A] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#FAFAFA]" />
          </button>
          <h1 className="text-xl font-bold text-[#FAFAFA]">Report Issue</h1>
        </div>
        <div className="flex gap-2 ml-14">
          <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded-md">
            Project: Construction Site A
          </span>
          <span className="text-xs bg-[#38BDF8]/20 text-[#38BDF8] px-2 py-1 rounded-md">
            Machine: Tower Crane
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-4">
          {/* Machine Selector */}
          <div>
            <label htmlFor="machine" className="block text-sm text-[#A1A1AA] mb-2">Machine</label>
            <select
              id="machine"
              value={formData.machine}
              onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
              className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA]"
              required
            >
              <option value="Tower Crane">Tower Crane</option>
              <option value="Excavator B-12">Excavator B-12</option>
              <option value="Generator Unit 3">Generator Unit 3</option>
              <option value="Air Compressor">Air Compressor</option>
            </select>
          </div>

          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="block text-sm text-[#A1A1AA] mb-2">Issue Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Hydraulic oil leak in boom section"
              className="w-full h-12 px-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm text-[#A1A1AA] mb-2">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the problem, what you observed, and exact location..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] placeholder:text-[#52525B] resize-none"
              required
            />
          </div>

          {/* Priority Selector */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-3">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={`h-24 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                    formData.priority === priority.value
                      ? `${priority.color} bg-opacity-10`
                      : 'border-[#3F3F46] hover:border-[#52525B]'
                  }`}
                  style={formData.priority === priority.value ? { backgroundColor: `${priority.bgColor.replace('bg-[', '').replace(']', '')}15` } : {}}
                >
                  <priority.icon
                    className={`w-5 h-5 ${
                      formData.priority === priority.value ? priority.textColor : 'text-[#A1A1AA]'
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    formData.priority === priority.value ? priority.textColor : 'text-[#A1A1AA]'
                  }`}>
                    {priority.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2">Photo</label>
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square border-2 border-dashed border-[#3F3F46] rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#8B5CF6] transition-colors cursor-pointer bg-[#27272A]">
                <Camera className="w-5 h-5 text-[#A1A1AA]" />
                <span className="text-xs text-[#A1A1AA]">Add</span>
              </div>
              <div className="aspect-square border border-[#3F3F46] rounded-lg bg-[#27272A]"></div>
              <div className="aspect-square border border-[#3F3F46] rounded-lg bg-[#27272A]"></div>
              <div className="aspect-square border border-[#3F3F46] rounded-lg bg-[#27272A]"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 h-12 bg-[#F43F5E] text-white rounded-lg hover:bg-[#E11D48] transition-colors font-medium shadow-lg shadow-[#F43F5E]/20"
          >
            Submit Issue
          </button>
          <button
            type="button"
            onClick={() => router.push(`/projects/${projectId}/issues`)}
            className="flex-1 h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  )
}
