import { formatDistanceToNow, differenceInDays, format, isValid, parseISO } from 'date-fns'

export function timeAgo(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

export function daysUntil(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return null
  return differenceInDays(d, new Date())
}

export function formatDate(date: string | Date, fmt: string = 'MMM d, yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return format(d, fmt)
}

export function maintenanceProgress(lastDate: string | null, cycleDays: number): number {
  if (!lastDate) return 0
  const last = parseISO(lastDate)
  if (!isValid(last)) return 0
  const elapsed = differenceInDays(new Date(), last)
  return Math.min(Math.round((elapsed / cycleDays) * 100), 100)
}
