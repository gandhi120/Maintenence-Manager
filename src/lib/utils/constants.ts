export const MACHINE_TYPES = [
  'Crane',
  'Excavator',
  'Generator',
  'Compressor',
  'Pump',
  'Conveyor',
] as const

export const MACHINE_STATUSES = ['active', 'inactive', 'under_repair'] as const

export const ISSUE_PRIORITIES = ['low', 'medium', 'high'] as const

export const ISSUE_STATUSES = ['open', 'assigned', 'in_progress', 'resolved'] as const

export const WORK_ORDER_STATUSES = ['open', 'assigned', 'in_progress', 'completed'] as const

export const MAINTENANCE_TYPES = ['repair', 'inspection'] as const

export const MAINTENANCE_CHECKLISTS: Record<string, string[]> = {
  repair: ['Diagnose issue', 'Replace damaged parts', 'Test functionality', 'Safety check'],
  inspection: ['Visual inspection', 'Measure readings', 'Document findings', 'Safety compliance check'],
}

export const USER_ROLES = ['owner', 'manager', 'technician'] as const

export const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#F43F5E',
} as const

export const STATUS_COLORS = {
  open: '#A1A1AA',
  assigned: '#38BDF8',
  in_progress: '#F59E0B',
  resolved: '#10B981',
  completed: '#10B981',
  active: '#10B981',
  inactive: '#A1A1AA',
  under_repair: '#F43F5E',
} as const

export const PROJECT_COLORS = [
  '#8B5CF6',
  '#F43F5E',
  '#10B981',
  '#F59E0B',
  '#38BDF8',
  '#EC4899',
  '#14B8A6',
  '#F97316',
] as const
