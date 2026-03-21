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
    <div style={{ overflowY: 'auto', flex: 1, background: 'var(--bg)' }}>
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

      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-eyebrow">India's smartest wedding planner</div>
          <h1 className="hero-h1">
            Plan your dream wedding,<br />
            <em>without the chaos.</em>
          </h1>
          <p className="hero-sub">
            The Bride Side helps you manage guests, vendors, budget, and your entire wedding timeline — all in one beautifully organised place.
          </p>
          <div className="hero-btns">
            <button className="hero-btn-primary" onClick={handleGoogleSignIn} disabled={signingIn}>
              {signingIn ? 'Redirecting…' : 'Start Planning Free →'}
            </button>
            <button className="hero-btn-ghost" onClick={viewDemo}>
              See a live demo
            </button>
          </div>
          <div className="hero-stats">
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

      {/* Features */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 className="serif" style={{ fontSize: '34px', fontWeight: 500, marginBottom: '32px', color: 'var(--ink)' }}>
            Everything you need, <em style={{ fontStyle: 'italic', color: 'var(--rose-dark)' }}>in one place</em>
          </h2>
          <div className="g3">
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

      {/* CTA Banner */}
      <section style={{ padding: '64px 0', background: 'linear-gradient(135deg, var(--rose-dark), var(--mauve-dark))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="serif" style={{ fontSize: '36px', fontWeight: 500, color: 'white', marginBottom: '14px' }}>
            Your big day deserves perfect planning
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginBottom: '28px' }}>
            Join thousands of couples who planned their dream wedding with The Bride Side.
          </p>
          <button className="hero-btn-primary" style={{ background: 'white', color: 'var(--rose-dark)', fontSize: '15px', padding: '14px 32px' }} onClick={handleGoogleSignIn} disabled={signingIn}>
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
            Made with ❤️ for Indian weddings
          </div>
        </div>
      </footer>
    </div>
  )
}
