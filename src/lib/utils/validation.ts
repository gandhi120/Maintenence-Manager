import { z } from 'zod'

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number')

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  location: z.string().min(1, 'Location is required').max(200),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export const machineSchema = z.object({
  name: z.string().min(1, 'Machine name is required').max(100),
  type: z.string().min(1, 'Machine type is required'),
  serial_number: z.string().max(100).optional(),
  last_maintenance_date: z.string().optional(),
  maintenance_cycle_days: z.number().min(1).max(365),
  zone: z.string().max(200).optional(),
  status: z.enum(['active', 'inactive', 'under_repair']),
})

export const issueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  machine_id: z.string().min(1, 'Select a machine'),
})

export const workOrderSchema = z.object({
  assigned_to: z.string().uuid('Select a technician').optional(),
  estimated_completion: z.string().optional(),
  notes: z.string().max(2000).optional(),
})

export const maintenanceLogSchema = z.object({
  maintenance_type: z.enum(['repair', 'inspection']),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(1000).optional(),
})

export const checklistItemSchema = z.object({
  label: z.string().min(1).max(200),
  checked: z.boolean(),
})
export type ChecklistItem = z.infer<typeof checklistItemSchema>
