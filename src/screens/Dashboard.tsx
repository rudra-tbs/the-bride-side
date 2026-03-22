import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { DashTab, ItineraryItem, Note, WeddingEvent } from '@/types'
import { formatDate, daysUntil, formatINR } from '@/lib/utils'
import toast from 'react-hot-toast'
import { uuid } from '@/lib/utils'

// ── Sub-component: Tab ──────────────────────────────────────────────
function TabBtn({ id, label, active, onClick }: { id: DashTab; label: string; active: boolean; onClick: (t: DashTab) => void }) {
  return (
    <button className={`tab-btn${active ? ' active' : ''}`} onClick={() => onClick(id)}>
      {label}
    </button>
  )
}

// ── Sub-component: Countdown ring ───────────────────────────────────
function Countdown({ date, coupleName, venue }: { date: string; coupleName: string; venue: string }) {
  const days = Math.max(0, daysUntil(date))
  const totalDays = 365
  const elapsed = Math.max(0, totalDays - days)
  const pct = Math.min(1, elapsed / totalDays)
  const circumference = 314
  const offset = circumference * (1 - pct)

  return (
    <div className="countdown-hero">
      <div className={`countdown-ring-wrap${days <= 30 ? ' urgent' : ''}`}>
        <svg className="countdown-svg" viewBox="0 0 108 108">
          <circle className="countdown-track" cx="54" cy="54" r="46" />
          <circle
            className="countdown-progress"
            cx="54" cy="54" r="46"
            style={{ strokeDashoffset: offset, stroke: days <= 30 ? 'var(--rose)' : days <= 90 ? 'var(--amber)' : 'var(--sage)' }}
          />
        </svg>
        <div className="countdown-centre">
          <div className="countdown-num">{days}</div>
          <div className="countdown-unit">days</div>
        </div>
      </div>
      <div className="countdown-title">{coupleName}</div>
      <div className="countdown-date">{formatDate(date, 'EEEE, d MMMM yyyy')}</div>
      <div className="countdown-stats">
        <div className="countdown-stat">
          <div className="countdown-stat-num">{Math.floor(days / 7)}</div>
          <div className="countdown-stat-lbl">Weeks Away</div>
        </div>
        <div className="countdown-stat-div" />
        <div className="countdown-stat">
          <div className="countdown-stat-num">{Math.floor(days / 30)}</div>
          <div className="countdown-stat-lbl">Months Away</div>
        </div>
        <div className="countdown-stat-div" />
        <div className="countdown-stat">
          <div className="countdown-stat-num">{days}</div>
          <div className="countdown-stat-lbl">Days Left</div>
        </div>
      </div>
      <div className="countdown-next">📍 {venue}</div>
    </div>
  )
}

// ── Guest Tab ────────────────────────────────────────────────────────
function GuestTab() {
  const { wedding, guests, events, clTasks, toggleTask } = useAppStore()
  if (!wedding) return null

  const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length
  const pending    = guests.filter(g => g.rsvp_status === 'pending').length
  const declined   = guests.filter(g => g.rsvp_status === 'declined').length
  const totalWithPlusOnes = guests.filter(g => g.rsvp_status === 'confirmed').reduce((a, g) => a + (g.plus_one ? 2 : 1), 0)

  const pendingTasks = clTasks.filter(t => !t.is_done).slice(0, 5)

  return (
    <div className="page-body">
      <div className="dash-overview-grid">
        {/* Left: Countdown */}
        <div>
          <Countdown date={wedding.wedding_date} coupleName={wedding.couple_name} venue={wedding.venue} />
        </div>

        {/* Right: Stats + tasks */}
        <div>
          {/* Stat tiles */}
          <div className="stat-grid" style={{ marginBottom: '20px' }}>
            <div className="stat-tile tile-rose">
              <div className="stat-num">{guests.length}</div>
              <div className="stat-label">Total Guests</div>
            </div>
            <div className="stat-tile tile-sage">
              <div className="stat-num">{confirmed}</div>
              <div className="stat-label">Confirmed</div>
            </div>
            <div className="stat-tile tile-amber">
              <div className="stat-num">{pending}</div>
              <div className="stat-label">Awaiting RSVP</div>
            </div>
            <div className="stat-tile tile-pink">
              <div className="stat-num">{declined}</div>
              <div className="stat-label">Declined</div>
            </div>
          </div>

          {/* Headcount info */}
          <div className="card card-sm" style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Final headcount (with +1s)</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--rose-dark)', letterSpacing: '-1px', lineHeight: 1.2 }}>{totalWithPlusOnes}</div>
            </div>
            <div style={{ height: '40px', width: '1px', background: 'var(--border)' }} />
            <div style={{ fontSize: '13px', color: 'var(--ink2)' }}>
              {formatINR(totalWithPlusOnes * 3500, true)} estimated per head cost
            </div>
          </div>

          {/* Event guest counts */}
          <div className="sec-head"><span className="sec-title">Guests per Event</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '20px' }}>
            {events.map(ev => {
              const count = guests.filter(g => g.events.includes(ev.id) && g.rsvp_status === 'confirmed').length
              return (
                <div key={ev.id} className="card card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{ev.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink3)' }}>{formatDate(ev.date, 'd MMM')}</div>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--rose-dark)' }}>{count}</div>
                </div>
              )
            })}
          </div>

          {/* Quick tasks */}
          <div className="card">
            <div className="sec-head" style={{ marginBottom: '8px' }}>
              <span className="sec-title">Upcoming Tasks</span>
            </div>
            {pendingTasks.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--ink3)', fontSize: '13px' }}>All caught up! 🎉</div>
            ) : (
              pendingTasks.map(t => (
                <div className="task-row" key={t.id}>
                  <div className={`task-chk${t.is_done ? ' done' : ''}`} onClick={() => toggleTask(t.id)} />
                  <div className="task-body">
                    <div className={`task-title${t.is_done ? ' done' : ''}`}>{t.name}</div>
                    {t.due_date && <div className="task-sub">Due {formatDate(t.due_date)}</div>}
                    {t.assigned_to && (
                      <div className="task-meta">
                        <span className="badge badge-muted">{t.assigned_to}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Itinerary Tab ────────────────────────────────────────────────────
function ItineraryTab() {
  const { events, itinerary, updateItineraryItem } = useAppStore()
  const [activeEvent, setActiveEvent] = useState(events[2]?.id ?? events[0]?.id ?? '')

  const items: ItineraryItem[] = itinerary
    .filter(i => i.event_id === activeEvent)
    .sort((a, b) => a.sort_order - b.sort_order)

  const activeEv: WeddingEvent | undefined = events.find(e => e.id === activeEvent)

  return (
    <div className="page-body">
      {/* Event selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {events.map(ev => (
          <button
            key={ev.id}
            className={`itinerary-event-tab${activeEvent === ev.id ? ' active' : ''}`}
            onClick={() => setActiveEvent(ev.id)}
          >
            {ev.name} · {formatDate(ev.date, 'd MMM')}
          </button>
        ))}
      </div>

      {activeEv && (
        <div className="card card-sm" style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: 'var(--ink3)' }}>Venue: </span>
            <strong>{activeEv.venue}</strong>
          </div>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: 'var(--ink3)' }}>Time: </span>
            <strong>{activeEv.start_time} – {activeEv.end_time}</strong>
          </div>
          {activeEv.notes && (
            <div style={{ fontSize: '12px', color: 'var(--ink2)', width: '100%' }}>{activeEv.notes}</div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {items.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ink3)' }}>No itinerary items yet for this event.</div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={`itinerary-row${item.is_milestone ? ' milestone' : ''}${item.is_done ? ' done' : ''}`}
              onClick={() => updateItineraryItem(item.id, { is_done: !item.is_done })}
            >
              <div className="itin-time-col">
                <div className="itin-time">{item.time}</div>
                {item.duration_min > 0 && (
                  <div className="itin-dur">{item.duration_min}m</div>
                )}
              </div>
              <div className="itin-rail-col">
                <div className="itin-dot" />
                {idx < items.length - 1 && <div className="itin-line" />}
              </div>
              <div className="itin-event-col">
                <div className="itin-event-name">{item.name}</div>
                {item.note && <div className="itin-event-note">{item.note}</div>}
                {item.tags.length > 0 && (
                  <div className="itin-event-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="badge badge-muted">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Details Tab ──────────────────────────────────────────────────────
function DetailsTab() {
  const { events } = useAppStore()
  const typeColors: Record<string, string> = {
    mehndi: 'var(--amber-light)', sangeet: 'var(--rose-light)',
    wedding: 'var(--mauve-light)', reception: 'var(--sage-light)', other: 'var(--border)',
  }
  const typeEmoji: Record<string, string> = {
    mehndi: '🪷', sangeet: '🎵', wedding: '💍', reception: '🥂', haldi: '🌼', other: '📅',
  }
  return (
    <div className="page-body">
      <div className="g2">
        {events.map(ev => (
          <div className="card" key={ev.id} style={{ borderTop: `3px solid`, borderColor: 'var(--rose-mid)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: typeColors[ev.type] ?? 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {typeEmoji[ev.type] ?? '📅'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{ev.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink3)' }}>{formatDate(ev.date, 'EEEE, d MMMM yyyy')}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink3)', minWidth: '56px', fontWeight: 600 }}>Venue</span>
                <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{ev.venue}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink3)', minWidth: '56px', fontWeight: 600 }}>Time</span>
                <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{ev.start_time} – {ev.end_time}</span>
              </div>
              {ev.notes && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', color: 'var(--ink3)', minWidth: '56px', fontWeight: 600 }}>Notes</span>
                  <span style={{ fontSize: '12px', color: 'var(--ink2)' }}>{ev.notes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── MOM Tab ──────────────────────────────────────────────────────────
function MOMTab() {
  const { wedding, notes, addNote, removeNote } = useAppStore()

  function handleRemoveNote(note: Note) {
    const snapshot = { ...note }
    removeNote(note.id)
    toast((t) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>Removed "{snapshot.title}"</span>
        <button
          onClick={() => { addNote(snapshot); toast.dismiss(t.id) }}
          style={{ fontSize: '11px', fontWeight: 600, color: 'var(--rose-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 })
  }
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [noteType, setNoteType] = useState<'general' | 'mom' | 'vendor'>('general')
  const [filter, setFilter] = useState<'all' | 'mom' | 'general' | 'vendor'>('all')

  const filtered = notes.filter(n => filter === 'all' || n.type === filter)

  function handleAdd() {
    if (!title.trim()) return
    addNote({
      id: uuid(),
      wedding_id: wedding?.id ?? notes[0]?.wedding_id ?? 'w1',
      title: title.trim(),
      body: body.trim(),
      type: noteType,
      vendor_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    setTitle(''); setBody(''); setNoteType('general'); setShowAdd(false)
    toast.success('Note added')
  }

  const typeBadge: Record<string, string> = { mom: 'badge-amber', general: 'badge-muted', vendor: 'badge-rose' }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['all', 'mom', 'general', 'vendor'] as const).map(t => (
          <button key={t} className={`filter-chip${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All' : t === 'mom' ? 'Meeting Notes' : t === 'general' ? 'General' : 'Vendor'}
          </button>
        ))}
        <button className="btn btn-rose btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(true)}>
          + Add Note
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--ink3)', padding: '48px 0', fontSize: '14px' }}>No notes yet.</div>
      ) : (
        filtered.map(note => (
          <div className="note-card" key={note.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div className="note-title">{note.title}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <span className={`badge ${typeBadge[note.type] ?? 'badge-muted'}`}>{note.type}</span>
                <button className="btn btn-xs btn-ghost" onClick={() => handleRemoveNote(note)}>✕</button>
              </div>
            </div>
            <div className="note-body">{note.body}</div>
            <div className="note-meta">
              <span>{new Date(note.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        ))
      )}

      {showAdd && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}>
          <div className="modal-box">
            <div className="modal-title">Add Note</div>
            <div className="modal-field">
              <label className="modal-label">Type</label>
              <select className="select" value={noteType} onChange={e => setNoteType(e.target.value as typeof noteType)}>
                <option value="general">General</option>
                <option value="mom">Meeting Notes (MOM)</option>
                <option value="vendor">Vendor Note</option>
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Title</label>
              <input className="input" placeholder="Note title..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Body</label>
              <textarea className="input" rows={5} placeholder="Write your note..." value={body} onChange={e => setBody(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-rose" onClick={handleAdd} disabled={!title.trim()}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const { dashTab, setDashTab, wedding } = useAppStore()

  if (!wedding) {
    return <div style={{ padding: '40px', color: 'var(--ink3)' }}>Loading...</div>
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="dash-sticky-header">
        <div className="page-head">
          <div>
            <div className="page-title">
              <em>{wedding.couple_name}</em>
            </div>
            <div className="page-date">{formatDate(wedding.wedding_date, 'EEEE, d MMMM yyyy')} · {wedding.venue}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            navigator.clipboard.writeText(window.location.href).then(
              () => toast.success('Link copied to clipboard!'),
              () => toast('Share: ' + window.location.href),
            )
          }}>
            Share Dashboard
          </button>
        </div>

        <div className="tab-nav">
          <TabBtn id="guest"     label="Overview"    active={dashTab === 'guest'}     onClick={setDashTab} />
          <TabBtn id="itinerary" label="Itinerary"   active={dashTab === 'itinerary'} onClick={setDashTab} />
          <TabBtn id="details"   label="Event Details" active={dashTab === 'details'} onClick={setDashTab} />
          <TabBtn id="mom"       label="Meeting Notes" active={dashTab === 'mom'}     onClick={setDashTab} />
        </div>
      </div>

      {dashTab === 'guest'     && <GuestTab />}
      {dashTab === 'itinerary' && <ItineraryTab />}
      {dashTab === 'details'   && <DetailsTab />}
      {dashTab === 'mom'       && <MOMTab />}
    </div>
  )
}
