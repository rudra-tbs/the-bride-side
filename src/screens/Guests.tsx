import { useState } from 'react'
import { useAppStore } from '@/store/app'
import EmptyState from '@/components/ui/EmptyState'
import type { Guest, GuestSide, RSVPStatus, DietaryPref } from '@/types'
import { initials, uuid } from '@/lib/utils'
import toast from 'react-hot-toast'

type Filter = 'all' | 'bride' | 'groom' | 'confirmed' | 'pending' | 'declined'

const RSVP_BADGE: Record<RSVPStatus, string> = {
  confirmed: 'badge-sage', pending: 'badge-amber', declined: 'badge-declined',
}

// ── Guest Form Modal (Add & Edit) ────────────────────────────────────
function GuestModal({
  guest,
  weddingId,
  onClose,
}: {
  guest: Guest | null
  weddingId: string
  onClose: () => void
}) {
  const { addGuest, updateGuest } = useAppStore()
  const isNew = guest === null

  const [name, setName] = useState(guest?.name ?? '')
  const [phone, setPhone] = useState(guest?.phone ?? '')
  const [email, setEmail] = useState(guest?.email ?? '')
  const [side, setSide] = useState<GuestSide>(guest?.side ?? 'bride')
  const [rsvp, setRsvp] = useState<RSVPStatus>(guest?.rsvp_status ?? 'pending')
  const [dietary, setDietary] = useState<DietaryPref>(guest?.dietary ?? 'no-preference')
  const [plusOne, setPlusOne] = useState(guest?.plus_one ?? false)
  const [notes, setNotes] = useState(guest?.notes ?? '')

  function handleSave() {
    if (!name.trim()) return
    if (isNew) {
      addGuest({
        id: uuid(),
        wedding_id: weddingId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        side, rsvp_status: rsvp, dietary,
        events: [],
        plus_one: plusOne,
        notes: notes.trim(),
        created_at: new Date().toISOString(),
      })
      toast.success('Guest added!')
    } else {
      updateGuest(guest!.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        side, rsvp_status: rsvp, dietary,
        plus_one: plusOne,
        notes: notes.trim(),
      })
      toast.success('Guest updated')
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">{isNew ? 'Add Guest' : 'Edit Guest'}</div>
        <div className="modal-field">
          <label className="modal-label">Full Name *</label>
          <input className="input" placeholder="e.g. Ananya Kapoor" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Phone</label>
            <input className="input" placeholder="+91 9XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Email</label>
            <input className="input" type="email" placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Side</label>
            <select className="select" value={side} onChange={e => setSide(e.target.value as GuestSide)}>
              <option value="bride">Bride's</option>
              <option value="groom">Groom's</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-label">RSVP</label>
            <select className="select" value={rsvp} onChange={e => setRsvp(e.target.value as RSVPStatus)}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Dietary Preference</label>
          <select className="select" value={dietary} onChange={e => setDietary(e.target.value as DietaryPref)}>
            <option value="no-preference">No preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-veg">Non-veg</option>
            <option value="vegan">Vegan</option>
            <option value="jain">Jain</option>
          </select>
        </div>
        <div className="modal-field">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink2)' }}>
            <input type="checkbox" checked={plusOne} onChange={e => setPlusOne(e.target.checked)} />
            Bringing a +1
          </label>
        </div>
        <div className="modal-field">
          <label className="modal-label">Notes (optional)</label>
          <input className="input" placeholder="e.g. BFF / Bridesmaid" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!name.trim()}>
            {isNew ? 'Add Guest' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Guests Screen ────────────────────────────────────────────────────
export default function Guests() {
  const { wedding, guests, addGuest, removeGuest } = useAppStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [guestModal, setGuestModal] = useState<Guest | null | undefined>(undefined)
  // undefined = closed, null = adding new, Guest = editing

  const filtered = guests.filter(g => {
    if (filter === 'bride' || filter === 'groom') { if (g.side !== filter) return false }
    if (filter === 'confirmed' || filter === 'pending' || filter === 'declined') { if (g.rsvp_status !== filter) return false }
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.phone.includes(search)) return false
    return true
  })

  const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length
  const pending = guests.filter(g => g.rsvp_status === 'pending').length
  const declined = guests.filter(g => g.rsvp_status === 'declined').length

  function handleRemoveGuest(g: Guest) {
    const snapshot = { ...g }
    removeGuest(g.id)
    toast((t) => (
      <div className="flex-center gap-10">
        <span>Removed {snapshot.name}</span>
        <button
          onClick={() => { addGuest(snapshot); toast.dismiss(t.id) }}
          style={{ fontSize: '11px', fontWeight: 600, color: 'var(--rose-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 })
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: `All (${guests.length})` },
    { value: 'confirmed', label: `Confirmed (${confirmed})` },
    { value: 'pending', label: `Pending (${pending})` },
    { value: 'declined', label: `Declined (${declined})` },
    { value: 'bride', label: "Bride's Side" },
    { value: 'groom', label: "Groom's Side" },
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Guests</div>
          <div className="page-date">{guests.length} total · {confirmed} confirmed · {pending} pending</div>
        </div>
        <button className="btn btn-rose btn-sm" onClick={() => setGuestModal(null)}>+ Add Guest</button>
      </div>

      {/* Filters + search */}
      <div style={{ padding: '12px 28px 0', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button key={f.value} className={`filter-chip${filter === f.value ? ' active' : ''}`} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
        <input
          className="input"
          style={{ marginLeft: 'auto', width: 'min(200px, 100%)', padding: '6px 12px' }}
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: '540px' }}>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Side</th>
                <th>RSVP</th>
                <th>Dietary</th>
                <th>+1</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon="💌"
                      title={search ? 'No guests match' : 'No guests yet'}
                      subtitle={search ? 'Try a different name or phone number.' : 'Start building your guest list — add family and friends one by one.'}
                      action={!search ? { label: '+ Add first guest', onClick: () => setGuestModal(null) } : undefined}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map(g => (
                  <tr
                    key={g.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setGuestModal(g)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--rose-mid), var(--mauve-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {initials(g.name)}
                        </div>
                        <div>
                          <div className="tbl-name">{g.name}</div>
                          {g.notes && <div className="tbl-sub">{g.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${g.side === 'bride' ? 'badge-rose' : 'badge-sky'}`}>{g.side}</span></td>
                    <td><span className={`badge ${RSVP_BADGE[g.rsvp_status]}`}>{g.rsvp_status}</span></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--ink2)' }}>{g.dietary.replace('-', ' ')}</span></td>
                    <td><span style={{ color: g.plus_one ? 'var(--sage)' : 'var(--ink4)', fontSize: '13px' }}>{g.plus_one ? '✓' : '–'}</span></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--ink3)' }}>{g.phone || '–'}</span></td>
                    <td>
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={e => { e.stopPropagation(); handleRemoveGuest(g) }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {guestModal !== undefined && (
        <GuestModal
          guest={guestModal}
          weddingId={wedding?.id ?? 'w1'}
          onClose={() => setGuestModal(undefined)}
        />
      )}
    </div>
  )
}
