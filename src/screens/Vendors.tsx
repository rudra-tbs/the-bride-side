import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { Vendor, VendorCategory } from '@/types'
import { formatINR } from '@/lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES: { value: VendorCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all',         label: 'All',          emoji: '✨' },
  { value: 'photography', label: 'Photography',  emoji: '📷' },
  { value: 'videography', label: 'Video',        emoji: '🎥' },
  { value: 'decor',       label: 'Decor',        emoji: '🌸' },
  { value: 'catering',    label: 'Catering',     emoji: '🍽️' },
  { value: 'mua',         label: 'Makeup',       emoji: '💄' },
  { value: 'dj',          label: 'DJ / Music',   emoji: '🎵' },
  { value: 'mehendi',     label: 'Mehendi',      emoji: '🪷' },
  { value: 'venue',       label: 'Venue',        emoji: '🏛️' },
]

const STATUS_BADGE: Record<string, string> = {
  booked: 'badge-sage', contacted: 'badge-sky', quoted: 'badge-amber',
  saved: 'badge-muted', rejected: 'badge-declined',
}

const STATUS_LABEL: Record<string, string> = {
  booked: 'Booked', contacted: 'Contacted', quoted: 'Quoted', saved: 'Saved', rejected: 'Rejected',
}

const CAT_EMOJI: Record<string, string> = {
  photography: '📷', videography: '🎥', decor: '🌸', catering: '🍽️', mua: '💄',
  dj: '🎵', mehendi: '🪷', venue: '🏛️', invitation: '✉️', transport: '🚗', other: '⭐',
}

function VendorOverlay({ vendor, onClose, onToggleShortlist }: {
  vendor: Vendor
  onClose: () => void
  onToggleShortlist: () => void
}) {
  return (
    <div className="overlay-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="overlay-sheet">
        <div className="overlay-handle" />
        <div style={{ padding: '20px 24px 32px', position: 'relative' }}>
          <button className="ol-close" onClick={onClose} style={{ position: 'absolute', top: '12px', right: '16px' }}>✕</button>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
              {CAT_EMOJI[vendor.category] ?? '⭐'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{vendor.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink3)', marginTop: '3px' }}>{vendor.city} · {vendor.category}</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`badge ${STATUS_BADGE[vendor.status] ?? 'badge-muted'}`}>{STATUS_LABEL[vendor.status]}</span>
                {'⭐'.repeat(Math.round(vendor.rating))}
                <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>{vendor.rating} ({vendor.reviews_count})</span>
              </div>
            </div>
          </div>

          <div className="card card-sm" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase' }}>Price Range</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--rose-dark)', marginTop: '3px' }}>
                  {formatINR(vendor.price_from, true)} – {formatINR(vendor.price_to, true)}
                </div>
              </div>
              {vendor.booked_amount > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase' }}>Booked Amount</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginTop: '3px' }}>{formatINR(vendor.booked_amount)}</div>
                </div>
              )}
            </div>
          </div>

          {vendor.notes && (
            <div className="card card-sm" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Notes</div>
              <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6 }}>{vendor.notes}</div>
            </div>
          )}

          {vendor.contact_name && (
            <div className="card card-sm" style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Contact</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{vendor.contact_name}</div>
              {vendor.contact_phone && <div style={{ fontSize: '13px', color: 'var(--ink2)' }}>{vendor.contact_phone}</div>}
              {vendor.contact_email && <div style={{ fontSize: '13px', color: 'var(--rose)' }}>{vendor.contact_email}</div>}
            </div>
          )}

          {vendor.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {vendor.tags.map(tag => (
                <span key={tag} className="badge badge-muted">{tag}</span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn${vendor.is_shortlisted ? ' btn-rose' : ' btn-ghost'} btn-sm`}
              style={{ flex: 1 }}
              onClick={onToggleShortlist}
            >
              {vendor.is_shortlisted ? '♥ Shortlisted' : '♡ Add to Shortlist'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { toast('Contact feature coming soon!'); onClose() }}>
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Vendors() {
  const { vendors, updateVendor } = useAppStore()
  const [catFilter, setCatFilter] = useState<VendorCategory | 'all'>('all')
  const [onlyShortlisted, setOnlyShortlisted] = useState(false)
  const [selected, setSelected] = useState<Vendor | null>(null)

  const filtered = vendors.filter(v => {
    if (catFilter !== 'all' && v.category !== catFilter) return false
    if (onlyShortlisted && !v.is_shortlisted) return false
    return true
  })

  const booked = vendors.filter(v => v.status === 'booked').length
  const shortlisted = vendors.filter(v => v.is_shortlisted).length

  function toggleShortlist(id: string, current: boolean) {
    updateVendor(id, { is_shortlisted: !current })
    toast.success(current ? 'Removed from shortlist' : 'Added to shortlist')
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Vendors</div>
          <div className="page-date">{vendors.length} vendors · {booked} booked · {shortlisted} shortlisted</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => toast('Add vendor — coming soon!')}>
          + Add Vendor
        </button>
      </div>

      <div style={{ padding: '12px 28px 0', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            className={`filter-chip${catFilter === c.value ? ' active' : ''}`}
            onClick={() => setCatFilter(c.value)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
        <button
          className={`filter-chip${onlyShortlisted ? ' active' : ''}`}
          style={{ marginLeft: 'auto' }}
          onClick={() => setOnlyShortlisted(s => !s)}
        >
          ♥ Shortlisted
        </button>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink3)', padding: '48px 0' }}>No vendors match your filter.</div>
        ) : (
          <div className="g4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {filtered.map(v => (
              <div className="v-card" key={v.id} onClick={() => setSelected(v)}>
                <div className="v-img" style={{ background: v.is_shortlisted ? 'var(--rose-light)' : 'var(--surface2)' }}>
                  <span style={{ fontSize: '44px' }}>{CAT_EMOJI[v.category] ?? '⭐'}</span>
                  <button
                    className={`v-save${v.is_shortlisted ? ' saved' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleShortlist(v.id, v.is_shortlisted) }}
                  >
                    {v.is_shortlisted ? '♥' : '♡'}
                  </button>
                </div>
                <div className="v-body">
                  <div className="v-name">{v.name}</div>
                  <div className="v-meta">{v.city} · {v.category}</div>
                  <div className="v-price">{formatINR(v.price_from, true)} – {formatINR(v.price_to, true)}</div>
                  <div className="v-rating">⭐ {v.rating} ({v.reviews_count} reviews)</div>
                </div>
                <div className="v-foot">
                  <span className={`badge ${STATUS_BADGE[v.status] ?? 'badge-muted'}`}>{STATUS_LABEL[v.status]}</span>
                  {v.tags.slice(0, 1).map(t => (
                    <span key={t} className="badge badge-muted">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <VendorOverlay
          vendor={selected}
          onClose={() => setSelected(null)}
          onToggleShortlist={() => {
            toggleShortlist(selected.id, selected.is_shortlisted)
            setSelected(v => v ? { ...v, is_shortlisted: !v.is_shortlisted } : v)
          }}
        />
      )}
    </div>
  )
}
