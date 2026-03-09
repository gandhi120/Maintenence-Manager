import { LayoutDashboard, FolderKanban, User } from 'lucide-react'

export const mainNavItems = [
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
] as const

export const projectTabs = [
  { label: 'Machines', value: 'machines' },
  { label: 'Issues', value: 'issues' },
  { label: 'Work Orders', value: 'work-orders' },
] as const
