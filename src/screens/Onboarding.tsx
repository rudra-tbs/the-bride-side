import React, { useState } from 'react'
import { useAppStore } from '@/store/app'
import type { Role } from '@/types'
import { uuid } from '@/lib/utils'
import { dbSaveWedding } from '@/lib/supabase'
import {
  mockEvents, mockItinerary, mockGuests, mockVendors,
  mockBudgetCategories, mockExpenses, mockClCategories,
  mockClTasks, mockPins, mockNotes,
} from '@/mock/data'

const BrideIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Veil flowing */}
    <path d="M21 22 C16 35 14 56 17 80" stroke="#F4B8C2" strokeWidth="3" strokeLinecap="round"/>
    {/* Veil headpiece */}
    <path d="M27 14 Q40 8 53 14" stroke="#E8748A" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="40" cy="11" r="5" fill="#E8748A"/>
    <circle cx="40" cy="11" r="2.5" fill="#C45570"/>
    {/* Head */}
    <circle cx="40" cy="30" r="17" fill="#FDDDE6"/>
    {/* Eyes */}
    <ellipse cx="33" cy="28" rx="3.5" ry="4" fill="white"/>
    <ellipse cx="47" cy="28" rx="3.5" ry="4" fill="white"/>
    <circle cx="34" cy="29" r="2.5" fill="#C45570"/>
    <circle cx="48" cy="29" r="2.5" fill="#C45570"/>
    <circle cx="34.7" cy="28.2" r="0.9" fill="white"/>
    <circle cx="48.7" cy="28.2" r="0.9" fill="white"/>
    {/* Blush */}
    <ellipse cx="28" cy="35" rx="5" ry="3" fill="#E8748A" fillOpacity="0.2"/>
    <ellipse cx="52" cy="35" rx="5" ry="3" fill="#E8748A" fillOpacity="0.2"/>
    {/* Smile */}
    <path d="M33 37 Q40 43 47 37" stroke="#C45570" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Dress bell */}
    <path d="M27 47 Q40 41 53 47 L70 97 Q40 103 10 97Z" fill="#FDE8EC"/>
    {/* Bodice */}
    <path d="M29 47 Q40 42 51 47 L53 61 Q40 65 27 61Z" fill="#F4B8C2"/>
    {/* Frill */}
    <path d="M11 94 Q30 99 40 96 Q52 93 69 94" stroke="#F4B8C2" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Dress sparkles */}
    <circle cx="31" cy="73" r="2" fill="#E8748A" fillOpacity="0.45"/>
    <circle cx="49" cy="81" r="1.5" fill="#E8748A" fillOpacity="0.4"/>
    {/* Bouquet */}
    <circle cx="61" cy="61" r="9" fill="#E8748A" fillOpacity="0.9"/>
    <circle cx="68" cy="55" r="7" fill="#C45570" fillOpacity="0.75"/>
    <circle cx="58" cy="54" r="6" fill="#F4B8C2"/>
    <path d="M63 69 Q67 76 64 83" stroke="#7AAA90" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const GroomIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pagdi (turban) */}
    <path d="M22 28 Q24 12 40 10 Q56 12 58 28" fill="#E8748A"/>
    <path d="M20 29 Q22 18 40 16 Q58 18 60 29" fill="#C45570"/>
    <path d="M24 25 Q32 21 40 20 Q48 21 56 25" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none"/>
    <circle cx="40" cy="17" r="4.5" fill="#E8748A"/>
    <circle cx="40" cy="17" r="2" fill="white" fillOpacity="0.7"/>
    {/* Head */}
    <circle cx="40" cy="34" r="16" fill="#FDDDE6"/>
    {/* Eyebrows */}
    <path d="M31 28 Q34 26 37 28" stroke="#5A3A48" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M43 28 Q46 26 49 28" stroke="#5A3A48" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Eyes */}
    <ellipse cx="34" cy="32" rx="3" ry="3.5" fill="white"/>
    <ellipse cx="46" cy="32" rx="3" ry="3.5" fill="white"/>
    <circle cx="35" cy="33" r="2" fill="#2A1A20"/>
    <circle cx="47" cy="33" r="2" fill="#2A1A20"/>
    <circle cx="35.5" cy="32.2" r="0.8" fill="white"/>
    <circle cx="47.5" cy="32.2" r="0.8" fill="white"/>
    {/* Mustache */}
    <path d="M32 39 Q36 36 40 38 Q44 36 48 39" stroke="#5A3A48" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Sherwani */}
    <rect x="24" y="50" width="32" height="46" rx="5" fill="#2A1A20"/>
    {/* Collar V */}
    <path d="M36 50 L40 60 L44 50" stroke="#F4B8C2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Buttons */}
    <circle cx="40" cy="66" r="2.5" fill="#E8748A"/>
    <circle cx="40" cy="75" r="2.5" fill="#E8748A"/>
    <circle cx="40" cy="84" r="2.5" fill="#E8748A"/>
    {/* Side seams */}
    <line x1="32" y1="54" x2="30" y2="96" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
    <line x1="48" y1="54" x2="50" y2="96" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
    {/* Arms */}
    <rect x="11" y="52" width="13" height="32" rx="6.5" fill="#2A1A20"/>
    <rect x="56" y="52" width="13" height="32" rx="6.5" fill="#2A1A20"/>
    <rect x="11" y="75" width="13" height="9" rx="4" fill="#1a1218"/>
    <rect x="56" y="75" width="13" height="9" rx="4" fill="#1a1218"/>
  </svg>
)

const PlannerIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hair back */}
    <path d="M23 30 Q24 15 40 13 Q56 15 57 30 L57 34 Q50 26 40 25 Q30 26 23 34Z" fill="#5A3A48"/>
    {/* Head */}
    <circle cx="40" cy="32" r="17" fill="#FDDDE6"/>
    {/* Hair top */}
    <path d="M23 28 Q25 16 40 14 Q55 16 57 28" fill="#5A3A48"/>
    {/* Glasses */}
    <rect x="27" y="27" width="11" height="9" rx="4.5" stroke="#C45570" strokeWidth="1.8" fill="rgba(196,85,112,0.06)"/>
    <rect x="42" y="27" width="11" height="9" rx="4.5" stroke="#C45570" strokeWidth="1.8" fill="rgba(196,85,112,0.06)"/>
    <line x1="38" y1="31.5" x2="42" y2="31.5" stroke="#C45570" strokeWidth="1.8"/>
    <line x1="27" y1="31.5" x2="23" y2="30" stroke="#C45570" strokeWidth="1.5"/>
    <line x1="53" y1="31.5" x2="57" y2="30" stroke="#C45570" strokeWidth="1.5"/>
    {/* Eyes behind glasses */}
    <circle cx="32.5" cy="31.5" r="2.2" fill="#2A1A20"/>
    <circle cx="47.5" cy="31.5" r="2.2" fill="#2A1A20"/>
    <circle cx="33" cy="31" r="0.8" fill="white"/>
    <circle cx="48" cy="31" r="0.8" fill="white"/>
    {/* Smile */}
    <path d="M34 41 Q40 46 46 41" stroke="#C45570" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Blush */}
    <ellipse cx="28" cy="39" rx="5" ry="3" fill="#E8748A" fillOpacity="0.18"/>
    <ellipse cx="52" cy="39" rx="5" ry="3" fill="#E8748A" fillOpacity="0.18"/>
    {/* Pencil behind ear */}
    <rect x="57" y="18" width="3.5" height="14" rx="1" fill="#D4956A" transform="rotate(15 57 18)"/>
    <path d="M60 31 L62 35 L57 33Z" fill="#FDDDE6" transform="rotate(15 60 31)"/>
    {/* Body */}
    <path d="M25 51 Q40 44 55 51 L57 80 Q40 85 23 80Z" fill="#7AAA90"/>
    <path d="M35 51 L40 58 L45 51" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Legs */}
    <rect x="27" y="80" width="12" height="20" rx="6" fill="#5A7A68"/>
    <rect x="41" y="80" width="12" height="20" rx="6" fill="#5A7A68"/>
    {/* Clipboard */}
    <rect x="49" y="44" width="26" height="37" rx="4" fill="white" stroke="#C4A8B4" strokeWidth="1.5"/>
    <rect x="56" y="40" width="12" height="7" rx="3" fill="#C4A8B4"/>
    <rect x="59" y="38" width="6" height="4" rx="2" fill="#9A7888"/>
    {/* Checklist */}
    <path d="M55 54 L57 56.5 L61 51" stroke="#E8748A" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <line x1="64" y1="54" x2="70" y2="54" stroke="#E8748A" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M55 61 L57 63.5 L61 58" stroke="#E8748A" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <line x1="64" y1="61" x2="70" y2="61" stroke="#C4A8B4" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="55" y1="68" x2="70" y2="68" stroke="#E8D8DC" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="55" y1="74" x2="64" y2="74" stroke="#E8D8DC" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const FamilyIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Floating hearts */}
    <path d="M40 9 C40 6.5 37.5 5 36 6.5 C34.5 5 32 6.5 32 9 C32 12 36 15.5 36 15.5 C36 15.5 40 12 40 9Z" fill="#E8748A"/>
    <path d="M54 6 C54 4 52 3 51 4 C50 3 48 4 48 6 C48 8.5 51 11 51 11 C51 11 54 8.5 54 6Z" fill="#F4B8C2"/>
    <path d="M26 8 C26 6.5 24.5 5.5 23.5 6.5 C22.5 5.5 21 6.5 21 8 C21 9.5 23.5 12 23.5 12 C23.5 12 26 9.5 26 8Z" fill="#C45570" fillOpacity="0.65"/>
    {/* === Bride (left) === */}
    {/* Mini veil */}
    <path d="M11 32 Q16 25 21 32" stroke="#F4B8C2" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="16" cy="24" r="3" fill="#E8748A"/>
    {/* Head */}
    <circle cx="22" cy="37" r="12" fill="#FDDDE6"/>
    {/* Eyes */}
    <circle cx="18" cy="36" r="2" fill="#C45570"/>
    <circle cx="26" cy="36" r="2" fill="#C45570"/>
    <circle cx="18.5" cy="35.5" r="0.7" fill="white"/>
    <circle cx="26.5" cy="35.5" r="0.7" fill="white"/>
    {/* Blush */}
    <ellipse cx="14.5" cy="40" rx="3.5" ry="2" fill="#E8748A" fillOpacity="0.2"/>
    <ellipse cx="29.5" cy="40" rx="3.5" ry="2" fill="#E8748A" fillOpacity="0.2"/>
    {/* Smile */}
    <path d="M17 42 Q22 46 27 42" stroke="#C45570" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Dress */}
    <path d="M11 49 Q22 44 33 49 L39 93 Q22 98 5 93Z" fill="#FDE8EC"/>
    <path d="M13 49 Q22 45 31 49 L33 59 Q22 63 11 59Z" fill="#F4B8C2"/>
    {/* === Groom (right) === */}
    {/* Mini pagdi */}
    <path d="M52 34 Q54 24 62 23 Q70 24 72 34" fill="#E8748A"/>
    <circle cx="62" cy="24" r="3" fill="white" fillOpacity="0.6"/>
    {/* Head */}
    <circle cx="62" cy="38" r="12" fill="#FDDDE6"/>
    {/* Eyes */}
    <circle cx="58" cy="37" r="2" fill="#2A1A20"/>
    <circle cx="66" cy="37" r="2" fill="#2A1A20"/>
    <circle cx="58.5" cy="36.5" r="0.7" fill="white"/>
    <circle cx="66.5" cy="36.5" r="0.7" fill="white"/>
    {/* Mustache */}
    <path d="M56 42 Q59 40 62 41 Q65 40 68 42" stroke="#5A3A48" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Sherwani */}
    <rect x="51" y="50" width="22" height="44" rx="4" fill="#2A1A20"/>
    <path d="M59 50 L62 57 L65 50" stroke="#F4B8C2" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <circle cx="62" cy="63" r="1.8" fill="#E8748A"/>
    <circle cx="62" cy="71" r="1.8" fill="#E8748A"/>
    <circle cx="62" cy="79" r="1.8" fill="#E8748A"/>
    {/* Joined hands */}
    <path d="M33 72 C38 68 46 68 51 72" stroke="#E8748A" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <circle cx="33" cy="72" r="4" fill="#FDDDE6" stroke="#F4B8C2" strokeWidth="1.2"/>
    <circle cx="51" cy="72" r="4" fill="#FDDDE6" stroke="#F4B8C2" strokeWidth="1.2"/>
  </svg>
)

const ROLES: { value: Role; label: string; icon: React.ReactNode; sub: string }[] = [
  { value: 'bride',   label: 'Bride',   icon: <BrideIcon />,   sub: 'Planning my wedding' },
  { value: 'groom',   label: 'Groom',   icon: <GroomIcon />,   sub: 'Getting married soon' },
  { value: 'planner', label: 'Planner', icon: <PlannerIcon />, sub: 'Planning for others' },
  { value: 'other',   label: 'Family',  icon: <FamilyIcon />,  sub: 'Helping a loved one' },
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
                {r.icon}
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
