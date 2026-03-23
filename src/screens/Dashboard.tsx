import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { ItineraryItem, Note, WeddingEvent } from '@/types'
import { formatDate, formatINR, budgetPct } from '@/lib/utils'
import toast from 'react-hot-toast'
import { uuid } from '@/lib/utils'

// ── Guest Tab (Overview) ─────────────────────────────────────────────
function GuestTab() {
  const { wedding, guests, events, clTasks, toggleTask, vendors, expenses } = useAppStore()
  if (!wedding) return null

  const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length
  const pending    = guests.filter(g => g.rsvp_status === 'pending').length
  const declined   = guests.filter(g => g.rsvp_status === 'declined').length
  const totalWithPlusOnes = guests.filter(g => g.rsvp_status === 'confirmed').reduce((a, g) => a + (g.plus_one ? 2 : 1), 0)
  const pendingTasks = clTasks.filter(t => !t.is_done).slice(0, 5)

  // Budget stats
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = wedding.total_budget
  const budgetUsedPct = budgetPct(totalSpent, totalBudget)
  const budgetColor = budgetUsedPct >= 90 ? 'var(--rose-dark)' : budgetUsedPct >= 70 ? 'var(--amber)' : 'var(--sage)'
  const budgetBarColor = budgetUsedPct >= 90 ? 'var(--rose-mid)' : budgetUsedPct >= 70 ? 'var(--amber)' : 'var(--sage)'

  // Vendor stats
  const bookedVendors    = vendors.filter(v => v.status === 'booked').length
  const contactedVendors = vendors.filter(v => v.status === 'contacted' || v.status === 'quoted').length
  const savedVendors     = vendors.filter(v => v.status === 'saved').length

  // Checklist stats
  const doneTasksCount  = clTasks.filter(t => t.is_done).length
  const totalTasksCount = clTasks.length
  const checklistPct    = totalTasksCount > 0 ? Math.round((doneTasksCount / totalTasksCount) * 100) : 0
  const checklistColor  = checklistPct >= 80 ? 'var(--sage)' : checklistPct >= 40 ? 'var(--amber)' : 'var(--rose-mid)'

  return (
    <div className="page-body">
      {/* Stat tiles — full width */}
      <div className="stat-grid" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(6, 1fr)' }}>
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
        <div className="stat-tile" style={{ background: 'var(--mauve-light)' }}>
          <div className="stat-num" style={{ color: budgetColor }}>{formatINR(totalSpent, true)}</div>
          <div className="stat-label">Budget Used</div>
        </div>
        <div className="stat-tile" style={{ background: 'var(--sage-light)' }}>
          <div className="stat-num" style={{ color: checklistPct >= 80 ? 'var(--sage)' : 'var(--ink)' }}>{doneTasksCount}/{totalTasksCount}</div>
          <div className="stat-label">Tasks Done</div>
        </div>
      </div>

      {/* Two-column: left cards | right tasks */}
      <div className="dash-overview-grid">
        <div>
          {/* Headcount info */}
          <div className="card card-sm" style={{ marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Final headcount (with +1s)</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--rose-dark)', letterSpacing: '-1px', lineHeight: 1.2 }}>{totalWithPlusOnes}</div>
            </div>
            <div style={{ height: '40px', width: '1px', background: 'var(--border)' }} />
            <div style={{ fontSize: '13px', color: 'var(--ink2)' }}>
              {formatINR(totalWithPlusOnes * 3500, true)} estimated per head cost
            </div>
          </div>

          {/* Budget Snapshot */}
          <div className="card card-sm" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Budget Snapshot</div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: budgetColor }}>{budgetUsedPct}% used</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>{formatINR(totalSpent, true)}</span>
              <span style={{ fontSize: '13px', color: 'var(--ink3)' }}>of {formatINR(totalBudget, true)}</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, budgetUsedPct)}%`, background: budgetBarColor, borderRadius: '99px', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink3)', marginTop: '8px' }}>
              {formatINR(totalBudget - totalSpent, true)} remaining
            </div>
          </div>

          {/* Vendor Pipeline */}
          <div className="card card-sm" style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '12px' }}>Vendor Pipeline</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '60px', textAlign: 'center', padding: '8px', borderRadius: '8px', background: 'var(--sage-light)' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--sage)' }}>{bookedVendors}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600 }}>Booked</div>
              </div>
              <div style={{ flex: 1, minWidth: '60px', textAlign: 'center', padding: '8px', borderRadius: '8px', background: 'var(--amber-light)' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--amber)' }}>{contactedVendors}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600 }}>In Progress</div>
              </div>
              <div style={{ flex: 1, minWidth: '60px', textAlign: 'center', padding: '8px', borderRadius: '8px', background: 'var(--bg-alt)' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink2)' }}>{savedVendors}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 600 }}>Saved</div>
              </div>
            </div>
          </div>

          {/* Event guest counts */}
          <div className="sec-head"><span className="sec-title">Guests per Event</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
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
        </div>

        {/* Quick tasks with progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="sec-title">Upcoming Tasks</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: checklistPct >= 80 ? 'var(--sage)' : 'var(--ink3)' }}>{checklistPct}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ height: '100%', width: `${checklistPct}%`, background: checklistColor, borderRadius: '99px', transition: 'width 0.4s ease' }} />
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
  )
}

// ── Itinerary Item Modal (Add & Edit) ────────────────────────────────
function ItineraryItemModal({
  item,
  defaultEventId,
  events,
  onClose,
}: {
  item: ItineraryItem | null
  defaultEventId: string
  events: WeddingEvent[]
  onClose: () => void
}) {
  const { addItineraryItem, updateItineraryItem, deleteItineraryItem } = useAppStore()
  const isNew = item === null

  const [eventId, setEventId] = useState(item?.event_id ?? defaultEventId)
  const [time, setTime] = useState(item?.time ?? '')
  const [name, setName] = useState(item?.name ?? '')
  const [note, setNote] = useState(item?.note ?? '')
  const [durationMin, setDurationMin] = useState(String(item?.duration_min || ''))
  const [isMilestone, setIsMilestone] = useState(item?.is_milestone ?? false)
  const [isDone, setIsDone] = useState(item?.is_done ?? false)

  function handleSave() {
    if (isNew) {
      addItineraryItem({
        id: uuid(),
        event_id: eventId,
        time: time.trim() || '00:00',
        name: name.trim(),
        note: note.trim(),
        duration_min: Number(durationMin) || 0,
        is_milestone: isMilestone,
        is_done: isDone,
        tags: [],
        sort_order: 999,
      })
      toast.success('Itinerary item added!')
    } else {
      updateItineraryItem(item!.id, {
        time: time.trim(),
        name: name.trim(),
        note: note.trim(),
        duration_min: Number(durationMin) || 0,
        is_milestone: isMilestone,
        is_done: isDone,
      })
    }
    onClose()
  }

  function handleDelete() {
    if (!item) return
    const snapshot = { ...item }
    deleteItineraryItem(item.id)
    onClose()
    toast((t) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>Removed "{snapshot.name}"</span>
        <button
          onClick={() => { addItineraryItem(snapshot); toast.dismiss(t.id) }}
          style={{ fontSize: '11px', fontWeight: 600, color: 'var(--rose-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 })
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">{isNew ? 'Add Itinerary Item' : 'Edit Itinerary Item'}</div>
        {isNew && (
          <div className="modal-field">
            <label className="modal-label">Event</label>
            <select className="select" value={eventId} onChange={e => setEventId(e.target.value)}>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name} · {formatDate(ev.date, 'd MMM')}</option>
              ))}
            </select>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Time</label>
            <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Duration (min)</label>
            <input className="input" type="number" min="0" placeholder="0" value={durationMin} onChange={e => setDurationMin(e.target.value)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Name *</label>
          <input className="input" placeholder="e.g. Baraat procession" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Note</label>
          <textarea className="input" rows={3} value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isMilestone} onChange={e => setIsMilestone(e.target.checked)} />
            Milestone
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isDone} onChange={e => setIsDone(e.target.checked)} />
            Done
          </label>
        </div>
        <div className="modal-footer">
          {!isNew && (
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--rose-dark)', marginRight: 'auto' }} onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!name.trim()}>
            {isNew ? 'Add Item' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Itinerary Tab ────────────────────────────────────────────────────
function ItineraryTab() {
  const { events, itinerary, updateItineraryItem } = useAppStore()
  const [activeEvent, setActiveEvent] = useState(events[2]?.id ?? events[0]?.id ?? '')
  const [editingItem, setEditingItem] = useState<ItineraryItem | null | undefined>(undefined)
  // undefined = modal closed, null = adding new, ItineraryItem = editing

  const items: ItineraryItem[] = itinerary
    .filter(i => i.event_id === activeEvent)
    .sort((a, b) => a.time.localeCompare(b.time))

  const activeEv: WeddingEvent | undefined = events.find(e => e.id === activeEvent)

  return (
    <div className="page-body">
      {/* Event selector + Add button */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {events.map(ev => (
          <button
            key={ev.id}
            className={`itinerary-event-tab${activeEvent === ev.id ? ' active' : ''}`}
            onClick={() => setActiveEvent(ev.id)}
          >
            {ev.name} · {formatDate(ev.date, 'd MMM')}
          </button>
        ))}
        <button
          className="btn btn-rose btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => setEditingItem(null)}
        >
          + Add Item
        </button>
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
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--ink3)', marginBottom: '12px' }}>No itinerary items yet for this event.</div>
            <button className="btn btn-rose btn-sm" onClick={() => setEditingItem(null)}>+ Add first item</button>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className={`itinerary-row${item.is_milestone ? ' milestone' : ''}${item.is_done ? ' done' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setEditingItem(item)}
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
              <div
                className={`task-chk${item.is_done ? ' done' : ''}`}
                style={{ flexShrink: 0, marginLeft: 'auto', alignSelf: 'center' }}
                onClick={e => { e.stopPropagation(); updateItineraryItem(item.id, { is_done: !item.is_done }) }}
              />
            </div>
          ))
        )}
      </div>

      {editingItem !== undefined && (
        <ItineraryItemModal
          item={editingItem}
          defaultEventId={activeEvent}
          events={events}
          onClose={() => setEditingItem(undefined)}
        />
      )}
    </div>
  )
}

// ── Event Edit Modal ──────────────────────────────────────────────────
function EventEditModal({ event, onClose }: { event: WeddingEvent; onClose: () => void }) {
  const { updateEvent } = useAppStore()
  const [name, setName] = useState(event.name)
  const [date, setDate] = useState(event.date)
  const [venue, setVenue] = useState(event.venue)
  const [startTime, setStartTime] = useState(event.start_time)
  const [endTime, setEndTime] = useState(event.end_time)
  const [notes, setNotes] = useState(event.notes ?? '')

  function handleSave() {
    updateEvent(event.id, {
      name: name.trim(),
      date,
      venue: venue.trim(),
      start_time: startTime,
      end_time: endTime,
      notes: notes.trim(),
    })
    onClose()
    toast.success('Event updated')
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">Edit Event</div>
        <div className="modal-field">
          <label className="modal-label">Event Name</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Date</label>
            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Venue</label>
            <input className="input" value={venue} onChange={e => setVenue(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="modal-field">
            <label className="modal-label">Start Time</label>
            <input className="input" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">End Time</label>
            <input className="input" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Notes</label>
          <textarea className="input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  )
}

// ── Details Tab ──────────────────────────────────────────────────────
function DetailsTab() {
  const { events } = useAppStore()
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null)

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
          <div
            className="card"
            key={ev.id}
            style={{ borderTop: `3px solid`, borderColor: 'var(--rose-mid)', cursor: 'pointer' }}
            onClick={() => setEditingEvent(ev)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: typeColors[ev.type] ?? 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {typeEmoji[ev.type] ?? '📅'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{ev.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink3)' }}>{formatDate(ev.date, 'EEEE, d MMMM yyyy')}</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink4)', fontWeight: 500 }}>Edit ›</div>
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
      {editingEvent && (
        <EventEditModal event={editingEvent} onClose={() => setEditingEvent(null)} />
      )}
    </div>
  )
}

// ── Note Edit Modal ────────────────────────────────────────────────────
function NoteModal({
  note,
  weddingId,
  onClose,
}: {
  note: Note | null
  weddingId: string
  onClose: () => void
}) {
  const { addNote, updateNote } = useAppStore()
  const isNew = note === null

  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [noteType, setNoteType] = useState<'general' | 'mom' | 'vendor'>(note?.type ?? 'general')

  function handleSave() {
    if (!title.trim()) return
    if (isNew) {
      addNote({
        id: uuid(),
        wedding_id: weddingId,
        title: title.trim(),
        body: body.trim(),
        type: noteType,
        vendor_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      toast.success('Note added')
    } else {
      updateNote(note!.id, {
        title: title.trim(),
        body: body.trim(),
        type: noteType,
        updated_at: new Date().toISOString(),
      })
      toast.success('Note updated')
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-title">{isNew ? 'Add Note' : 'Edit Note'}</div>
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
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-rose" onClick={handleSave} disabled={!title.trim()}>
            {isNew ? 'Save Note' : 'Update Note'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MOM Tab ──────────────────────────────────────────────────────────
function MOMTab() {
  const { wedding, notes, addNote, removeNote } = useAppStore()
  const [showModal, setShowModal] = useState<Note | null | undefined>(undefined)
  // undefined = closed, null = adding new, Note = editing
  const [filter, setFilter] = useState<'all' | 'mom' | 'general' | 'vendor'>('all')

  const filtered = notes.filter(n => filter === 'all' || n.type === filter)

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

  const typeBadge: Record<string, string> = { mom: 'badge-amber', general: 'badge-muted', vendor: 'badge-rose' }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['all', 'mom', 'general', 'vendor'] as const).map(t => (
          <button key={t} className={`filter-chip${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All' : t === 'mom' ? 'Meeting Notes' : t === 'general' ? 'General' : 'Vendor'}
          </button>
        ))}
        <button className="btn btn-rose btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowModal(null)}>
          + Add Note
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--ink3)', padding: '48px 0', fontSize: '14px' }}>No notes yet.</div>
      ) : (
        filtered.map(note => (
          <div
            className="note-card"
            key={note.id}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowModal(note)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div className="note-title">{note.title}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <span className={`badge ${typeBadge[note.type] ?? 'badge-muted'}`}>{note.type}</span>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={e => { e.stopPropagation(); handleRemoveNote(note) }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="note-body">{note.body}</div>
            <div className="note-meta">
              <span>{new Date(note.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        ))
      )}

      {showModal !== undefined && (
        <NoteModal
          note={showModal}
          weddingId={wedding?.id ?? 'w1'}
          onClose={() => setShowModal(undefined)}
        />
      )}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const { dashTab, wedding } = useAppStore()

  if (!wedding) {
    return <div style={{ padding: '40px', color: 'var(--ink3)' }}>Loading...</div>
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
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

      {dashTab === 'guest'     && <GuestTab />}
      {dashTab === 'itinerary' && <ItineraryTab />}
      {dashTab === 'details'   && <DetailsTab />}
      {dashTab === 'mom'       && <MOMTab />}
    </div>
  )
}
