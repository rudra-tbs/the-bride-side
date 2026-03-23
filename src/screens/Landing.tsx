import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h4M8 18h.01M12 18h4"/></svg>,
    accent: '#E8748A', iconBg: 'rgba(232,116,138,0.1)', tag: 'Planning',
    title: 'Smart Itinerary', desc: 'Timeline planner for every event — Mehendi, Sangeet, Wedding, Reception.',
    preview: [
      { label: 'Mehendi · 14 Nov', dot: '#C898B8' },
      { label: 'Sangeet · 15 Nov', dot: '#7AAA90' },
      { label: 'Wedding · 16 Nov', dot: '#E8748A', active: true },
    ],
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    accent: '#7AAA90', iconBg: 'rgba(122,170,144,0.12)', tag: 'Guests',
    title: 'Guest Management', desc: 'Track RSVPs, dietary preferences, and seating across all your events.',
    preview: null,
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7" strokeWidth={2.5}/></svg>,
    accent: '#D4956A', iconBg: 'rgba(212,149,106,0.1)', tag: 'Vendors',
    title: 'Vendor Tracker', desc: 'Shortlist, compare, and communicate with all your vendors in one place.',
    preview: null,
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    accent: '#7098B8', iconBg: 'rgba(112,152,184,0.12)', tag: 'Finance',
    title: 'Budget Control', desc: 'Category-wise budget tracking with payment status and due date alerts.',
    preview: null,
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>,
    accent: '#A06080', iconBg: 'rgba(160,96,128,0.1)', tag: 'Vision',
    title: 'Moodboard', desc: 'Pin your vision — decor, outfits, makeup — and share with vendors.',
    preview: null,
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    accent: '#E8748A', iconBg: 'rgba(232,116,138,0.12)', tag: 'Tasks',
    title: 'Checklist', desc: 'Timeline-driven tasks from 6 months out to the morning of your big day.',
    preview: null,
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya & Arjun',
    location: 'Mumbai',
    text: 'We planned our entire 3-day wedding using The Bride Side. From 400+ guests to 12 vendors — everything was organised in one place. Absolute lifesaver!',
    avatar: 'PA',
    photo: '/axm-2-44.jpg',
  },
  {
    name: 'Sneha & Rohan',
    location: 'Delhi',
    text: 'The budget tracker alone saved us ₹2L. We could see exactly where every rupee was going and avoided last-minute surprises.',
    avatar: 'SR',
    photo: '/axm-2-71.jpg',
  },
  {
    name: 'Meera & Karan',
    location: 'Bangalore',
    text: 'As a destination wedding couple, coordinating vendors across cities was a nightmare — until we found The Bride Side. The vendor tracker is brilliant.',
    avatar: 'MK',
    photo: '/axm-2-142.jpg',
  },
]


export default function Landing() {
  const { setScreen } = useAppStore()
  const pageRef = useRef<HTMLDivElement>(null)
  const scrollSceneRef = useRef<HTMLElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const previewLayerRef = useRef<HTMLDivElement>(null)
  const [activeTest, setActiveTest] = useState(0)
  const centerCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    const scene = scrollSceneRef.current
    const text = textLayerRef.current
    const preview = previewLayerRef.current
    if (!page || !scene || !text || !preview) return

    function update() {
      const rect = scene!.getBoundingClientRect()
      const scrolled = -rect.top
      const total = scene!.offsetHeight - page!.clientHeight
      if (total <= 0) return
      const p = Math.max(0, Math.min(1, scrolled / total))

      // Text fades out and slides up in the first 40% of scroll distance
      const tp = Math.min(1, p / 0.4)
      text!.style.opacity = String(1 - tp)
      text!.style.transform = `translateY(${-tp * 60}px)`

      // Preview rises, scales up, and perspective-flattens across the full scroll
      const scale = 0.7 + 0.3 * p
      const ty = 200 * (1 - p)
      const rx = 14 * (1 - p)
      preview!.style.opacity = String(0.3 + 0.7 * p)
      preview!.style.transform =
        `translateX(-50%) perspective(1200px) translateY(${ty}px) scale(${scale}) rotateX(${rx}deg)`
    }

    // .landing-page has overflow-y:auto — scroll fires on it, not window
    page.addEventListener('scroll', update, { passive: true })
    update()
    return () => page.removeEventListener('scroll', update)
  }, [])

  function resetCenterTilt() {
    const card = centerCardRef.current
    if (!card) return
    card.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    const glare = card.querySelector('.t-glare') as HTMLElement | null
    if (glare) glare.style.background = 'transparent'
  }

  useEffect(() => {
    const t = setInterval(() => {
      resetCenterTilt()
      setActiveTest(i => (i + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  function handleGoogleSignIn() {
    setScreen('onboarding')
  }

  function goTo(i: number) {
    resetCenterTilt()
    setActiveTest(i)
  }

  function getPos(i: number): 'left' | 'center' | 'right' {
    if (i === activeTest) return 'center'
    if (i === (activeTest + 1) % TESTIMONIALS.length) return 'right'
    return 'left'
  }

  // Tracks mouse anywhere in the stage — tilt follows even outside the card
  function handleStageMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = centerCardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    const x = clamp((e.clientX - cx) / (rect.width / 2), -1.5, 1.5)
    const y = clamp((e.clientY - cy) / (rect.height / 2), -1.5, 1.5)
    card.style.transition = 'transform 0.08s ease-out'
    card.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) scale3d(1.03,1.03,1.03)`
    const glareX = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
    const glareY = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100)
    const glare = card.querySelector('.t-glare') as HTMLElement | null
    if (glare) glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, transparent 65%)`
  }

  function handleStageMouseLeave() {
    resetCenterTilt()
  }

  // Clicking left half of stage → prev, right half → next
  function handleStageClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    if (e.clientX < cx) {
      goTo((activeTest - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
    } else {
      goTo((activeTest + 1) % TESTIMONIALS.length)
    }
  }

  return (
    <div className="landing-page" ref={pageRef}>
      {/* Nav */}
      <nav className="landing-nav">
        <span className="landing-logo">
          <span className="landing-logo-mark" aria-hidden="true">💍</span>
          The Bride Side
        </span>
        <div className="landing-links">
          <button className="landing-nav-cta" onClick={handleGoogleSignIn} disabled={false}>
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero + Dashboard Preview — Apple-style scroll scene */}
      <section className="hero-scroll-scene" ref={scrollSceneRef}>
        <div className="hero-sticky">
          <div className="hero-blob hero-blob-1" aria-hidden="true" />
          <div className="hero-blob hero-blob-2" aria-hidden="true" />

          {/* Floating decorative elements */}
          <div className="hero-deco-layer" aria-hidden="true">
            {/* Ring — top left */}
            <svg className="hd hd-1" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="19" stroke="rgba(232,116,138,0.38)" strokeWidth="2.5"/><circle cx="22" cy="22" r="12" stroke="rgba(232,116,138,0.18)" strokeWidth="1.5"/></svg>
            {/* Diamond gem — top right */}
            <svg className="hd hd-2" viewBox="0 0 34 34" fill="none"><path d="M17 2 L32 13 L17 32 L2 13 Z" stroke="rgba(196,85,112,0.38)" strokeWidth="1.5"/><path d="M17 9 L25 14 L17 24 L9 14 Z" fill="rgba(232,116,138,0.14)"/></svg>
            {/* Flower — left */}
            <svg className="hd hd-3" viewBox="0 0 40 40" fill="none"><g transform="translate(20,20)"><ellipse cx="0" cy="-10" rx="5" ry="8" fill="rgba(244,184,194,0.5)"/><ellipse cx="0" cy="-10" rx="5" ry="8" fill="rgba(244,184,194,0.5)" transform="rotate(60)"/><ellipse cx="0" cy="-10" rx="5" ry="8" fill="rgba(244,184,194,0.5)" transform="rotate(120)"/><ellipse cx="0" cy="-10" rx="5" ry="8" fill="rgba(244,184,194,0.5)" transform="rotate(180)"/><ellipse cx="0" cy="-10" rx="5" ry="8" fill="rgba(244,184,194,0.5)" transform="rotate(240)"/><ellipse cx="0" cy="-10" rx="5" ry="8" fill="rgba(244,184,194,0.5)" transform="rotate(300)"/><circle cx="0" cy="0" r="5" fill="rgba(232,116,138,0.5)"/></g></svg>
            {/* Sparkle ✦ — right */}
            <svg className="hd hd-4" viewBox="0 0 28 28" fill="none"><path d="M14 2 L15.8 12.2 L26 14 L15.8 15.8 L14 26 L12.2 15.8 L2 14 L12.2 12.2 Z" fill="rgba(232,116,138,0.45)"/></svg>
            {/* Small ring — bottom left */}
            <svg className="hd hd-5" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="rgba(160,96,128,0.32)" strokeWidth="2"/></svg>
            {/* Dot cluster — right */}
            <svg className="hd hd-6" viewBox="0 0 36 24" fill="none"><circle cx="6" cy="12" r="4" fill="rgba(232,116,138,0.38)"/><circle cx="18" cy="5" r="2.5" fill="rgba(244,184,194,0.5)"/><circle cx="30" cy="14" r="4.5" fill="rgba(232,116,138,0.26)"/><circle cx="17" cy="19" r="2" fill="rgba(196,85,112,0.32)"/></svg>
            {/* Heart — lower left */}
            <svg className="hd hd-7" viewBox="0 0 28 26" fill="none"><path d="M14 23 C14 23 2 15 2 8 C2 4.7 4.7 2 8 2 C10.3 2 12.3 3.3 14 5.3 C15.7 3.3 17.7 2 20 2 C23.3 2 26 4.7 26 8 C26 15 14 23 14 23Z" fill="rgba(232,116,138,0.32)"/></svg>
            {/* Diamond small — upper left */}
            <svg className="hd hd-8" viewBox="0 0 22 22" fill="none"><path d="M11 1 L21 11 L11 21 L1 11 Z" stroke="rgba(244,184,194,0.55)" strokeWidth="1.5"/></svg>
          </div>

          {/* Text layer — fades & slides up as you scroll */}
          <div className="hero-text-layer" ref={textLayerRef}>
            <div className="container hero-center-container">
              <div className="hero-eyebrow">Curated with <span className="hero-eyebrow-heart">❤️</span> in India</div>
              <h1 className="hero-h1 hero-h1-center">
                Your dream wedding,<br />
                <em>beautifully organised.</em>
              </h1>
              <p className="hero-sub hero-sub-center">
                Guests, vendors, budget, timeline — everything for your big day in one place. Built for the magic and madness of Indian weddings.
              </p>
              <div className="hero-btns hero-btns-center">
                <button className="hero-btn-primary" onClick={handleGoogleSignIn} disabled={false}>
                  Start planning →
                </button>
                <p className="hero-btn-note">Free forever · No card needed</p>
              </div>
              <div className="hero-trust">
                <div className="hero-trust-item">
                  <strong>12,000+</strong> couples planned
                </div>
                <div className="hero-trust-dot" aria-hidden="true" />
                <div className="hero-trust-item">
                  <strong>₹50Cr+</strong> budgets tracked
                </div>
                <div className="hero-trust-dot" aria-hidden="true" />
                <div className="hero-trust-item">
                  <strong>4.9 ★</strong> average rating
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="hero-scroll-cue" aria-hidden="true">
            <span>Scroll to explore</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          {/* Preview layer — rises & scales up as you scroll */}
          <div className="hero-preview-layer" ref={previewLayerRef}>
            <div className="preview-browser">
              <div className="preview-browser-bar">
                <div className="preview-dots"><span /><span /><span /></div>
                <div className="preview-address-bar">thebrideside.app/dashboard</div>
              </div>
              <div className="preview-app-ui">

                {/* ── Topbar ── */}
                <header className="preview-topbar">
                  <div className="preview-logo-zone">
                    <span className="preview-logo">
                      <span>🌸</span>
                      <span className="preview-logo-text">The Bride Side</span>
                    </span>
                    <div className="preview-toggle-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div className="preview-topbar-right">
                    <div className="preview-search-pill">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                      <span>Search</span>
                      <kbd className="preview-kbd">⌘K</kbd>
                    </div>
                    <div className="preview-notif-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
                      <span className="preview-notif-dot" />
                    </div>
                    <div className="preview-user-row">
                      <div className="preview-user-av">PA</div>
                      <div>
                        <div className="preview-user-name">Priya</div>
                        <div className="preview-user-sub">Priya &amp; Arjun</div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* ── Body ── */}
                <div className="preview-app-body">

                  {/* ── Sidebar ── */}
                  <aside className="preview-sidebar">
                    <div className="preview-sidebar-inner">

                      {/* Countdown card */}
                      <div className="preview-countdown-card">
                        <div className="preview-ring-wrap">
                          <svg className="preview-ring-svg" viewBox="0 0 108 108">
                            <circle className="preview-ring-track" cx="54" cy="54" r="46"/>
                            <circle className="preview-ring-fill" cx="54" cy="54" r="46" style={{ strokeDashoffset: 205, stroke: 'var(--sage)' }}/>
                          </svg>
                          <div className="preview-ring-centre">
                            <div className="preview-ring-num">238</div>
                            <div className="preview-ring-unit">days</div>
                          </div>
                        </div>
                        <div className="preview-cd-names">Priya &amp; Arjun</div>
                        <div className="preview-cd-date">15 Nov 2026</div>
                        <div className="preview-cd-venue">📍 Grand Hyatt Mumbai</div>
                        <div className="preview-cd-stats">
                          <div className="preview-cd-stat"><span className="preview-cd-n">34</span><span className="preview-cd-l">wks</span></div>
                          <div className="preview-cd-div"/>
                          <div className="preview-cd-stat"><span className="preview-cd-n">7</span><span className="preview-cd-l">mo</span></div>
                        </div>
                      </div>

                      {/* Planning section */}
                      <div className="preview-sb-label">Planning</div>

                      <div className="preview-sb-item preview-sb-active">
                        <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
                        <span>Dashboard</span>
                      </div>
                      <div className="preview-sb-item">
                        <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></span>
                        <span>Guests</span>
                      </div>
                      <div className="preview-sb-item">
                        <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM1 7l3-4h16l3 4M9 17v4M15 17v4"/></svg></span>
                        <span>Vendors</span>
                      </div>
                      <div className="preview-sb-item">
                        <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></span>
                        <span>Budget</span>
                      </div>
                      <div className="preview-sb-item">
                        <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></span>
                        <span>Checklist</span>
                      </div>
                      <div className="preview-sb-item">
                        <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg></span>
                        <span>Moodboard</span>
                      </div>

                      {/* Dashboard sub-nav */}
                      <div className="preview-sb-sub">
                        <div className="preview-sb-item preview-sb-sub-item">
                          <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg></span>
                          <span>Itinerary</span>
                        </div>
                        <div className="preview-sb-item preview-sb-sub-item">
                          <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg></span>
                          <span>Event Details</span>
                        </div>
                        <div className="preview-sb-item preview-sb-sub-item">
                          <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></span>
                          <span>Notes</span>
                        </div>
                      </div>

                      {/* Sign out */}
                      <div className="preview-sb-bottom">
                        <div className="preview-sb-item preview-sb-signout">
                          <span className="preview-sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg></span>
                          <span>Sign Out</span>
                        </div>
                      </div>

                    </div>
                  </aside>

                  {/* ── Main content ── */}
                  <div className="preview-main">
                    <div className="preview-page-head">
                      <div className="preview-page-title">Priya &amp; Arjun's Wedding</div>
                      <div className="preview-page-date">Saturday, 15 November 2026</div>
                    </div>

                    {/* 6 stat tiles */}
                    <div className="preview-tiles">
                      <div className="preview-tile preview-tile-rose">
                        <div className="preview-tile-n">124</div>
                        <div className="preview-tile-l">Total Guests</div>
                      </div>
                      <div className="preview-tile preview-tile-sage">
                        <div className="preview-tile-n">87</div>
                        <div className="preview-tile-l">Confirmed</div>
                      </div>
                      <div className="preview-tile preview-tile-amber">
                        <div className="preview-tile-n">28</div>
                        <div className="preview-tile-l">Awaiting RSVP</div>
                      </div>
                      <div className="preview-tile preview-tile-pink">
                        <div className="preview-tile-n">9</div>
                        <div className="preview-tile-l">Declined</div>
                      </div>
                      <div className="preview-tile preview-tile-mauve">
                        <div className="preview-tile-n">₹8.4L</div>
                        <div className="preview-tile-l">Budget Used</div>
                      </div>
                      <div className="preview-tile preview-tile-sage2">
                        <div className="preview-tile-n">14/21</div>
                        <div className="preview-tile-l">Tasks Done</div>
                      </div>
                    </div>

                    {/* Two-column content grid */}
                    <div className="preview-content-grid">

                      {/* Left column */}
                      <div className="preview-left-col">
                        <div className="preview-card preview-headcount-card">
                          <div className="preview-headcount-big">98</div>
                          <div className="preview-headcount-divider" />
                          <div className="preview-headcount-sub">final headcount · ₹3.4L est. per head</div>
                        </div>
                        <div className="preview-card">
                          <div className="preview-card-row-between">
                            <div className="preview-card-title" style={{ marginBottom: 0 }}>Budget Snapshot</div>
                            <span className="preview-pct-label" style={{ color: 'var(--sage)' }}>34%</span>
                          </div>
                          <div className="preview-card-row-between" style={{ marginTop: '5px' }}>
                            <span className="preview-big-num">₹8.4L</span>
                            <span className="preview-of-label">of ₹25L</span>
                          </div>
                          <div className="preview-prog-bar">
                            <div className="preview-prog-fill" style={{ width: '34%', background: 'var(--sage)' }} />
                          </div>
                          <div className="preview-sub-label">₹16.6L remaining</div>
                        </div>
                        <div className="preview-card">
                          <div className="preview-card-title">Vendor Pipeline</div>
                          <div className="preview-vend-grid">
                            <div className="preview-vend-cell" style={{ background: 'var(--sage-light)' }}>
                              <div className="preview-vend-n" style={{ color: 'var(--sage)' }}>3</div>
                              <div className="preview-vend-l">Booked</div>
                            </div>
                            <div className="preview-vend-cell" style={{ background: 'var(--amber-light)' }}>
                              <div className="preview-vend-n" style={{ color: 'var(--amber)' }}>2</div>
                              <div className="preview-vend-l">In Progress</div>
                            </div>
                            <div className="preview-vend-cell" style={{ background: 'var(--surface2)' }}>
                              <div className="preview-vend-n" style={{ color: 'var(--ink2)' }}>3</div>
                              <div className="preview-vend-l">Saved</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right column — tasks */}
                      <div className="preview-card">
                        <div className="preview-card-row-between" style={{ marginBottom: '5px' }}>
                          <div className="preview-card-title" style={{ marginBottom: 0 }}>Upcoming Tasks</div>
                          <span className="preview-pct-label">67%</span>
                        </div>
                        <div className="preview-prog-bar" style={{ marginBottom: '9px' }}>
                          <div className="preview-prog-fill" style={{ width: '67%', background: 'var(--sage)' }} />
                        </div>
                        <div className="preview-task-list">
                          <div className="preview-task"><span className="preview-check" />Book final venue décor</div>
                          <div className="preview-task"><span className="preview-check" />Send Mehendi invites</div>
                          <div className="preview-task"><span className="preview-check" />Confirm catering menu</div>
                          <div className="preview-task done-task"><span className="preview-check done" />Book photographer</div>
                          <div className="preview-task done-task"><span className="preview-check done" />Finalise guest list</div>
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
            <div className="section-eyebrow">The Toolkit</div>
            <h2 className="serif section-title">
              Everything you need, <em>in one place</em>
            </h2>
            <p className="section-subtitle">
              Six powerful tools purpose-built for the scale and beauty of Indian weddings.
            </p>
          </div>
          <div className="feat-grid">
            {FEATURES.map(f => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon-badge" style={{ background: f.iconBg, color: f.accent } as React.CSSProperties}>
                  {f.icon}
                </div>
                <div className="feat-body">
                  <span className="feat-tag" style={{ color: f.accent } as React.CSSProperties}>{f.tag}</span>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-eyebrow">Testimonials</div>
            <h2 className="serif section-title">
              Loved by couples across India
            </h2>
            <p className="section-subtitle">
              Real stories from couples who planned their dream wedding with The Bride Side.
            </p>
          </div>
          <div className="t-stage-outer" onMouseMove={handleStageMouseMove} onMouseLeave={handleStageMouseLeave} onClick={handleStageClick}>
            <div className="t-stage">
              {TESTIMONIALS.map((t, i) => {
                const pos = getPos(i)
                return (
                  <div
                    key={t.name}
                    className={`t-positioner t-pos-${pos}`}
                    onClick={(e) => { if (pos !== 'center') { e.stopPropagation(); goTo(i) } }}
                  >
                    <div
                      className="testimonial-card"
                      ref={pos === 'center' ? centerCardRef : undefined}
                    >
                      <div className="t-card-photo" style={{ backgroundImage: `url(${t.photo})` }} />
                      <div className="t-card-scrim" />
                      <div className="t-glare" aria-hidden="true" />
                      <div className="t-card-content">
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
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${i === activeTest ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta">
        <div className="container landing-cta-inner">
          <div className="cta-badge">Free to get started</div>
          <h2 className="serif cta-title">
            Your big day deserves<br />perfect planning
          </h2>
          <p className="cta-subtitle">
            Join thousands of couples who turned wedding chaos into calm with The Bride Side.
          </p>
          <button className="cta-btn" onClick={handleGoogleSignIn} disabled={false}>
            Start planning — it's free
          </button>
          <div className="cta-note">No credit card needed · Setup in 2 minutes</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container foot-inner">
          <div className="foot-top">
            <div className="foot-brand">
              <div className="foot-logo">The Bride Side</div>
              <p className="foot-tagline">Your all-in-one planner for the perfect Indian wedding.</p>
            </div>
            <div className="foot-links">
              <span className="foot-link-head">Product</span>
              <a className="foot-link" onClick={handleGoogleSignIn}>Get started</a>
              <a className="foot-link" onClick={handleGoogleSignIn}>Sign in</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span className="foot-copy">© 2026 The Bride Side. All rights reserved.</span>
            <span className="foot-love">Made with love for Indian weddings ♡</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
