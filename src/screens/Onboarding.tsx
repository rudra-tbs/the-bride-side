import React, { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { Role } from '@/types'
import { uuid } from '@/lib/utils'
import { dbSaveWedding } from '@/lib/supabase'
import { makeStarterData } from '@/mock/data'

// ── Constants ─────────────────────────────────────────────────────────────────

const ROLES = [
  { value: 'bride',   emoji: '👰', label: 'Bride',   sub: 'Planning for myself' },
  { value: 'groom',   emoji: '🤵', label: 'Groom',   sub: 'Planning for myself' },
  { value: 'couple',  emoji: '💑', label: 'Couple',  sub: 'Planning together' },
  { value: 'family',  emoji: '👨‍👩‍👧', label: 'Family',  sub: 'Helping plan' },
  { value: 'planner', emoji: '📋', label: 'Planner', sub: 'For a client' },
]

const VIBE_SETS = [
  { label: 'Romantic Luxe',     tagline: 'Soft, dreamy & elegant',   image: 'https://images.unsplash.com/photo-1602874801006-bf8c1b70e0b0?w=600&h=400&fit=crop&q=80' },
  { label: 'Modern Minimal',    tagline: 'Clean lines, quiet luxury', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop&q=80' },
  { label: 'Floral Garden',     tagline: 'Lush blooms & natural beauty', image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&h=400&fit=crop&q=80' },
  { label: 'Royal Traditional', tagline: 'Grandeur meets heritage',   image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&q=80' },
  { label: 'Boho Intimate',     tagline: 'Free-spirited & soulful',   image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&q=80' },
  { label: 'Grand Statement',   tagline: 'Go big or go home',         image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&q=80' },
]

const CULTURES = [
  { value: 'north-indian', emoji: '🌺', label: 'North Indian', sub: 'Punjabi / Delhi / UP style',    events: ['Mehndi', 'Haldi', 'Sangeet', 'Wedding', 'Reception'] },
  { value: 'south-indian', emoji: '🌿', label: 'South Indian', sub: 'Tamil / Telugu / Kannadiga',    events: ['Mehndi', 'Wedding', 'Reception'] },
  { value: 'fusion',       emoji: '🎊', label: 'Fusion',       sub: 'Mix of traditions & modern',    events: ['Mehndi', 'Sangeet', 'Wedding', 'Reception'] },
  { value: 'destination',  emoji: '✈️', label: 'Destination',  sub: 'Goa, abroad or offbeat venue', events: ['Mehndi', 'Wedding', 'Reception'] },
  { value: 'not-sure',     emoji: '🤔', label: 'Not sure yet', sub: "We'll keep it flexible",        events: ['Wedding', 'Reception'] },
]

// Human-readable names for event preview pills
const EVENT_DISPLAY: Record<string, string> = {
  Mehndi: 'Mehendi', Haldi: 'Haldi', Sangeet: 'Sangeet',
  Wedding: 'Wedding Ceremony', Reception: 'Reception',
}

const BUDGET_PRESETS = [
  { value: 'under10', label: 'Under ₹10L', amount: 900000 },
  { value: '10-25',   label: '₹10 – 25L',  amount: 1750000 },
  { value: '25-50',   label: '₹25 – 50L',  amount: 3750000 },
  { value: '50plus',  label: '₹50L+',      amount: 7500000 },
]

const PRIORITIES = [
  { value: 'decor',          emoji: '🌸', label: 'Decor & Aesthetics' },
  { value: 'photography',    emoji: '📸', label: 'Photography' },
  { value: 'food',           emoji: '🍽️', label: 'Food & Catering' },
  { value: 'guest',          emoji: '🥂', label: 'Guest Experience' },
  { value: 'entertainment',  emoji: '🎵', label: 'Entertainment' },
  { value: 'budget-control', emoji: '💰', label: 'Budget Control' },
]

const TOTAL_STEPS = 6

function guestLabel(count: number): string {
  if (count <= 75)  return 'Intimate'
  if (count <= 200) return 'Mid-size'
  if (count <= 400) return 'Big fat wedding'
  return 'Grand affair'
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / TOTAL_STEPS) * 100)
  return (
    <div className="ob-progress-wrap">
      <div className="ob-progress-bar">
        <div className="ob-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="ob-progress-label">Step {step} of {TOTAL_STEPS}</span>
        <span className="ob-progress-pct">{pct}%</span>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Onboarding() {
  const {
    setScreen, setUserId, setWedding, setEvents, setItinerary,
    setGuests, setVendors, setBudgetCategories, setExpenses,
    setClCategories, setClTasks, setPins, setNotes,
  } = useAppStore()

  const [step, setStep]               = useState(0)
  const [role, setRole]               = useState('')
  const [selfName, setSelfName]       = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [dateUndecided, setDateUndecided] = useState(false)
  const [city, setCity]               = useState('')
  const [guestCount, setGuestCount]   = useState(150)
  const [vibes, setVibes]             = useState<string[]>([])
  const [cultureType, setCultureType] = useState('')
  const [budgetPreset, setBudgetPreset] = useState('')
  const [budgetSkip, setBudgetSkip]   = useState(false)
  const [priorities, setPriorities]   = useState<string[]>([])
  const [showReady, setShowReady]     = useState(false)

  function goTo(n: number) { setStep(n) }
  function back() { setStep(s => s - 1) }

  function toggleVibe(v: string) {
    setVibes(prev => prev.includes(v)
      ? prev.filter(x => x !== v)
      : prev.length < 2 ? [...prev, v] : prev)
  }

  function togglePriority(p: string) {
    setPriorities(prev => prev.includes(p)
      ? prev.filter(x => x !== p)
      : prev.length < 3 ? [...prev, p] : prev)
  }

  const selectedCulture = CULTURES.find(c => c.value === cultureType)
  const selectedEvents = selectedCulture?.events ?? ['Wedding', 'Reception']

  function finish() {
    const currentUserId = useAppStore.getState().userId ?? uuid()

    const coupleName = selfName && partnerName
      ? `${selfName} & ${partnerName}`
      : selfName ? `${selfName}'s Wedding` : 'The Happy Couple'

    const budgetAmount = budgetSkip
      ? 2000000
      : BUDGET_PRESETS.find(b => b.value === budgetPreset)?.amount ?? 2000000

    // Map UI role values to the existing Role type
    const roleForDb: Role = role === 'couple' ? 'bride'
      : role === 'family' ? 'other'
      : (role as Role) || 'other'

    const wedding = {
      id: uuid(),
      user_id: currentUserId,
      couple_name: coupleName,
      partner_name: partnerName,
      self_name: selfName || 'You',
      role: roleForDb,
      wedding_date: dateUndecided ? '2027-01-01' : (weddingDate || '2027-01-01'),
      venue: 'TBD',
      city: city || 'India',
      total_budget: budgetAmount,
      vibe_tags: vibes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setUserId(currentUserId)
    setWedding(wedding)
    dbSaveWedding({ ...wedding }).catch(() => null)

    const { events, budgetCategories, clCategories, clTasks } = makeStarterData(
      wedding.id, selectedEvents, wedding.wedding_date, wedding.venue,
    )
    setEvents(events)
    setItinerary([])
    setGuests([])
    setVendors([])
    setBudgetCategories(budgetCategories)
    setExpenses([])
    setClCategories(clCategories)
    setClTasks(clTasks)
    setPins([])
    setNotes([])
    setShowReady(true)
    setTimeout(() => setScreen('dashboard'), 2800)
  }

  // ── Ready screen ───────────────────────────────────────────────────────────
  if (showReady) {
    return (
      <div className="ob-ready">
        <div className="ob-ready-inner">
          <div className="ob-ready-spinner">
            <div className="ob-ready-ring1" />
            <div className="ob-ready-ring2" />
            <div className="ob-ready-ring3" />
          </div>
          <h2 className="ob-ready-title serif">
            Designing your plan{selfName ? `, ${selfName.split(' ')[0]}` : ''}…
          </h2>
          <div className="ob-ready-items">
            {[
              'Itinerary based on your traditions',
              'Smart checklist for your timeline',
              'Budget breakdown ready',
              'Next steps queued up',
            ].map((item, i) => (
              <div key={item} className="ob-ready-item" style={{ animationDelay: `${i * 0.35}s` }}>
                <span className="ob-ready-check">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Step 0: Hook screen ────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="ob-hook">
        <button className="ob-back-home" onClick={() => setScreen('landing')}>← Home</button>
        <div className="ob-hook-content">
          <div className="ob-hook-badge">Wedding Planning · Reimagined</div>
          <h1 className="ob-hook-title serif">
            Let's design your<br />wedding in under<br />60 seconds
          </h1>
          <p className="ob-hook-sub">
            Answer a few quick questions. We'll build your personalized planning space instantly.
          </p>
          <div className="ob-hook-preview">
            <div className="ob-hook-card ob-hook-card-1">📋 Itinerary</div>
            <div className="ob-hook-card ob-hook-card-2">✅ Checklist</div>
            <div className="ob-hook-card ob-hook-card-3">💰 Budget</div>
            <div className="ob-hook-card ob-hook-card-4">👥 Guests</div>
          </div>
          <button className="ob-cta" onClick={() => goTo(1)}>Start Planning →</button>
          <p className="ob-hook-hint">No sign-up required · Takes under 60 sec</p>
        </div>
      </div>
    )
  }

  // ── Step 1: Who's planning? ────────────────────────────────────────────────
  if (step === 1) {
    const showPartner = role === 'bride' || role === 'groom' || role === 'couple'
    return (
      <div className="ob-shell">
        <ProgressBar step={1} />
        <div className="ob-step">
          <p className="ob-eyebrow">Getting started</p>
          <h2 className="ob-heading serif">Who's planning<br />this wedding?</h2>
          <p className="ob-sub">This helps us tailor your experience</p>

          <div className="ob-role-grid">
            {ROLES.map(r => (
              <button
                key={r.value}
                className={`ob-role-card${role === r.value ? ' selected' : ''}`}
                onClick={() => setRole(r.value)}
              >
                <span className="ob-role-emoji">{r.emoji}</span>
                <span className="ob-role-label">{r.label}</span>
                <span className="ob-role-sub">{r.sub}</span>
              </button>
            ))}
          </div>

          {role && (
            <div className="ob-name-row">
              <div className="ob-field">
                <label className="ob-label">
                  {role === 'planner' ? 'Your name' : role === 'family' ? 'Your name' : 'Your name'}
                  <span className="ob-opt"> (optional)</span>
                </label>
                <input
                  className="ob-input"
                  placeholder={role === 'bride' ? 'e.g. Priya' : role === 'groom' ? 'e.g. Arjun' : role === 'planner' ? 'Planner name' : 'Your name'}
                  value={selfName}
                  onChange={e => setSelfName(e.target.value)}
                  autoFocus
                />
              </div>
              {showPartner && (
                <div className="ob-field">
                  <label className="ob-label">
                    Partner's name<span className="ob-opt"> (optional)</span>
                  </label>
                  <input
                    className="ob-input"
                    placeholder={role === 'bride' ? 'e.g. Arjun' : 'e.g. Priya'}
                    value={partnerName}
                    onChange={e => setPartnerName(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="ob-actions">
            <button className="ob-btn-ghost" onClick={() => goTo(0)}>← Back</button>
            <button className="ob-btn-primary" disabled={!role} onClick={() => goTo(2)}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Wedding Basics ─────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="ob-shell">
        <ProgressBar step={2} />
        <div className="ob-step">
          <p className="ob-eyebrow">The big day</p>
          <h2 className="ob-heading serif">Tell us about<br />the wedding</h2>

          <div className="ob-basics-grid">
            <div className="ob-field">
              <label className="ob-label">Wedding date</label>
              <div className="ob-date-row">
                <input
                  className={`ob-input${dateUndecided ? ' ob-input-muted' : ''}`}
                  type="date"
                  value={weddingDate}
                  disabled={dateUndecided}
                  onChange={e => setWeddingDate(e.target.value)}
                />
                <label className="ob-toggle-label">
                  <input type="checkbox" checked={dateUndecided} onChange={e => setDateUndecided(e.target.checked)} />
                  <span>Not decided</span>
                </label>
              </div>
            </div>
            <div className="ob-field">
              <label className="ob-label">City / Location</label>
              <input
                className="ob-input"
                placeholder="e.g. Mumbai, Jaipur, Goa…"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="ob-field" style={{ marginTop: '20px' }}>
            <label className="ob-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Guest count</span>
              <span className="ob-guest-vibe">{guestLabel(guestCount)} · ~{guestCount}</span>
            </label>
            <input
              className="ob-slider"
              type="range"
              min={25}
              max={1000}
              step={25}
              value={guestCount}
              onChange={e => setGuestCount(Number(e.target.value))}
            />
            <div className="ob-slider-labels">
              <span>25 — Intimate</span>
              <span>Extravaganza — 1000+</span>
            </div>
          </div>

          <div className="ob-actions">
            <button className="ob-btn-ghost" onClick={back}>← Back</button>
            <button className="ob-btn-primary" onClick={() => goTo(3)}>Continue →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 3: Wedding Style ──────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="ob-shell">
        <ProgressBar step={3} />
        <div className="ob-step">
          <p className="ob-eyebrow">Your vibe</p>
          <h2 className="ob-heading serif">What's your<br />wedding style?</h2>
          <p className="ob-sub">
            Pick up to 2 that feel like you
            {vibes.length > 0 && <span className="ob-vibe-count"> · {vibes.length} selected</span>}
          </p>

          <div className="ob-vibe-grid">
            {VIBE_SETS.map(v => {
              const isSelected = vibes.includes(v.label)
              const isDisabled = !isSelected && vibes.length >= 2
              return (
                <button
                  key={v.label}
                  className={`ob-vibe-card${isSelected ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
                  onClick={() => !isDisabled && toggleVibe(v.label)}
                  style={{ '--vibe-img': `url(${v.image})` } as React.CSSProperties}
                >
                  {isSelected && <div className="ob-vibe-check">✓</div>}
                  <div className="ob-vibe-overlay" />
                  <div className="ob-vibe-body">
                    <div className="ob-vibe-name">{v.label}</div>
                    <div className="ob-vibe-tagline">{v.tagline}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="ob-actions">
            <button className="ob-btn-ghost" onClick={back}>← Back</button>
            <button className="ob-btn-primary" onClick={() => goTo(4)}>
              {vibes.length === 0 ? 'Skip →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 4: Culture / Wedding Type ────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="ob-shell">
        <ProgressBar step={4} />
        <div className="ob-step">
          <p className="ob-eyebrow">Your traditions</p>
          <h2 className="ob-heading serif">Tell us about<br />your wedding type</h2>

          <div className="ob-culture-grid">
            {CULTURES.map(c => (
              <button
                key={c.value}
                className={`ob-culture-card${cultureType === c.value ? ' selected' : ''}`}
                onClick={() => setCultureType(c.value)}
              >
                <span className="ob-culture-emoji">{c.emoji}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div className="ob-culture-label">{c.label}</div>
                  <div className="ob-culture-sub">{c.sub}</div>
                </div>
                {cultureType === c.value && <div className="ob-culture-check">✓</div>}
              </button>
            ))}
          </div>

          {cultureType && (
            <div className="ob-event-preview">
              <div className="ob-event-preview-label">Your wedding will include</div>
              <div className="ob-event-pills">
                {selectedEvents.map((ev, i) => (
                  <div
                    key={ev}
                    className="ob-event-pill"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {EVENT_DISPLAY[ev] ?? ev}
                  </div>
                ))}
              </div>
              <div className="ob-event-preview-hint">
                We'll build your itinerary & checklist around these events
              </div>
            </div>
          )}

          <div className="ob-actions">
            <button className="ob-btn-ghost" onClick={back}>← Back</button>
            <button className="ob-btn-primary" disabled={!cultureType} onClick={() => goTo(5)}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 5: Budget ─────────────────────────────────────────────────────────
  if (step === 5) {
    return (
      <div className="ob-shell">
        <ProgressBar step={5} />
        <div className="ob-step">
          <p className="ob-eyebrow">Budget</p>
          <h2 className="ob-heading serif">What's your<br />budget range?</h2>
          <p className="ob-sub">Helps us suggest realistic vendors & allocations</p>

          <div className="ob-budget-grid">
            {BUDGET_PRESETS.map(b => (
              <button
                key={b.value}
                className={`ob-budget-card${budgetPreset === b.value && !budgetSkip ? ' selected' : ''}`}
                onClick={() => { setBudgetPreset(b.value); setBudgetSkip(false) }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <button
            className={`ob-skip-budget${budgetSkip ? ' active' : ''}`}
            onClick={() => { setBudgetSkip(s => !s); setBudgetPreset('') }}
          >
            {budgetSkip ? '✓ Skipped — we\'ll use a default' : 'Prefer not to share'}
          </button>

          <div className="ob-actions">
            <button className="ob-btn-ghost" onClick={back}>← Back</button>
            <button
              className="ob-btn-primary"
              disabled={!budgetPreset && !budgetSkip}
              onClick={() => goTo(6)}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 6: Priorities ─────────────────────────────────────────────────────
  if (step === 6) {
    return (
      <div className="ob-shell">
        <ProgressBar step={6} />
        <div className="ob-step">
          <p className="ob-eyebrow">Almost there!</p>
          <h2 className="ob-heading serif">What matters<br />most to you?</h2>
          <p className="ob-sub">
            Choose up to 3 — this shapes how we prioritize your plan
            {priorities.length > 0 && <span className="ob-vibe-count"> · {priorities.length}/3 chosen</span>}
          </p>

          <div className="ob-priority-grid">
            {PRIORITIES.map(p => {
              const isSelected = priorities.includes(p.value)
              const isDisabled = !isSelected && priorities.length >= 3
              return (
                <button
                  key={p.value}
                  className={`ob-priority-chip${isSelected ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
                  onClick={() => !isDisabled && togglePriority(p.value)}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                  {isSelected && <span className="ob-chip-check">✓</span>}
                </button>
              )
            })}
          </div>

          <div className="ob-actions">
            <button className="ob-btn-ghost" onClick={back}>← Back</button>
            <button className="ob-btn-primary" onClick={finish}>
              Build My Plan ✨
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
