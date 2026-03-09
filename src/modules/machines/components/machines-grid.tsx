'use client'

import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/shared/providers/auth-provider'
import { canAddMachine } from '@/lib/utils/permissions'

const demoMachines = [
  {
    id: '1',
    name: 'Tower Crane',
    type: 'Crane',
    status: 'Active',
    statusColor: 'bg-[#10B981]',
    lastMaintenance: '10 Mar',
    image_url: 'https://images.unsplash.com/photo-1659449082344-53f79e1e4198?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Excavator B-12',
    type: 'Excavator',
    status: 'Active',
    statusColor: 'bg-[#10B981]',
    lastMaintenance: '5 Mar',
    image_url: 'https://images.unsplash.com/photo-1691052657402-90b45c0f6dca?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Generator Unit 3',
    type: 'Generator',
    status: 'Under Repair',
    statusColor: 'bg-[#F43F5E]',
    lastMaintenance: '1 Mar',
    image_url: 'https://images.unsplash.com/photo-1738918921961-72d2f3f6509e?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Air Compressor',
    type: 'Compressor',
    status: 'Inactive',
    statusColor: 'bg-[#71717A]',
    lastMaintenance: '8 Mar',
    image_url: 'https://images.unsplash.com/photo-1655165312002-9d781ad4046e?w=400&h=300&fit=crop',
  },
]

interface MachinesGridProps {
  machines: Array<{ id: string; name: string; type: string; status: string; image_url: string | null; last_maintenance_date: string | null }>
  projectId: string
}

export function MachinesGrid({ machines, projectId }: MachinesGridProps) {
  const [search, setSearch] = useState('')
  const { role } = useAuth()
  const showAdd = canAddMachine(role)

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-[#10B981]'
    if (status === 'under_repair') return 'bg-[#F43F5E]'
    return 'bg-[#71717A]'
  }

  const displayMachines = machines.length > 0 ? machines.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    status: m.status === 'active' ? 'Active' : m.status === 'under_repair' ? 'Under Repair' : 'Inactive',
    statusColor: getStatusColor(m.status),
    lastMaintenance: m.last_maintenance_date || 'N/A',
    image_url: m.image_url,
  })) : demoMachines

  const filtered = displayMachines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4">
      {/* Filter Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#3F3F46] bg-[#18181B] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] text-sm placeholder:text-[#52525B]"
          />
        </div>
        <button className="h-10 px-3 bg-[#18181B] border border-[#3F3F46] rounded-lg flex items-center gap-2 hover:bg-[#27272A] transition-colors">
          <Filter className="w-4 h-4 text-[#A1A1AA]" />
        </button>
        {showAdd && (
          <Link
            href={`/projects/${projectId}/machines/new`}
            className="h-10 px-4 bg-[#8B5CF6] text-white rounded-lg flex items-center gap-2 hover:bg-[#7C3AED] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Link>
        )}
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((machine) => (
          <Link
            key={machine.id}
            href={`/projects/${projectId}/machines/${machine.id}`}
            className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden hover:border-[#8B5CF6]/50 transition-all"
          >
            <div className="aspect-video bg-[#27272A] relative overflow-hidden">
              {machine.image_url ? (
                <img
                  src={machine.image_url}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#52525B]">
                  No Image
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-1">{machine.name}</h3>
              <p className="text-xs px-2 py-0.5 bg-[#27272A] text-[#A1A1AA] rounded-md inline-block mb-2">
                {machine.type}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${machine.statusColor}`}></div>
                  <span className="text-xs text-[#A1A1AA]">{machine.status}</span>
                </div>
                <span className="text-xs text-[#A1A1AA]">Last: {machine.lastMaintenance}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
