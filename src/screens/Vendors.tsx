import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { Vendor, VendorCategory, VendorStatus } from '@/types'
import { formatINR, uuid } from '@/lib/utils'
import { dbInsertVendor, dbUpdateVendor, dbDeleteVendor } from '@/lib/supabase'
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

const ALL_CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'decor',       label: 'Decor' },
  { value: 'catering',    label: 'Catering' },
  { value: 'mua',         label: 'Makeup (MUA)' },
  { value: 'dj',          label: 'DJ / Music' },
  { value: 'mehendi',     label: 'Mehendi' },
  { value: 'venue',       label: 'Venue' },
  { value: 'invitation',  label: 'Invitation' },
  { value: 'transport',   label: 'Transport' },
  { value: 'other',       label: 'Other' },
]

const ALL_STATUSES: { value: VendorStatus; label: string }[] = [
  { value: 'saved',     label: 'Saved' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted',    label: 'Quoted' },
  { value: 'booked',    label: 'Booked' },
  { value: 'rejected',  label: 'Rejected' },
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

// ── Blank form state ─────────────────────────────────────────────────────────
function blankForm() {
  return {
    name: '', category: 'photography' as VendorCategory, city: '', status: 'saved' as VendorStatus,
    contact_name: '', contact_phone: '', contact_email: '',
    price_from: '', price_to: '', notes: '',
  }
}

// ── Add / Edit form modal ────────────────────────────────────────────────────
function VendorFormModal({ initial, onSave, onClose }: {
  initial: ReturnType<typeof blankForm>
  onSave: (data: ReturnType<typeof blankForm>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="modal-title">{initial.name ? 'Edit Vendor' : 'Add Vendor'}</div>

        <div className="modal-field">
          <label className="modal-label">Vendor name *</label>
          <input className="input" placeholder="e.g. Ravi Sharma Photography" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Category</label>
            <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
              {ALL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-label">Status</label>
            <select className="select" value={form.status} onChange={e => set('status', e.target.value)}>
              {ALL_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">City</label>
          <input className="input" placeholder="e.g. Mumbai" value={form.city} onChange={e => set('city', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Price from (₹)</label>
            <input className="input" type="number" placeholder="50000" value={form.price_from} onChange={e => set('price_from', e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Price to (₹)</label>
            <input className="input" type="number" placeholder="150000" value={form.price_to} onChange={e => set('price_to', e.target.value)} />
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">Contact name</label>
          <input className="input" placeholder="e.g. Ravi Sharma" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Phone</label>
            <input className="input" type="tel" placeholder="+91 98765 43210" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Email</label>
            <input className="input" type="email" placeholder="vendor@email.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">Notes</label>
          <textarea className="input" rows={3} placeholder="Any notes about this vendor..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={() => onSave(form)} disabled={!form.name.trim()}>
            {initial.name ? 'Save Changes' : 'Add Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Vendor detail overlay ────────────────────────────────────────────────────
function VendorOverlay({ vendor, onClose, onToggleShortlist, onEdit, onDelete }: {
  vendor: Vendor
  onClose: () => void
  onToggleShortlist: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  function handleContact(type: 'phone' | 'email') {
    if (type === 'phone' && vendor.contact_phone) {
      window.open(`tel:${vendor.contact_phone}`)
    } else if (type === 'email' && vendor.contact_email) {
      window.open(`mailto:${vendor.contact_email}?subject=Wedding Enquiry — ${vendor.name}`)
    }
  }

  return (
    <div className="overlay-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="overlay-sheet">
        <div className="overlay-handle" />
        <div style={{ padding: '20px 24px 32px', position: 'relative' }}>
          <button className="ol-close" onClick={onClose}>✕</button>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
              {CAT_EMOJI[vendor.category] ?? '⭐'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{vendor.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink3)', marginTop: '3px' }}>{vendor.city} · {vendor.category}</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`badge ${STATUS_BADGE[vendor.status] ?? 'badge-muted'}`}>{STATUS_LABEL[vendor.status]}</span>
                {vendor.rating > 0 && <>
                  {'⭐'.repeat(Math.round(vendor.rating))}
                  <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>{vendor.rating} ({vendor.reviews_count})</span>
                </>}
              </div>
            </div>
          </div>

          {(vendor.price_from > 0 || vendor.booked_amount > 0) && (
            <div className="card card-sm" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {vendor.price_from > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase' }}>Price Range</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--rose-dark)', marginTop: '3px' }}>
                      {formatINR(vendor.price_from, true)} – {formatINR(vendor.price_to, true)}
                    </div>
                  </div>
                )}
                {vendor.booked_amount > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase' }}>Booked Amount</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginTop: '3px' }}>{formatINR(vendor.booked_amount)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {vendor.notes && (
            <div className="card card-sm" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Notes</div>
              <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6 }}>{vendor.notes}</div>
            </div>
          )}

          {vendor.contact_name && (
            <div className="card card-sm" style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Contact</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>{vendor.contact_name}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {vendor.contact_phone && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleContact('phone')}>
                    📞 {vendor.contact_phone}
                  </button>
                )}
                {vendor.contact_email && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleContact('email')}>
                    ✉️ {vendor.contact_email}
                  </button>
                )}
              </div>
            </div>
          )}

          {vendor.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {vendor.tags.map(tag => (
                <span key={tag} className="badge badge-muted">{tag}</span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`btn${vendor.is_shortlisted ? ' btn-rose' : ' btn-ghost'} btn-sm`}
              style={{ flex: 1 }}
              onClick={onToggleShortlist}
            >
              {vendor.is_shortlisted ? '♥ Shortlisted' : '♡ Shortlist'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>✏️ Edit</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--rose-dark)' }} onClick={onDelete}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function Vendors() {
  const { wedding, vendors, addVendor, updateVendor, removeVendor } = useAppStore()
  const [catFilter, setCatFilter] = useState<VendorCategory | 'all'>('all')
  const [onlyShortlisted, setOnlyShortlisted] = useState(false)
  const [selected, setSelected] = useState<Vendor | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  const filtered = vendors.filter(v => {
    if (catFilter !== 'all' && v.category !== catFilter) return false
    if (onlyShortlisted && !v.is_shortlisted) return false
    return true
  })

  const booked = vendors.filter(v => v.status === 'booked').length
  const shortlisted = vendors.filter(v => v.is_shortlisted).length

  function toggleShortlist(id: string, current: boolean) {
    updateVendor(id, { is_shortlisted: !current })
    dbUpdateVendor(id, { is_shortlisted: !current }).catch(() => null)
    toast.success(current ? 'Removed from shortlist' : 'Added to shortlist')
  }

  async function handleAdd(form: ReturnType<typeof blankForm>) {
    const newVendor: Vendor = {
      id: uuid(),
      wedding_id: wedding?.id ?? 'w1',
      name: form.name.trim(),
      category: form.category,
      city: form.city.trim(),
      status: form.status,
      rating: 0, reviews_count: 0,
      price_from: Number(form.price_from) || 0,
      price_to: Number(form.price_to) || 0,
      tags: [],
      notes: form.notes.trim(),
      contact_name: form.contact_name.trim(),
      contact_phone: form.contact_phone.trim(),
      contact_email: form.contact_email.trim(),
      booked_amount: 0, paid_amount: 0,
      is_shortlisted: false,
      created_at: new Date().toISOString(),
    }
    addVendor(newVendor)
    setShowAdd(false)
    toast.success('Vendor added!')
    dbInsertVendor({
      wedding_id: newVendor.wedding_id, name: newVendor.name, category: newVendor.category,
      city: newVendor.city, status: newVendor.status, rating: 0, reviews_count: 0,
      price_from: newVendor.price_from, price_to: newVendor.price_to, tags: [],
      notes: newVendor.notes, contact_name: newVendor.contact_name,
      contact_phone: newVendor.contact_phone, contact_email: newVendor.contact_email,
      booked_amount: 0, paid_amount: 0, is_shortlisted: false,
    }).catch(() => null)
  }

  async function handleEdit(form: ReturnType<typeof blankForm>) {
    if (!editingVendor) return
    const patch = {
      name: form.name.trim(), category: form.category, city: form.city.trim(),
      status: form.status, price_from: Number(form.price_from) || 0,
      price_to: Number(form.price_to) || 0, notes: form.notes.trim(),
      contact_name: form.contact_name.trim(), contact_phone: form.contact_phone.trim(),
      contact_email: form.contact_email.trim(),
    }
    updateVendor(editingVendor.id, patch)
    if (selected?.id === editingVendor.id) setSelected(v => v ? { ...v, ...patch } : v)
    setEditingVendor(null)
    toast.success('Vendor updated!')
    dbUpdateVendor(editingVendor.id, patch).catch(() => null)
  }

  async function handleDelete(id: string) {
    removeVendor(id)
    setSelected(null)
    toast.success('Vendor removed')
    dbDeleteVendor(id).catch(() => null)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Vendors</div>
          <div className="page-date">{vendors.length} vendors · {booked} booked · {shortlisted} shortlisted</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => setShowAdd(true)}>
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
          <div style={{ textAlign: 'center', color: 'var(--ink3)', padding: '48px 0' }}>
            {vendors.length === 0 ? 'No vendors yet — add your first vendor above.' : 'No vendors match your filter.'}
          </div>
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
                  <div className="v-meta">{v.city}{v.city && v.category ? ' · ' : ''}{v.category}</div>
                  {v.price_from > 0 && (
                    <div className="v-price">{formatINR(v.price_from, true)} – {formatINR(v.price_to, true)}</div>
                  )}
                  {v.rating > 0 && <div className="v-rating">⭐ {v.rating} ({v.reviews_count} reviews)</div>}
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

      {selected && !editingVendor && (
        <VendorOverlay
          vendor={selected}
          onClose={() => setSelected(null)}
          onToggleShortlist={() => {
            toggleShortlist(selected.id, selected.is_shortlisted)
            setSelected(v => v ? { ...v, is_shortlisted: !v.is_shortlisted } : v)
          }}
          onEdit={() => setEditingVendor(selected)}
          onDelete={() => handleDelete(selected.id)}
        />
      )}

      {showAdd && (
        <VendorFormModal
          initial={blankForm()}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editingVendor && (
        <VendorFormModal
          initial={{
            name: editingVendor.name,
            category: editingVendor.category,
            city: editingVendor.city,
            status: editingVendor.status,
            contact_name: editingVendor.contact_name,
            contact_phone: editingVendor.contact_phone,
            contact_email: editingVendor.contact_email,
            price_from: editingVendor.price_from ? String(editingVendor.price_from) : '',
            price_to: editingVendor.price_to ? String(editingVendor.price_to) : '',
            notes: editingVendor.notes,
          }}
          onSave={handleEdit}
          onClose={() => setEditingVendor(null)}
        />
      )}
    </div>
  )
}
