'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/shared/providers/auth-provider'
import { canAddMachine } from '@/lib/utils/permissions'

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

  const displayMachines = machines.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    status: m.status === 'active' ? 'Active' : m.status === 'under_repair' ? 'Under Repair' : 'Inactive',
    statusColor: getStatusColor(m.status),
    lastMaintenance: m.last_maintenance_date || 'N/A',
    image_url: m.image_url,
  }))

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
      {filtered.length === 0 ? (
        <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-8 text-center">
          <p className="text-sm text-[#A1A1AA]">Machines are not found</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((machine) => (
            <Link
              key={machine.id}
              href={`/projects/${projectId}/machines/${machine.id}`}
              className="bg-[#18181B] border border-[#3F3F46] rounded-xl overflow-hidden hover:border-[#8B5CF6]/50 transition-all"
            >
              <div className="w-full h-32 bg-[#27272A] relative overflow-hidden">
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
              <div className="p-2 sm:p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-[#FAFAFA] mb-1 truncate">{machine.name}</h3>
                <p className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-[#27272A] text-[#A1A1AA] rounded-md inline-block mb-2">
                  {machine.type}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${machine.statusColor}`}></div>
                    <span className="text-[10px] sm:text-xs text-[#A1A1AA]">{machine.status}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#A1A1AA] truncate">Last: {machine.lastMaintenance}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
