import { LayoutDashboard, FolderKanban, User, ClipboardList } from 'lucide-react'
import type { UserRole } from '@/shared/types/common.types'

export type NavItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

const managerNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
]

const technicianNavItems: NavItem[] = [
  {
    label: 'My Tasks',
    href: '/dashboard',
    icon: ClipboardList,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function getNavItems(role: UserRole | null): NavItem[] {
  if (role === 'technician') return technicianNavItems
  return managerNavItems
}

export const projectTabs = [
  { label: 'Machines', value: 'machines' },
  { label: 'Issues', value: 'issues' },
  { label: 'Work Orders', value: 'work-orders' },
] as const
