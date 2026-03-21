import { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { Role } from '@/types'
import { uuid } from '@/lib/utils'
import { dbSaveWedding } from '@/lib/supabase'
import {
  mockEvents, mockItinerary, mockGuests, mockVendors,
  mockBudgetCategories, mockExpenses, mockClCategories,
  mockClTasks, mockPins, mockNotes,
} from '@/mock/data'

const ROLES: { value: Role; label: string; emoji: string; sub: string }[] = [
  { value: 'bride',   label: 'Bride',   emoji: '👰', sub: 'Planning my wedding' },
  { value: 'groom',   label: 'Groom',   emoji: '🤵', sub: 'Getting married soon' },
  { value: 'planner', label: 'Planner', emoji: '📋', sub: 'Planning for others' },
  { value: 'other',   label: 'Family',  emoji: '💝', sub: 'Helping a loved one' },
]

const BUDGETS = [
  { label: 'Under ₹5L',    value: 500000 },
  { label: '₹5L – ₹15L',  value: 1000000 },
  { label: '₹15L – ₹30L', value: 2000000 },
  { label: '₹30L – ₹1Cr', value: 5000000 },
  { label: '₹1Cr+',        value: 10000000 },
]

const VIBES = [
  'Romantic', 'Floral', 'Elegant', 'Traditional',
  'Modern', 'Minimal', 'Bohemian', 'Vintage', 'Grand', 'Intimate',
]

export default function Onboarding() {
  const {
    setScreen, setUserId, setWedding, setEvents, setItinerary,
    setGuests, setVendors, setBudgetCategories, setExpenses,
    setClCategories, setClTasks, setPins, setNotes,
  } = useAppStore()

  const [step, setStep]               = useState(0)
  const [role, setRole]               = useState<Role | null>(null)
  const [selfName, setSelfName]       = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [venue, setVenue]             = useState('')
  const [city, setCity]               = useState('')
  const [budget, setBudget]           = useState(0)
  const [vibes, setVibes]             = useState<string[]>([])

  function toggleVibe(v: string) {
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  function finish() {
    const currentUserId = useAppStore.getState().userId ?? uuid()
    const coupleName = selfName && partnerName
      ? `${selfName} & ${partnerName}`
      : selfName || 'The Happy Couple'

    const wedding = {
      id: uuid(),
      user_id: currentUserId,
      couple_name: coupleName,
      partner_name: partnerName,
      self_name: selfName,
      role: role ?? 'bride',
      wedding_date: weddingDate || '2026-12-01',
      venue: venue || 'TBD',
      city: city || 'Mumbai',
      total_budget: budget || 1000000,
      vibe_tags: vibes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setUserId(currentUserId)
    setWedding(wedding)
    dbSaveWedding({
      user_id: currentUserId,
      couple_name: wedding.couple_name,
      partner_name: wedding.partner_name,
      self_name: wedding.self_name,
      role: wedding.role,
      wedding_date: wedding.wedding_date,
      venue: wedding.venue,
      city: wedding.city,
      total_budget: wedding.total_budget,
      vibe_tags: wedding.vibe_tags,
    }).catch(() => null)
    setEvents(mockEvents)
    setItinerary(mockItinerary)
    setGuests(mockGuests)
    setVendors(mockVendors)
    setBudgetCategories(mockBudgetCategories)
    setExpenses(mockExpenses)
    setClCategories(mockClCategories)
    setClTasks(mockClTasks)
    setPins(mockPins)
    setNotes(mockNotes)
    setScreen('dashboard')
  }

  // ── Step 0: Role ───────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="ob3-shell">
        <button className="ob3-back-home" onClick={() => setScreen('landing')}>
          ← Home
        </button>

        <div className="ob3-role-wrap" key="step-0">
          <div className="ob3-eyebrow">Step 1 of 3</div>
          <h1 className="ob3-heading serif">Who's planning<br />this wedding?</h1>
          <p className="ob3-sub">We'll personalise your experience based on your role.</p>

          <div className="ob3-role-grid">
            {ROLES.map(r => (
              <button
                key={r.value}
                className={`ob3-role-card${role === r.value ? ' selected' : ''}`}
                onClick={() => { setRole(r.value); setStep(1) }}
              >
                <span className="ob3-role-emoji">{r.emoji}</span>
                <span className="ob3-role-label">{r.label}</span>
                <span className="ob3-role-sub">{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Step 1: Names + Date ───────────────────────────────────────
  if (step === 1) {
    const canContinue = selfName.trim().length > 0
    return (
      <div className="ob3-shell">
        <div className="ob3-card-wrap" key="step-1">
          <div className="ob3-progress">
            <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '33%' }} /></div>
            <span className="ob3-prog-label">Step 2 of 3</span>
          </div>

          <div className="ob3-eyebrow" style={{ marginTop: 24 }}>The couple</div>
          <h2 className="ob3-card-heading serif">Tell us your names</h2>

          <div className="ob3-fields">
            <div className="ob3-field">
              <label className="ob3-label">Your name <span className="ob3-req">*</span></label>
              <input
                className="ob3-input"
                placeholder="e.g. Priya"
                value={selfName}
                onChange={e => setSelfName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="ob3-field">
              <label className="ob3-label">Partner's name <span className="ob3-opt">(optional)</span></label>
              <input
                className="ob3-input"
                placeholder="e.g. Arjun"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
              />
            </div>
            <div className="ob3-field">
              <label className="ob3-label">Wedding date <span className="ob3-opt">(optional)</span></label>
              <input
                type="date"
                className="ob3-input"
                value={weddingDate}
                onChange={e => setWeddingDate(e.target.value)}
              />
            </div>
          </div>

          <div className="ob3-actions">
            <button className="ob3-btn-ghost" onClick={() => setStep(0)}>Back</button>
            <button
              className="ob3-btn-primary"
              disabled={!canContinue}
              onClick={() => setStep(2)}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Venue + Budget + Vibe ─────────────────────────────
  return (
    <div className="ob3-shell">
      <div className="ob3-card-wrap ob3-card-wide" key="step-2">
        <div className="ob3-progress">
          <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '66%' }} /></div>
          <span className="ob3-prog-label">Step 3 of 3</span>
        </div>

        <div className="ob3-eyebrow" style={{ marginTop: 24 }}>Almost there</div>
        <h2 className="ob3-card-heading serif">The details</h2>
        <p className="ob3-card-sub">All fields here are optional — skip anything you don't know yet.</p>

        <div className="ob3-two-col">
          <div className="ob3-field">
            <label className="ob3-label">Venue</label>
            <input
              className="ob3-input"
              placeholder="e.g. Grand Hyatt Mumbai"
              value={venue}
              onChange={e => setVenue(e.target.value)}
            />
          </div>
          <div className="ob3-field">
            <label className="ob3-label">City</label>
            <input
              className="ob3-input"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="ob3-field" style={{ marginTop: 20 }}>
          <label className="ob3-label">Approximate budget</label>
          <div className="ob3-chip-row">
            {BUDGETS.map(b => (
              <button
                key={b.value}
                className={`ob3-chip${budget === b.value ? ' on' : ''}`}
                onClick={() => setBudget(budget === b.value ? 0 : b.value)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ob3-field" style={{ marginTop: 20 }}>
          <label className="ob3-label">Wedding vibe <span className="ob3-opt">(pick any)</span></label>
          <div className="ob3-chip-row ob3-chip-wrap">
            {VIBES.map(v => (
              <button
                key={v}
                className={`ob3-chip${vibes.includes(v) ? ' on' : ''}`}
                onClick={() => toggleVibe(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="ob3-actions" style={{ marginTop: 32 }}>
          <button className="ob3-btn-ghost" onClick={() => setStep(1)}>Back</button>
          <button className="ob3-btn-primary ob3-btn-finish" onClick={finish}>
            Start planning ✨
          </button>
        </div>

        <p className="ob3-skip" onClick={finish}>Skip and go to dashboard →</p>
      </div>
    </div>
  )
}
