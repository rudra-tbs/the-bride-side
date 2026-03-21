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
  { value: 'bride',   label: 'Bride',   emoji: '👰', sub: 'I\'m planning my wedding' },
  { value: 'groom',   label: 'Groom',   emoji: '🤵', sub: 'Getting married soon' },
  { value: 'planner', label: 'Planner', emoji: '📋', sub: 'Planning for others' },
  { value: 'other',   label: 'Other',   emoji: '💍', sub: 'Family member / helper' },
]

const VIBE_OPTIONS = ['Romantic', 'Floral', 'Elegant', 'Traditional', 'Modern', 'Minimal', 'Bohemian', 'Vintage', 'Grand', 'Intimate']

const BUDGETS = [
  { label: 'Under ₹5L', value: 500000 },
  { label: '₹5L – ₹15L', value: 1000000 },
  { label: '₹15L – ₹30L', value: 2000000 },
  { label: '₹30L – ₹1Cr', value: 5000000 },
  { label: '₹1Cr+', value: 10000000 },
]

export default function Onboarding() {
  const { setScreen, setUserId, setWedding, setEvents, setItinerary,
    setGuests, setVendors, setBudgetCategories, setExpenses,
    setClCategories, setClTasks, setPins, setNotes } = useAppStore()

  const [step, setStep] = useState(0)
  const [role, setRole] = useState<Role | null>(null)
  const [selfName, setSelfName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [venue, setVenue] = useState('')
  const [city, setCity] = useState('')
  const [budget, setBudget] = useState(0)
  const [vibes, setVibes] = useState<string[]>([])

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
    // Persist to Supabase (fire-and-forget; local state is already set)
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

  // Step 0: Role selection
  if (step === 0) {
    return (
      <div className="role-shell">
        <button className="ob-back-link" onClick={() => setScreen('landing')}>← Back to home</button>
        <div className="role-shell-header">
          <div className="ob-step-badge">Step 1 of 4</div>
          <h1 className="role-title">Who's planning this wedding?</h1>
          <p className="role-subtitle">We'll personalise your planning experience based on your role.</p>
        </div>
        <div className="role-cards">
          {ROLES.map(r => (
            <div
              key={r.value}
              className={`role-card${role === r.value ? ' picked' : ''}`}
              onClick={() => setRole(r.value)}
            >
              <div className="role-card-art">{r.emoji}</div>
              <div className="role-card-label">{r.label}</div>
              <div className="role-card-sub">{r.sub}</div>
            </div>
          ))}
        </div>
        <div className="role-footer">
          <button
            className="btn btn-rose"
            disabled={!role}
            style={{ opacity: role ? 1 : 0.5 }}
            onClick={() => setStep(1)}
          >
            Continue →
          </button>
        </div>
      </div>
    )
  }

  const steps = ['Names', 'Date & Venue', 'Budget & Vibe']

  return (
    <div className="ob-shell">
      <div className="ob-card">
        {/* Progress dots */}
        <div className="ob-progress-row">
          <div className="ob-steps">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`ob-step-dot${i < step - 1 ? ' done' : i === step - 1 ? ' active' : ''}`}
              />
            ))}
          </div>
          <span className="ob-step-label">Step {step} of {steps.length + 1}</span>
        </div>

        {/* Step 1: Names */}
        {step === 1 && (
          <>
            <h2 className="serif" style={{ fontSize: '28px', fontWeight: 500, marginBottom: '24px' }}>
              What are your names?
            </h2>
            <div className="modal-field">
              <label className="modal-label">Your name</label>
              <input className="input" placeholder="e.g. Priya" value={selfName} onChange={e => setSelfName(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Partner's name</label>
              <input className="input" placeholder="e.g. Arjun" value={partnerName} onChange={e => setPartnerName(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-rose" onClick={() => setStep(2)} disabled={!selfName}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Date & Venue */}
        {step === 2 && (
          <>
            <h2 className="serif" style={{ fontSize: '28px', fontWeight: 500, marginBottom: '24px' }}>
              When & where?
            </h2>
            <div className="modal-field">
              <label className="modal-label">Wedding date</label>
              <input type="date" className="input" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Venue name</label>
              <input className="input" placeholder="e.g. Grand Hyatt Mumbai" value={venue} onChange={e => setVenue(e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label">City</label>
              <input className="input" placeholder="e.g. Mumbai" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-rose" onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Budget & Vibe */}
        {step === 3 && (
          <>
            <h2 className="serif" style={{ fontSize: '28px', fontWeight: 500, marginBottom: '24px' }}>
              Budget & vibe
            </h2>
            <div className="modal-field">
              <label className="modal-label">Approximate budget</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BUDGETS.map(b => (
                  <div
                    key={b.value}
                    className={`choice-card${budget === b.value ? ' sel' : ''}`}
                    onClick={() => setBudget(b.value)}
                  >
                    <div className="choice-card-title">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-field" style={{ marginTop: '16px' }}>
              <label className="modal-label">Wedding vibe (pick any)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {VIBE_OPTIONS.map(v => (
                  <button
                    key={v}
                    className={`chip${vibes.includes(v) ? ' on' : ''}`}
                    onClick={() => toggleVibe(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-rose" onClick={finish}>
                Start Planning ✨
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
