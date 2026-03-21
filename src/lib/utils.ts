import { format, formatDistanceToNow, differenceInDays } from 'date-fns'

// ── CURRENCY ─────────────────────────────────────────────────────────────────
export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10_00_000) return `₹${(amount / 10_00_000).toFixed(1)}Cr`
    if (amount >= 1_00_000)  return `₹${(amount / 1_00_000).toFixed(1)}L`
    if (amount >= 1_000)     return `₹${(amount / 1_000).toFixed(0)}K`
    return `₹${amount}`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── DATES ────────────────────────────────────────────────────────────────────
export function daysUntil(dateStr: string): number {
  return differenceInDays(new Date(dateStr), new Date())
}

export function formatDate(dateStr: string, fmt = 'd MMM yyyy'): string {
  return format(new Date(dateStr), fmt)
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

// ── STRINGS ──────────────────────────────────────────────────────────────────
export function initials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ── ARRAYS ───────────────────────────────────────────────────────────────────
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key])
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

// ── BUDGET ───────────────────────────────────────────────────────────────────
export function budgetPct(spent: number, total: number): number {
  if (!total) return 0
  return Math.min(100, Math.round((spent / total) * 100))
}

// ── GENERATE UUID (browser-safe) ─────────────────────────────────────────────
export function uuid(): string {
  return crypto.randomUUID()
}
