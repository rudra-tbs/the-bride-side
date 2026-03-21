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
  <svg className="ob3-role-svg" viewBox="0 0 100 170" fill="none" xmlns="http://www.w3.org/2000/svg"
    stroke="#2e1a22" strokeLinecap="round" strokeLinejoin="round">
    {/* Veil flowing left */}
    <path d="M28 32 C22 48 20 76 23 112" stroke="#b8909a" strokeWidth="2"/>
    {/* Veil headpiece bar */}
    <path d="M30 24 Q50 16 70 24" strokeWidth="2.2"/>
    {/* Head */}
    <ellipse cx="50" cy="38" rx="18" ry="19" fill="#f9efe8" strokeWidth="1.8"/>
    {/* Eyes */}
    <circle cx="43" cy="36" r="2" fill="#2e1a22" stroke="none"/>
    <circle cx="57" cy="36" r="2" fill="#2e1a22" stroke="none"/>
    {/* Smile */}
    <path d="M43 43 Q50 48 57 43" strokeWidth="1.6"/>
    {/* Neck */}
    <path d="M44 57 L44 65 M56 57 L56 65" strokeWidth="1.8"/>
    {/* Dress bodice */}
    <path d="M33 65 Q50 58 67 65 L70 83 Q50 89 30 83Z" fill="#f5f0ec" strokeWidth="1.8"/>
    {/* Dress bell skirt */}
    <path d="M30 83 Q50 77 70 83 L84 158 Q50 166 16 158Z" fill="#f5f0ec" strokeWidth="1.8"/>
    {/* Skirt detail stitch */}
    <path d="M20 128 Q50 123 80 128" strokeWidth="1" strokeDasharray="4 3"/>
    {/* Left arm raised — waving */}
    <path d="M33 69 C20 60 13 50 10 38" strokeWidth="1.9"/>
    <ellipse cx="9" cy="36" rx="5.5" ry="6.5" fill="#f9efe8" strokeWidth="1.6"/>
    {/* Fingers */}
    <path d="M5 32 Q9 29 13 32 M6 36 Q9 33 12 35" strokeWidth="1.2"/>
    {/* Right arm + bouquet */}
    <path d="M67 69 C76 78 80 90 80 99" strokeWidth="1.9"/>
    <circle cx="82" cy="105" r="9" fill="#fde8ec" strokeWidth="1.6"/>
    <circle cx="88" cy="98" r="6" fill="#fde8ec" strokeWidth="1.5"/>
    <circle cx="76" cy="100" r="5" fill="#fde8ec" strokeWidth="1.5"/>
    <path d="M82 114 Q85 122 82 130" strokeWidth="1.8"/>
    {/* Feet peeking below skirt */}
    <path d="M40 160 L38 168 Q42 171 48 168" strokeWidth="1.7"/>
    <path d="M60 160 L62 168 Q58 171 52 168" strokeWidth="1.7"/>
  </svg>
)

const GroomIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 100 170" fill="none" xmlns="http://www.w3.org/2000/svg"
    stroke="#2e1a22" strokeLinecap="round" strokeLinejoin="round">
    {/* Hair */}
    <path d="M32 28 Q34 16 50 14 Q66 16 68 28 L66 32" fill="#2e1a22" stroke="none"/>
    {/* Head */}
    <ellipse cx="50" cy="36" rx="18" ry="19" fill="#f9efe8" strokeWidth="1.8"/>
    {/* Eyebrows */}
    <path d="M38 29 Q42 27 46 29 M54 29 Q58 27 62 29" strokeWidth="1.4"/>
    {/* Eyes */}
    <circle cx="43" cy="34" r="2" fill="#2e1a22" stroke="none"/>
    <circle cx="57" cy="34" r="2" fill="#2e1a22" stroke="none"/>
    {/* Smile */}
    <path d="M42 42 Q50 47 58 42" strokeWidth="1.6"/>
    {/* Neck */}
    <path d="M44 55 L44 64 M56 55 L56 64" strokeWidth="1.8"/>
    {/* Suit jacket */}
    <path d="M33 64 Q50 57 67 64 L70 118 Q50 124 30 118Z" fill="#f3f0ed" strokeWidth="1.8"/>
    {/* Jacket lapels */}
    <path d="M42 64 L50 76 L58 64" strokeWidth="1.6"/>
    {/* Tie */}
    <path d="M48 66 L50 82 L52 66" strokeWidth="1.3" fill="#e0ccd4" stroke="#2e1a22"/>
    {/* Pocket square */}
    <path d="M35 78 L40 74 L40 80" strokeWidth="1.2"/>
    {/* Trousers */}
    <path d="M36 118 L30 162" strokeWidth="1.9"/>
    <path d="M64 118 L70 162" strokeWidth="1.9"/>
    <path d="M50 122 L47 162 M50 122 L53 162" strokeWidth="1.6"/>
    {/* Shoes */}
    <path d="M26 162 Q30 168 40 165" strokeWidth="1.8"/>
    <path d="M74 162 Q70 168 60 165" strokeWidth="1.8"/>
    {/* Left arm raised — waving */}
    <path d="M33 68 C20 58 12 46 10 34" strokeWidth="1.9"/>
    <ellipse cx="9" cy="32" rx="5.5" ry="6.5" fill="#f9efe8" strokeWidth="1.6"/>
    <path d="M5 28 Q9 25 13 28 M6 33 Q9 30 12 32" strokeWidth="1.2"/>
    {/* Right arm at side */}
    <path d="M67 68 C76 80 78 94 76 108" strokeWidth="1.9"/>
  </svg>
)

const PlannerIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 100 170" fill="none" xmlns="http://www.w3.org/2000/svg"
    stroke="#2e1a22" strokeLinecap="round" strokeLinejoin="round">
    {/* Hair in bun */}
    <circle cx="50" cy="16" r="10" fill="#2e1a22" stroke="none"/>
    <path d="M33 28 Q36 16 50 13 Q64 16 67 28" fill="#2e1a22" stroke="none"/>
    {/* Head */}
    <ellipse cx="50" cy="36" rx="18" ry="19" fill="#f9efe8" strokeWidth="1.8"/>
    {/* Glasses */}
    <rect x="36" y="31" width="10" height="8" rx="4" strokeWidth="1.6" fill="rgba(255,255,255,0.4)"/>
    <rect x="54" y="31" width="10" height="8" rx="4" strokeWidth="1.6" fill="rgba(255,255,255,0.4)"/>
    <path d="M46 35 L54 35" strokeWidth="1.5"/>
    <path d="M36 35 L32 33" strokeWidth="1.4"/>
    <path d="M64 35 L68 33" strokeWidth="1.4"/>
    {/* Eyes */}
    <circle cx="41" cy="35" r="1.8" fill="#2e1a22" stroke="none"/>
    <circle cx="59" cy="35" r="1.8" fill="#2e1a22" stroke="none"/>
    {/* Smile */}
    <path d="M42 44 Q50 49 58 44" strokeWidth="1.6"/>
    {/* Neck */}
    <path d="M44 55 L44 64 M56 55 L56 64" strokeWidth="1.8"/>
    {/* Blazer */}
    <path d="M32 64 Q50 57 68 64 L70 116 Q50 122 30 116Z" fill="#f3f0ed" strokeWidth="1.8"/>
    {/* Lapels */}
    <path d="M42 64 L50 75 L58 64" strokeWidth="1.6"/>
    {/* Skirt */}
    <path d="M30 116 Q50 110 70 116 L74 158 Q50 164 26 158Z" fill="#f3f0ed" strokeWidth="1.8"/>
    {/* Shoes */}
    <path d="M34 158 L32 165 Q37 168 44 165" strokeWidth="1.7"/>
    <path d="M66 158 L68 165 Q63 168 56 165" strokeWidth="1.7"/>
    {/* Left arm raised — waving */}
    <path d="M32 68 C20 58 12 46 10 34" strokeWidth="1.9"/>
    <ellipse cx="9" cy="32" rx="5.5" ry="6.5" fill="#f9efe8" strokeWidth="1.6"/>
    <path d="M5 28 Q9 25 13 28 M6 33 Q9 30 12 32" strokeWidth="1.2"/>
    {/* Right arm holding clipboard */}
    <path d="M68 68 C80 78 86 90 86 102" strokeWidth="1.9"/>
    {/* Clipboard */}
    <rect x="78" y="96" width="24" height="34" rx="3" fill="white" strokeWidth="1.5"/>
    <rect x="84" y="91" width="12" height="7" rx="2.5" fill="#c4a8b4" strokeWidth="1.2"/>
    {/* Checklist lines */}
    <path d="M83 108 L85 111 L90 104" strokeWidth="1.5"/>
    <line x1="93" y1="108" x2="99" y2="108" strokeWidth="1.3"/>
    <path d="M83 116 L85 119 L90 112" strokeWidth="1.5"/>
    <line x1="93" y1="116" x2="99" y2="116" strokeWidth="1.3"/>
    <line x1="83" y1="124" x2="99" y2="124" strokeWidth="1" stroke="#c4a8b4"/>
  </svg>
)

const FamilyIcon = () => (
  <svg className="ob3-role-svg" viewBox="0 0 100 170" fill="none" xmlns="http://www.w3.org/2000/svg"
    stroke="#2e1a22" strokeLinecap="round" strokeLinejoin="round">
    {/* Ghost body — rounded top, wavy hem */}
    <path d="M18 80 C18 42 26 16 50 16 C74 16 82 42 82 80 L82 148
      Q74 141 66 148 Q58 141 50 148 Q42 141 34 148 Q26 141 18 148 Z"
      fill="#f5f2ee" strokeWidth="2.2"/>
    {/* Eyes */}
    <ellipse cx="37" cy="76" rx="7" ry="9" fill="#2e1a22" stroke="none"/>
    <ellipse cx="63" cy="76" rx="7" ry="9" fill="#2e1a22" stroke="none"/>
    {/* Eye shine */}
    <ellipse cx="39" cy="73" rx="2.5" ry="3.5" fill="white" stroke="none"/>
    <ellipse cx="65" cy="73" rx="2.5" ry="3.5" fill="white" stroke="none"/>
    {/* Cute little smile */}
    <path d="M40 96 Q50 104 60 96" strokeWidth="2.2"/>
    {/* Left arm wave */}
    <path d="M18 86 C8 74 6 62 12 52" strokeWidth="2.2"/>
    <ellipse cx="11" cy="49" rx="6" ry="7" fill="#f5f2ee" strokeWidth="1.8"/>
    {/* Finger wave */}
    <path d="M7 44 Q11 40 15 44 M8 49 Q11 46 14 48" strokeWidth="1.4"/>
    {/* Right arm */}
    <path d="M82 86 C92 74 94 62 88 52" strokeWidth="2.2"/>
    {/* Tiny floating hearts above */}
    <path d="M44 8 C44 5.5 41 4 39.5 5.5 C38 4 35 5.5 35 8 C35 11 39.5 14 39.5 14 C39.5 14 44 11 44 8Z"
      fill="#e8748a" stroke="none"/>
    <path d="M62 5 C62 3 60 2 59 3 C58 2 56 3 56 5 C56 7.5 59 10 59 10 C59 10 62 7.5 62 5Z"
      fill="#f4b8c2" stroke="none"/>
    <path d="M28 10 C28 8 26.5 7 25.5 8 C24.5 7 23 8 23 10 C23 12 25.5 14 25.5 14 C25.5 14 28 12 28 10Z"
      fill="#c45570" stroke="none" fillOpacity="0.6"/>
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

const EVENTS_LIST = ['Wedding', 'Reception', 'Mehndi', 'Sangeet', 'Haldi', 'Engagement', 'Roka']

const RELATIONS = ['Sister', 'Brother', 'Mom', 'Dad', 'Best Friend', 'Cousin', 'Colleague', 'Other']

const HELP_AREAS = [
  'Decoration', 'Catering', 'Guest Management',
  'Photography', 'Logistics', 'Shopping', 'Entertainment', 'Other',
]

const NOTIF_PREFS = ['WhatsApp', 'Email', 'Push Notifications']

export default function Onboarding() {
  const {
    setScreen, setUserId, setWedding, setEvents, setItinerary,
    setGuests, setVendors, setBudgetCategories, setExpenses,
    setClCategories, setClTasks, setPins, setNotes,
  } = useAppStore()

  const [step, setStep]                         = useState(0)
  const [role, setRole]                         = useState<Role | null>(null)
  // Bride / Groom
  const [selfName, setSelfName]                 = useState('')
  const [partnerName, setPartnerName]           = useState('')
  const [whatsapp, setWhatsapp]                 = useState('')
  const [weddingDate, setWeddingDate]           = useState('')
  const [city, setCity]                         = useState('')
  const [guestCount, setGuestCount]             = useState('')
  const [selectedEvents, setSelectedEvents]     = useState<string[]>(['Wedding'])
  const [venue, setVenue]                       = useState('')
  const [budget, setBudget]                     = useState(0)
  const [vibes, setVibes]                       = useState<string[]>([])
  // Planner
  const [agencyName, setAgencyName]             = useState('')
  const [workEmail, setWorkEmail]               = useState('')
  const [clientBrideName, setClientBrideName]   = useState('')
  const [clientGroomName, setClientGroomName]   = useState('')
  // Other / Family
  const [relation, setRelation]                 = useState('')
  const [attendingEvents, setAttendingEvents]   = useState<string[]>([])
  const [travelOutstation, setTravelOutstation] = useState<boolean | null>(null)
  const [helpAreas, setHelpAreas]               = useState<string[]>([])
  const [notifPrefs, setNotifPrefs]             = useState<string[]>([])

  const isBG      = role === 'bride' || role === 'groom'
  const isPlanner = role === 'planner'

  function toggleVibe(v: string) {
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }
  function toggleSelectedEvent(ev: string) {
    setSelectedEvents(prev => prev.includes(ev) ? prev.filter(x => x !== ev) : [...prev, ev])
  }
  function toggleAttendingEvent(ev: string) {
    setAttendingEvents(prev => prev.includes(ev) ? prev.filter(x => x !== ev) : [...prev, ev])
  }
  function toggleHelpArea(a: string) {
    setHelpAreas(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }
  function toggleNotifPref(n: string) {
    setNotifPrefs(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  function finish() {
    const currentUserId = useAppStore.getState().userId ?? uuid()
    let coupleName: string, partnerN: string, selfN: string

    if (isBG) {
      selfN = selfName
      partnerN = partnerName
      coupleName = selfName && partnerName
        ? `${selfName} & ${partnerName}`
        : selfName || 'The Happy Couple'
    } else if (isPlanner) {
      selfN = selfName
      partnerN = clientGroomName
      coupleName = clientBrideName && clientGroomName
        ? `${clientBrideName} & ${clientGroomName}`
        : clientBrideName || 'The Happy Couple'
    } else {
      selfN = selfName
      partnerN = ''
      coupleName = 'The Happy Couple'
    }

    const wedding = {
      id: uuid(),
      user_id: currentUserId,
      couple_name: coupleName,
      partner_name: partnerN,
      self_name: selfN,
      role: role ?? 'other',
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

  // ── Step 0: Role selection ─────────────────────────────────────
  if (step === 0) {
    return (
      <div className="ob3-shell">
        <button className="ob3-back-home" onClick={() => setScreen('landing')}>
          ← Home
        </button>
        <div className="ob3-role-wrap" key="step-0">
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
                <div className="ob3-role-label-wrap">
                  <span className="ob3-role-label">{r.label}</span>
                  <span className="ob3-role-sub">{r.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Bride / Groom flow ────────────────────────────────────────
  if (isBG) {
    if (step === 1) {
      const canContinue = selfName.trim().length > 0
      return (
        <div className="ob3-shell">
          <div className="ob3-card-wrap" key="bg-1">
            <div className="ob3-progress">
              <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '25%' }} /></div>
              <span className="ob3-prog-label">Step 1 of 4</span>
            </div>
            <div className="ob3-eyebrow" style={{ marginTop: 24 }}>The couple</div>
            <h2 className="ob3-card-heading serif">Tell us your names</h2>
            <div className="ob3-fields">
              <div className="ob3-field">
                <label className="ob3-label">Your name <span className="ob3-req">*</span></label>
                <input className="ob3-input" placeholder="e.g. Priya" value={selfName}
                  onChange={e => setSelfName(e.target.value)} autoFocus />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">Partner's name <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" placeholder="e.g. Arjun" value={partnerName}
                  onChange={e => setPartnerName(e.target.value)} />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">WhatsApp number <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" type="tel" placeholder="e.g. +91 98765 43210"
                  value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
              </div>
            </div>
            <div className="ob3-actions">
              <button className="ob3-btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="ob3-btn-primary" disabled={!canContinue} onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="ob3-shell">
          <div className="ob3-card-wrap ob3-card-wide" key="bg-2">
            <div className="ob3-progress">
              <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '50%' }} /></div>
              <span className="ob3-prog-label">Step 2 of 4</span>
            </div>
            <div className="ob3-eyebrow" style={{ marginTop: 24 }}>The events</div>
            <h2 className="ob3-card-heading serif">What events are you planning?</h2>
            <div className="ob3-field" style={{ marginTop: 8 }}>
              <div className="ob3-chip-row ob3-chip-wrap">
                {EVENTS_LIST.map(ev => (
                  <button key={ev} className={`ob3-chip${selectedEvents.includes(ev) ? ' on' : ''}`}
                    onClick={() => toggleSelectedEvent(ev)}>{ev}</button>
                ))}
              </div>
            </div>
            <div className="ob3-two-col" style={{ marginTop: 20 }}>
              <div className="ob3-field">
                <label className="ob3-label">Wedding date <span className="ob3-opt">(optional)</span></label>
                <input type="date" className="ob3-input" value={weddingDate}
                  onChange={e => setWeddingDate(e.target.value)} />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">City</label>
                <input className="ob3-input" placeholder="e.g. Mumbai" value={city}
                  onChange={e => setCity(e.target.value)} />
              </div>
            </div>
            <div className="ob3-field" style={{ marginTop: 16 }}>
              <label className="ob3-label">Expected guest count <span className="ob3-opt">(optional)</span></label>
              <input className="ob3-input" type="number" placeholder="e.g. 300" value={guestCount}
                onChange={e => setGuestCount(e.target.value)} />
            </div>
            <div className="ob3-actions">
              <button className="ob3-btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="ob3-btn-primary" onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="ob3-shell">
          <div className="ob3-card-wrap" key="bg-3">
            <div className="ob3-progress">
              <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '75%' }} /></div>
              <span className="ob3-prog-label">Step 3 of 4</span>
            </div>
            <div className="ob3-eyebrow" style={{ marginTop: 24 }}>The venue</div>
            <h2 className="ob3-card-heading serif">Where's the celebration?</h2>
            <div className="ob3-fields">
              <div className="ob3-field">
                <label className="ob3-label">Venue name <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" placeholder="e.g. Grand Hyatt Mumbai" value={venue}
                  onChange={e => setVenue(e.target.value)} autoFocus />
              </div>
            </div>
            <div className="ob3-field" style={{ marginTop: 20 }}>
              <label className="ob3-label">Approximate budget</label>
              <div className="ob3-chip-row ob3-chip-wrap">
                {BUDGETS.map(b => (
                  <button key={b.value} className={`ob3-chip${budget === b.value ? ' on' : ''}`}
                    onClick={() => setBudget(budget === b.value ? 0 : b.value)}>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="ob3-actions">
              <button className="ob3-btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="ob3-btn-primary" onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        </div>
      )
    }

    // Bride/Groom step 4: Vibe
    return (
      <div className="ob3-shell">
        <div className="ob3-card-wrap ob3-card-wide" key="bg-4">
          <div className="ob3-progress">
            <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '100%' }} /></div>
            <span className="ob3-prog-label">Step 4 of 4</span>
          </div>
          <div className="ob3-eyebrow" style={{ marginTop: 24 }}>Almost there</div>
          <h2 className="ob3-card-heading serif">What's the wedding vibe?</h2>
          <p className="ob3-card-sub">Pick any that match your dream wedding.</p>
          <div className="ob3-field" style={{ marginTop: 8 }}>
            <div className="ob3-chip-row ob3-chip-wrap">
              {VIBES.map(v => (
                <button key={v} className={`ob3-chip${vibes.includes(v) ? ' on' : ''}`}
                  onClick={() => toggleVibe(v)}>{v}</button>
              ))}
            </div>
          </div>
          <div className="ob3-actions" style={{ marginTop: 32 }}>
            <button className="ob3-btn-ghost" onClick={() => setStep(3)}>Back</button>
            <button className="ob3-btn-primary ob3-btn-finish" onClick={finish}>Start planning ✨</button>
          </div>
          <p className="ob3-skip" onClick={finish}>Skip and go to dashboard →</p>
        </div>
      </div>
    )
  }

  // ── Planner flow ──────────────────────────────────────────────
  if (isPlanner) {
    if (step === 1) {
      const canContinue = selfName.trim().length > 0
      return (
        <div className="ob3-shell">
          <div className="ob3-card-wrap" key="pl-1">
            <div className="ob3-progress">
              <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '25%' }} /></div>
              <span className="ob3-prog-label">Step 1 of 4</span>
            </div>
            <div className="ob3-eyebrow" style={{ marginTop: 24 }}>Your details</div>
            <h2 className="ob3-card-heading serif">Tell us about yourself</h2>
            <div className="ob3-fields">
              <div className="ob3-field">
                <label className="ob3-label">Your name <span className="ob3-req">*</span></label>
                <input className="ob3-input" placeholder="e.g. Kavya Sharma" value={selfName}
                  onChange={e => setSelfName(e.target.value)} autoFocus />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">Agency / Studio name <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" placeholder="e.g. Dream Weddings Co." value={agencyName}
                  onChange={e => setAgencyName(e.target.value)} />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">Work email <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" type="email" placeholder="e.g. kavya@dreamweddings.com"
                  value={workEmail} onChange={e => setWorkEmail(e.target.value)} />
              </div>
            </div>
            <div className="ob3-actions">
              <button className="ob3-btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="ob3-btn-primary" disabled={!canContinue} onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="ob3-shell">
          <div className="ob3-card-wrap" key="pl-2">
            <div className="ob3-progress">
              <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '50%' }} /></div>
              <span className="ob3-prog-label">Step 2 of 4</span>
            </div>
            <div className="ob3-eyebrow" style={{ marginTop: 24 }}>The couple</div>
            <h2 className="ob3-card-heading serif">Who are you planning for?</h2>
            <div className="ob3-fields">
              <div className="ob3-field">
                <label className="ob3-label">Bride's name <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" placeholder="e.g. Priya" value={clientBrideName}
                  onChange={e => setClientBrideName(e.target.value)} autoFocus />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">Groom's name <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" placeholder="e.g. Arjun" value={clientGroomName}
                  onChange={e => setClientGroomName(e.target.value)} />
              </div>
            </div>
            <div className="ob3-actions">
              <button className="ob3-btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="ob3-btn-primary" onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="ob3-shell">
          <div className="ob3-card-wrap ob3-card-wide" key="pl-3">
            <div className="ob3-progress">
              <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '75%' }} /></div>
              <span className="ob3-prog-label">Step 3 of 4</span>
            </div>
            <div className="ob3-eyebrow" style={{ marginTop: 24 }}>The celebration</div>
            <h2 className="ob3-card-heading serif">Events & logistics</h2>
            <div className="ob3-field" style={{ marginTop: 8 }}>
              <label className="ob3-label">Events to plan</label>
              <div className="ob3-chip-row ob3-chip-wrap" style={{ marginTop: 8 }}>
                {EVENTS_LIST.map(ev => (
                  <button key={ev} className={`ob3-chip${selectedEvents.includes(ev) ? ' on' : ''}`}
                    onClick={() => toggleSelectedEvent(ev)}>{ev}</button>
                ))}
              </div>
            </div>
            <div className="ob3-two-col" style={{ marginTop: 20 }}>
              <div className="ob3-field">
                <label className="ob3-label">Wedding date <span className="ob3-opt">(optional)</span></label>
                <input type="date" className="ob3-input" value={weddingDate}
                  onChange={e => setWeddingDate(e.target.value)} />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">City</label>
                <input className="ob3-input" placeholder="e.g. Mumbai" value={city}
                  onChange={e => setCity(e.target.value)} />
              </div>
            </div>
            <div className="ob3-two-col" style={{ marginTop: 16 }}>
              <div className="ob3-field">
                <label className="ob3-label">Venue <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" placeholder="e.g. The Leela" value={venue}
                  onChange={e => setVenue(e.target.value)} />
              </div>
              <div className="ob3-field">
                <label className="ob3-label">Guest count <span className="ob3-opt">(optional)</span></label>
                <input className="ob3-input" type="number" placeholder="e.g. 300" value={guestCount}
                  onChange={e => setGuestCount(e.target.value)} />
              </div>
            </div>
            <div className="ob3-actions">
              <button className="ob3-btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="ob3-btn-primary" onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        </div>
      )
    }

    // Planner step 4: Budget + Vibe
    return (
      <div className="ob3-shell">
        <div className="ob3-card-wrap ob3-card-wide" key="pl-4">
          <div className="ob3-progress">
            <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '100%' }} /></div>
            <span className="ob3-prog-label">Step 4 of 4</span>
          </div>
          <div className="ob3-eyebrow" style={{ marginTop: 24 }}>Almost there</div>
          <h2 className="ob3-card-heading serif">Budget & vibe</h2>
          <div className="ob3-field" style={{ marginTop: 8 }}>
            <label className="ob3-label">Total budget</label>
            <div className="ob3-chip-row ob3-chip-wrap">
              {BUDGETS.map(b => (
                <button key={b.value} className={`ob3-chip${budget === b.value ? ' on' : ''}`}
                  onClick={() => setBudget(budget === b.value ? 0 : b.value)}>{b.label}</button>
              ))}
            </div>
          </div>
          <div className="ob3-field" style={{ marginTop: 20 }}>
            <label className="ob3-label">Wedding vibe <span className="ob3-opt">(pick any)</span></label>
            <div className="ob3-chip-row ob3-chip-wrap">
              {VIBES.map(v => (
                <button key={v} className={`ob3-chip${vibes.includes(v) ? ' on' : ''}`}
                  onClick={() => toggleVibe(v)}>{v}</button>
              ))}
            </div>
          </div>
          <div className="ob3-actions" style={{ marginTop: 32 }}>
            <button className="ob3-btn-ghost" onClick={() => setStep(3)}>Back</button>
            <button className="ob3-btn-primary ob3-btn-finish" onClick={finish}>Start planning ✨</button>
          </div>
          <p className="ob3-skip" onClick={finish}>Skip and go to dashboard →</p>
        </div>
      </div>
    )
  }

  // ── Other / Family flow ───────────────────────────────────────
  if (step === 1) {
    const canContinue = selfName.trim().length > 0
    return (
      <div className="ob3-shell">
        <div className="ob3-card-wrap" key="ot-1">
          <div className="ob3-progress">
            <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '33%' }} /></div>
            <span className="ob3-prog-label">Step 1 of 3</span>
          </div>
          <div className="ob3-eyebrow" style={{ marginTop: 24 }}>About you</div>
          <h2 className="ob3-card-heading serif">Who are you?</h2>
          <div className="ob3-fields">
            <div className="ob3-field">
              <label className="ob3-label">Your name <span className="ob3-req">*</span></label>
              <input className="ob3-input" placeholder="e.g. Neha" value={selfName}
                onChange={e => setSelfName(e.target.value)} autoFocus />
            </div>
            <div className="ob3-field">
              <label className="ob3-label">Relation to the couple <span className="ob3-opt">(optional)</span></label>
              <div className="ob3-chip-row ob3-chip-wrap" style={{ marginTop: 8 }}>
                {RELATIONS.map(r => (
                  <button key={r} className={`ob3-chip${relation === r ? ' on' : ''}`}
                    onClick={() => setRelation(relation === r ? '' : r)}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="ob3-actions">
            <button className="ob3-btn-ghost" onClick={() => setStep(0)}>Back</button>
            <button className="ob3-btn-primary" disabled={!canContinue} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="ob3-shell">
        <div className="ob3-card-wrap ob3-card-wide" key="ot-2">
          <div className="ob3-progress">
            <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '66%' }} /></div>
            <span className="ob3-prog-label">Step 2 of 3</span>
          </div>
          <div className="ob3-eyebrow" style={{ marginTop: 24 }}>Your involvement</div>
          <h2 className="ob3-card-heading serif">Events & travel</h2>
          <div className="ob3-field" style={{ marginTop: 8 }}>
            <label className="ob3-label">Which events are you attending?</label>
            <div className="ob3-chip-row ob3-chip-wrap" style={{ marginTop: 8 }}>
              {EVENTS_LIST.map(ev => (
                <button key={ev} className={`ob3-chip${attendingEvents.includes(ev) ? ' on' : ''}`}
                  onClick={() => toggleAttendingEvent(ev)}>{ev}</button>
              ))}
            </div>
          </div>
          <div className="ob3-field" style={{ marginTop: 24 }}>
            <label className="ob3-label">Travelling outstation?</label>
            <div className="ob3-yn-row">
              <button className={`ob3-yn-btn${travelOutstation === true ? ' on' : ''}`}
                onClick={() => setTravelOutstation(true)}>Yes</button>
              <button className={`ob3-yn-btn${travelOutstation === false ? ' on' : ''}`}
                onClick={() => setTravelOutstation(false)}>No</button>
            </div>
          </div>
          <div className="ob3-actions">
            <button className="ob3-btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="ob3-btn-primary" onClick={() => setStep(3)}>Continue →</button>
          </div>
        </div>
      </div>
    )
  }

  // Other/Family step 3: Help areas + notif prefs
  return (
    <div className="ob3-shell">
      <div className="ob3-card-wrap ob3-card-wide" key="ot-3">
        <div className="ob3-progress">
          <div className="ob3-prog-bar"><div className="ob3-prog-fill" style={{ width: '100%' }} /></div>
          <span className="ob3-prog-label">Step 3 of 3</span>
        </div>
        <div className="ob3-eyebrow" style={{ marginTop: 24 }}>Almost done</div>
        <h2 className="ob3-card-heading serif">How can you help?</h2>
        <div className="ob3-field" style={{ marginTop: 8 }}>
          <label className="ob3-label">Areas you can help with <span className="ob3-opt">(pick any)</span></label>
          <div className="ob3-chip-row ob3-chip-wrap" style={{ marginTop: 8 }}>
            {HELP_AREAS.map(a => (
              <button key={a} className={`ob3-chip${helpAreas.includes(a) ? ' on' : ''}`}
                onClick={() => toggleHelpArea(a)}>{a}</button>
            ))}
          </div>
        </div>
        <div className="ob3-field" style={{ marginTop: 20 }}>
          <label className="ob3-label">Notification preferences <span className="ob3-opt">(pick any)</span></label>
          <div className="ob3-chip-row ob3-chip-wrap" style={{ marginTop: 8 }}>
            {NOTIF_PREFS.map(n => (
              <button key={n} className={`ob3-chip${notifPrefs.includes(n) ? ' on' : ''}`}
                onClick={() => toggleNotifPref(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className="ob3-actions" style={{ marginTop: 32 }}>
          <button className="ob3-btn-ghost" onClick={() => setStep(2)}>Back</button>
          <button className="ob3-btn-primary ob3-btn-finish" onClick={finish}>Let's go ✨</button>
        </div>
        <p className="ob3-skip" onClick={finish}>Skip and go to dashboard →</p>
      </div>
    </div>
  )
}
