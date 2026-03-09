import type { UserRole } from '@/shared/types/common.types'

export function canCreateProject(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canAddMachine(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canEditMachine(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canCreateWorkOrder(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canAssignWorkOrder(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canViewKanban(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canLogMaintenance(role: UserRole | null): boolean {
  return role === 'manager'
}

export function canAddTeamMember(role: UserRole | null): boolean {
  return role === 'manager'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canReportIssue(role: UserRole | null): boolean {
  return true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canUpdateOwnWOStatus(role: UserRole | null): boolean {
  return true
}
