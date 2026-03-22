import type { CSSProperties } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  radius?: string | number
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = 16, radius = 6, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton height={14} width="60%" />
      <Skeleton height={12} width="80%" />
      <Skeleton height={12} width="45%" />
    </div>
  )
}

export function SkeletonTableRow() {
  return (
    <tr>
      {[180, 70, 80, 90, 40, 100].map((w, i) => (
        <td key={i} style={{ padding: '11px 14px' }}>
          <Skeleton height={13} width={w} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonStatGrid() {
  return (
    <div className="stat-grid">
      {['tile-rose', 'tile-sage', 'tile-amber', 'tile-pink'].map(cls => (
        <div key={cls} className={`stat-tile ${cls}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={34} width={60} radius={4} />
          <Skeleton height={12} width={80} radius={4} />
        </div>
      ))}
    </div>
  )
}
