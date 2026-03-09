export type Priority = 'low' | 'medium' | 'high'
export type IssueStatus = 'open' | 'assigned' | 'in_progress' | 'resolved'
export type WorkOrderStatus = 'open' | 'assigned' | 'in_progress' | 'completed'
export type MachineStatus = 'active' | 'inactive' | 'under_repair'
export type MaintenanceType = 'routine' | 'oil_change' | 'repair' | 'inspection' | 'custom'
export type UserRole = 'owner' | 'manager' | 'technician'

export interface Project {
  id: string
  name: string
  location: string
  description: string | null
  color: string
  owner_id: string
  created_at: string
  open_issue_count?: number
}

export interface Machine {
  id: string
  project_id: string
  name: string
  type: string
  serial_number: string | null
  image_url: string | null
  last_maintenance_date: string | null
  maintenance_cycle_days: number
  next_maintenance_date: string | null
  zone: string | null
  status: MachineStatus
  created_at: string
}

export interface Issue {
  id: string
  project_id: string
  machine_id: string
  title: string
  description: string | null
  priority: Priority
  status: IssueStatus
  image_urls: string[]
  reported_by: string | null
  created_at: string
  resolved_at: string | null
  machine?: Machine
  project?: Project
}

export interface WorkOrder {
  id: string
  issue_id: string
  project_id: string
  assigned_to: string | null
  status: WorkOrderStatus
  estimated_completion: string | null
  actual_completion: string | null
  notes: string | null
  created_at: string
  issue?: Issue
  assignee?: { id: string; name: string; avatar_url: string | null }
}

export interface MaintenanceLog {
  id: string
  machine_id: string
  project_id: string
  maintenance_type: MaintenanceType
  date: string
  technician_id: string | null
  notes: string | null
  created_at: string
  technician?: { id: string; name: string }
}

export interface TeamMember {
  id: string
  project_id: string
  user_id: string
  role: 'manager' | 'technician'
  added_at: string
  user?: { id: string; name: string; mobile_number: string; avatar_url: string | null }
}

export interface ActivityLog {
  id: string
  project_id: string | null
  issue_id: string | null
  work_order_id: string | null
  actor_id: string | null
  action: string
  description: string
  created_at: string
  actor?: { id: string; name: string; avatar_url: string | null }
  project?: { id: string; name: string; color: string }
}

export interface Notification {
  id: string
  type: string
  title: string
  description: string
  read: boolean
  created_at: string
  project_id?: string
  issue_id?: string
  work_order_id?: string
}
