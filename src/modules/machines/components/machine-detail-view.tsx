'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Wrench, Edit, Check, Square } from 'lucide-react'
import { useAuth } from '@/shared/providers/auth-provider'
import { canEditMachine, canLogMaintenance } from '@/lib/utils/permissions'
import { LogMaintenanceModal } from './log-maintenance-modal'
import { EditMachineModal } from './edit-machine-modal'

interface MachineDetailViewProps {
  machine: {
    id: string
    name: string
    type: string
    status: string
    serial_number: string | null
    zone: string | null
    image_url: string | null
    last_maintenance_date: string | null
    maintenance_cycle_days: number
    next_maintenance_date: string | null
    created_at: string
    project?: { id: string; name: string; color: string; location: string } | null
  } | null
  projectId: string
  machineId: string
  maintenanceLog: Array<{
    id: string
    date: string
    maintenance_type: string
    notes: string | null
    checklist?: Array<{ label: string; checked: boolean }> | null
    technician?: { id: string; name: string } | null
  }>
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getDaysUntilNext(lastDate: string | null, cycleDays: number): { nextDate: string; daysAway: number; elapsed: number } | null {
  if (!lastDate) return null
  const last = new Date(lastDate)
  const next = new Date(last)
  next.setDate(next.getDate() + cycleDays)
  const now = new Date()
  const daysAway = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const elapsed = Math.max(0, Math.ceil((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)))
  return {
    nextDate: next.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    daysAway,
    elapsed: Math.min(elapsed, cycleDays),
  }
}

export function MachineDetailView({ machine, projectId, maintenanceLog }: MachineDetailViewProps) {
  const router = useRouter()
  const { role } = useAuth()
  const showEdit = canEditMachine(role)
  const showLogMaintenance = canLogMaintenance(role)
  const [logMaintenanceOpen, setLogMaintenanceOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  if (!machine) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#A1A1AA] mb-4">Machine not found</p>
          <button onClick={() => router.push(`/projects/${projectId}/machines`)} className="text-sm text-[#8B5CF6] hover:underline">
            Back to machines
          </button>
        </div>
      </div>
    )
  }

  const status = machine.status === 'active' ? 'Active' : machine.status === 'under_repair' ? 'Under Repair' : 'Inactive'
  const statusColor = status === 'Active' ? 'bg-[#10B981]' : status === 'Under Repair' ? 'bg-[#F43F5E]' : 'bg-[#71717A]'
  const cycleDays = machine.maintenance_cycle_days
  const maintenance = getDaysUntilNext(machine.last_maintenance_date, cycleDays)
  const progress = maintenance ? Math.round((maintenance.elapsed / cycleDays) * 100) : 0

  return (
    <div className="min-h-screen bg-[#09090B] pb-24">
      {/* Header */}
      <div className="bg-[#18181B] border-b border-[#3F3F46] px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.push(`/projects/${projectId}/machines`)} className="p-2 hover:bg-[#27272A] rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#FAFAFA]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#FAFAFA]">{machine.name}</h1>
          </div>
        </div>
        {machine.project && (
          <p className="text-xs text-[#A1A1AA] ml-14">{machine.project.name} &gt; {machine.name}</p>
        )}
      </div>

      <div className="space-y-4">
        {/* Hero Image + Info Card Row */}
        <div className="px-4 pt-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="relative w-48 h-48 flex-shrink-0 bg-[#27272A] rounded-xl overflow-hidden">
              {machine.image_url ? (
                <img src={machine.image_url} alt={machine.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#52525B] text-sm">No Image</div>
              )}
            </div>

            {/* Info Card */}
            <div className="flex-1 bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-[#FAFAFA]">{machine.name}</h2>
                  <span className="text-xs text-[#A1A1AA]">{machine.type}</span>
                </div>
                <span className={`${statusColor} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  {status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-1">Serial Number</p>
                  <p className="text-sm text-[#FAFAFA] font-medium">{machine.serial_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-1">Location</p>
                  <p className="text-sm text-[#FAFAFA] font-medium">{machine.zone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-1">Added</p>
                  <p className="text-sm text-[#FAFAFA] font-medium">{formatDate(machine.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-1">Status</p>
                  <span className={`text-sm font-medium ${status === 'Active' ? 'text-[#10B981]' : status === 'Under Repair' ? 'text-[#F43F5E]' : 'text-[#71717A]'}`}>{status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">

          {/* Next Maintenance Card */}
          {maintenance ? (
            <div className="bg-[#18181B] border-l-4 border-[#F59E0B] border-r border-t border-b border-r-[#3F3F46] border-t-[#3F3F46] border-b-[#3F3F46] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#F59E0B] blur-lg opacity-20"></div>
                  <Calendar className="relative w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Next Maintenance</h3>
                  <p className="text-lg font-bold text-[#FAFAFA] mb-1">{maintenance.nextDate}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md ${maintenance.daysAway <= 0 ? 'bg-[#F43F5E]/20 text-[#F43F5E]' : maintenance.daysAway <= 7 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#10B981]/20 text-[#10B981]'}`}>
                      {maintenance.daysAway <= 0 ? `${Math.abs(maintenance.daysAway)} days overdue` : `${maintenance.daysAway} days away`}
                    </span>
                    <span className="text-xs text-[#A1A1AA]">Cycle: {cycleDays} days</span>
                  </div>
                  {/* Progress Ring */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <svg className="transform -rotate-90 w-12 h-12">
                        <circle cx="24" cy="24" r="20" stroke="#27272A" strokeWidth="4" fill="none" />
                        <circle cx="24" cy="24" r="20" stroke={maintenance.daysAway <= 0 ? '#F43F5E' : '#8B5CF6'} strokeWidth="4" fill="none" strokeDasharray={`${(maintenance.elapsed / cycleDays) * 125.6} 125.6`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-[#FAFAFA]">{progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#A1A1AA]">{maintenance.elapsed} of {cycleDays} days elapsed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-[#A1A1AA] mx-auto mb-2" />
              <p className="text-sm text-[#A1A1AA]">No maintenance date recorded yet</p>
            </div>
          )}

          {/* Maintenance History */}
          <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
            <h3 className="text-base font-semibold text-[#FAFAFA] mb-4">Maintenance History</h3>
            {maintenanceLog.length === 0 ? (
              <p className="text-sm text-[#A1A1AA] text-center py-4">No maintenance records yet</p>
            ) : (
              <div className="space-y-4">
                {maintenanceLog.map((entry, index) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      {index < maintenanceLog.length - 1 && (
                        <div className="w-px flex-1 bg-[#3F3F46] my-1 min-h-[40px]" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#FAFAFA]">{formatDate(entry.date)}</span>
                        {entry.technician && (
                          <>
                            <span className="text-xs text-[#A1A1AA]">•</span>
                            <span className="text-xs text-[#A1A1AA]">{entry.technician.name}</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs bg-[#38BDF8]/20 text-[#38BDF8] px-2 py-0.5 rounded-md inline-block mb-2">{formatType(entry.maintenance_type)}</span>
                      {entry.notes && <p className="text-sm text-[#A1A1AA]">{entry.notes}</p>}
                      {entry.checklist && entry.checklist.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {entry.checklist.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {item.checked ? (
                                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-[#A1A1AA]" />
                              )}
                              <span className={`text-xs ${item.checked ? 'line-through text-[#71717A]' : 'text-[#A1A1AA]'}`}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {showEdit && (
              <button onClick={() => setEditOpen(true)} className="flex-1 h-12 bg-transparent text-[#A1A1AA] rounded-lg border border-[#3F3F46] hover:bg-[#27272A] transition-colors font-medium flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Machine
              </button>
            )}
            {showLogMaintenance && (
              <button onClick={() => setLogMaintenanceOpen(true)} className="flex-1 h-12 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium flex items-center justify-center gap-2">
                <Wrench className="w-4 h-4" />
                Log Maintenance
              </button>
            )}
          </div>

          {showLogMaintenance && (
            <LogMaintenanceModal
              open={logMaintenanceOpen}
              onOpenChange={setLogMaintenanceOpen}
              machineId={machine.id}
              projectId={projectId}
            />
          )}

          {showEdit && (
            <EditMachineModal
              open={editOpen}
              onOpenChange={setEditOpen}
              machine={machine}
              projectId={projectId}
            />
          )}
        </div>
      </div>
    </div>
  )
}
