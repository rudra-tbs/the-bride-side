import { useState, useRef, useEffect } from 'react'
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


export default function Landing() {
  const { setScreen, setUserId, setWedding, setEvents, setItinerary,
    setGuests, setVendors, setBudgetCategories, setExpenses,
    setClCategories, setClTasks, setPins, setNotes } = useAppStore()
  const [signingIn, setSigningIn] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />
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
      <section className="app-preview-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="serif section-title">
              Your wedding command centre
            </h2>
            <p className="section-subtitle">
              Everything you need to plan, track, and manage — all in one beautiful dashboard.
            </p>
          </div>
        </div>

        {/* Animated app mockup */}
        <div className="app-preview-outer" ref={previewRef}>
          <div className="app-preview-float">
            <div className="preview-browser">
              {/* Browser chrome */}
              <div className="preview-browser-bar">
                <div className="preview-dots"><span /><span /><span /></div>
                <div className="preview-address-bar">thebrideside.app/dashboard</div>
              </div>

              {/* App UI */}
              <div className="preview-app-ui">
                {/* Topbar */}
                <div className="preview-topbar">
                  <div className="preview-topbar-logo">The Bride Side</div>
                  <div className="preview-topbar-right">
                    <div className="preview-notif">🔔</div>
                    <div className="preview-userav">PA</div>
                  </div>
                </div>

                {/* App body */}
                <div className="preview-app-body">
                  {/* Sidebar */}
                  <div className="preview-sidebar">
                    <div className="preview-sb active">📊 Dashboard</div>
                    <div className="preview-sb">👥 Guests</div>
                    <div className="preview-sb">🎥 Vendors</div>
                    <div className="preview-sb">💰 Budget</div>
                    <div className="preview-sb">✅ Checklist</div>
                    <div className="preview-sb">🌸 Moodboard</div>
                  </div>

                  {/* Main content */}
                  <div className="preview-main">
                    <div className="preview-page-head">
                      <div className="preview-page-title">Priya &amp; Arjun's Wedding</div>
                      <div className="preview-page-date">Tuesday, 2 December 2026</div>
                    </div>

                    {/* Stat tiles */}
                    <div className="preview-tiles">
                      <div className="preview-tile preview-tile-rose">
                        <div className="preview-tile-n">239</div>
                        <div className="preview-tile-l">Days to go</div>
                      </div>
                      <div className="preview-tile preview-tile-sage">
                        <div className="preview-tile-n">87</div>
                        <div className="preview-tile-l">Confirmed</div>
                      </div>
                      <div className="preview-tile preview-tile-amber">
                        <div className="preview-tile-n">₹18.5L</div>
                        <div className="preview-tile-l">Budget left</div>
                      </div>
                      <div className="preview-tile preview-tile-mauve">
                        <div className="preview-tile-n">68%</div>
                        <div className="preview-tile-l">Tasks done</div>
                      </div>
                    </div>

                    {/* Content grid */}
                    <div className="preview-content-grid">
                      {/* Tasks */}
                      <div className="preview-card">
                        <div className="preview-card-title">Pending Tasks</div>
                        <div className="preview-task-list">
                          <div className="preview-task"><span className="preview-check" />Book final photographer</div>
                          <div className="preview-task"><span className="preview-check" />Order wedding cake</div>
                          <div className="preview-task"><span className="preview-check" />Send Mehendi invites</div>
                          <div className="preview-task done-task"><span className="preview-check done" />Finalise venue décor</div>
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="preview-card">
                        <div className="preview-card-title">Recent RSVPs</div>
                        <div className="preview-guest-list">
                          <div className="preview-guest">
                            <div className="preview-gav">RS</div>
                            <div className="preview-ginfo">
                              <div className="preview-gname">Riya Sharma</div>
                              <div className="preview-gevents">Wedding · Reception</div>
                            </div>
                            <div className="preview-gbadge conf">Confirmed</div>
                          </div>
                          <div className="preview-guest">
                            <div className="preview-gav">AK</div>
                            <div className="preview-ginfo">
                              <div className="preview-gname">Aarav Kapoor</div>
                              <div className="preview-gevents">All events</div>
                            </div>
                            <div className="preview-gbadge pend">Pending</div>
                          </div>
                          <div className="preview-guest">
                            <div className="preview-gav">MP</div>
                            <div className="preview-ginfo">
                              <div className="preview-gname">Meera Patel</div>
                              <div className="preview-gevents">Sangeet · Wedding</div>
                            </div>
                            <div className="preview-gbadge conf">Confirmed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
