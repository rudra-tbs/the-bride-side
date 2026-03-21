import { useState } from 'react'
import { useAppStore } from '@/store/app'
import { signInWithGoogle } from '@/lib/supabase'
import {
  mockWedding, mockEvents, mockItinerary, mockGuests,
  mockVendors, mockBudgetCategories, mockExpenses,
  mockClCategories, mockClTasks, mockPins, mockNotes,
  MOCK_USER_ID,
} from '@/mock/data'

const FEATURES = [
  { emoji: '🗓️', color: '#FDE8EC', title: 'Smart Itinerary', desc: 'Timeline planner for every event — Mehendi, Sangeet, Wedding, Reception.' },
  { emoji: '👥', color: '#E8F4EE', title: 'Guest Management', desc: 'Track RSVPs, dietary preferences, and seating across all your events.' },
  { emoji: '🎥', color: '#FAF0E8', title: 'Vendor Tracker', desc: 'Shortlist, compare, and communicate with all your vendors in one place.' },
  { emoji: '💰', color: '#E8F0F8', title: 'Budget Control', desc: 'Category-wise budget tracking with payment status and due date alerts.' },
  { emoji: '🌸', color: '#F2E8F0', title: 'Moodboard', desc: 'Pin your vision — decor, outfits, makeup — and share with vendors.' },
  { emoji: '✅', color: '#FDE8EC', title: 'Checklist', desc: 'Timeline-driven tasks from 6 months out to the morning of your big day.' },
]

const TESTIMONIALS = [
  {
    name: 'Priya & Arjun',
    location: 'Mumbai',
    text: 'We planned our entire 3-day wedding using The Bride Side. From 400+ guests to 12 vendors — everything was organised in one place. Absolute lifesaver!',
    avatar: 'PA',
  },
  {
    name: 'Sneha & Rohan',
    location: 'Delhi',
    text: 'The budget tracker alone saved us ₹2L. We could see exactly where every rupee was going and avoided last-minute surprises.',
    avatar: 'SR',
  },
  {
    name: 'Meera & Karan',
    location: 'Bangalore',
    text: 'As a destination wedding couple, coordinating vendors across cities was a nightmare — until we found The Bride Side. The vendor tracker is brilliant.',
    avatar: 'MK',
  },
]

const DASHBOARD_FEATURES = [
  { icon: '📊', title: 'RSVP Dashboard', desc: 'Real-time guest confirmations, dietary counts, and per-event headcounts at a glance.' },
  { icon: '📅', title: 'Day-of Timeline', desc: 'Minute-by-minute itinerary for your wedding day with milestone tracking.' },
  { icon: '💳', title: 'Payment Tracker', desc: 'Track vendor payments, due dates, and remaining balances across categories.' },
  { icon: '📝', title: 'Meeting Notes', desc: 'Keep minutes of every vendor meeting and planning session organized.' },
]

export default function Landing() {
  const { setScreen, setUserId, setWedding, setEvents, setItinerary,
    setGuests, setVendors, setBudgetCategories, setExpenses,
    setClCategories, setClTasks, setPins, setNotes } = useAppStore()
  const [signingIn, setSigningIn] = useState(false)

  async function handleGoogleSignIn() {
    try {
      setSigningIn(true)
      await signInWithGoogle()
    } catch {
      setSigningIn(false)
    }
  }

  function viewDemo() {
    setUserId(MOCK_USER_ID)
    setWedding(mockWedding)
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

  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <span className="landing-logo">The Bride Side</span>
        <div className="landing-links">
          <button className="landing-link" onClick={viewDemo}>View Demo</button>
          <button className="btn btn-rose btn-sm" onClick={handleGoogleSignIn} disabled={signingIn}>
            {signingIn ? 'Redirecting…' : 'Sign in with Google'}
          </button>
        </div>
      </nav>

      {/* Hero — Centered */}
      <section className="hero-section hero-centered">
        <div className="container hero-center-container">
          <div className="hero-eyebrow">India's smartest wedding planner</div>
          <h1 className="hero-h1 hero-h1-center">
            Plan your dream wedding,<br />
            <em>without the chaos.</em>
          </h1>
          <p className="hero-sub hero-sub-center">
            The Bride Side helps you manage guests, vendors, budget, and your entire wedding timeline — all in one beautifully organised place.
          </p>
          <div className="hero-btns hero-btns-center">
            <button className="hero-btn-primary" onClick={handleGoogleSignIn} disabled={signingIn}>
              {signingIn ? 'Redirecting…' : 'Start Planning Free →'}
            </button>
            <button className="hero-btn-ghost" onClick={viewDemo}>
              See a live demo
            </button>
          </div>
          <div className="hero-stats hero-stats-center">
            <div className="hero-stat">
              <div className="hero-stat-n">12,000+</div>
              <div className="hero-stat-l">Couples planned</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">₹50Cr+</div>
              <div className="hero-stat-l">Budgets tracked</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">4.9 ★</div>
              <div className="hero-stat-l">Average rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="serif section-title">
              Your wedding command centre
            </h2>
            <p className="section-subtitle">
              Everything you need to plan, track, and manage — all in one beautiful dashboard.
            </p>
          </div>
          <div className="dashboard-preview">
            <div className="dash-preview-grid">
              {DASHBOARD_FEATURES.map(f => (
                <div className="dash-preview-card" key={f.title}>
                  <div className="dash-preview-icon">{f.icon}</div>
                  <div className="dash-preview-title">{f.title}</div>
                  <div className="dash-preview-desc">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="dash-preview-mockup">
              <div className="mockup-bar">
                <div className="mockup-dots">
                  <span /><span /><span />
                </div>
                <div className="mockup-title">Dashboard — Priya & Arjun's Wedding</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-stat-row">
                  <div className="mockup-stat">
                    <div className="mockup-stat-n">239</div>
                    <div className="mockup-stat-l">Days to go</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-n" style={{ color: 'var(--sage)' }}>87</div>
                    <div className="mockup-stat-l">Confirmed</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-n" style={{ color: 'var(--amber)' }}>24</div>
                    <div className="mockup-stat-l">Pending</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-n" style={{ color: 'var(--rose)' }}>₹18.5L</div>
                    <div className="mockup-stat-l">Budget left</div>
                  </div>
                </div>
                <div className="mockup-progress-row">
                  <div className="mockup-progress-label">Budget used</div>
                  <div className="mockup-progress-bar">
                    <div className="mockup-progress-fill" style={{ width: '42%' }} />
                  </div>
                  <div className="mockup-progress-pct">42%</div>
                </div>
                <div className="mockup-progress-row">
                  <div className="mockup-progress-label">Tasks done</div>
                  <div className="mockup-progress-bar">
                    <div className="mockup-progress-fill mockup-fill-sage" style={{ width: '68%' }} />
                  </div>
                  <div className="mockup-progress-pct">68%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section landing-section-alt">
        <div className="container">
          <div className="section-header-center">
            <h2 className="serif section-title">
              Everything you need, <em>in one place</em>
            </h2>
            <p className="section-subtitle">
              From guest lists to moodboards — six powerful tools built for Indian weddings.
            </p>
          </div>
          <div className="g3 feat-grid">
            {FEATURES.map(f => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon" style={{ background: f.color }}>
                  {f.emoji}
                </div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="serif section-title">
              Loved by couples across India
            </h2>
            <p className="section-subtitle">
              Real stories from couples who planned their dream wedding with The Bride Side.
            </p>
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map(t => (
              <div className="testimonial-card" key={t.name}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-loc">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="serif cta-title">
            Your big day deserves perfect planning
          </h2>
          <p className="cta-subtitle">
            Join thousands of couples who planned their dream wedding with The Bride Side.
          </p>
          <button className="cta-btn" onClick={handleGoogleSignIn} disabled={signingIn}>
            Start for free — no credit card needed
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="foot-logo">The Bride Side</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px' }}>
              © 2026 The Bride Side. All rights reserved.
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
            Made with love for Indian weddings
          </div>
        </div>
      </footer>
    </div>
  )
}
