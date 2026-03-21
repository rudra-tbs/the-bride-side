import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'

const FEATURES = [
  { emoji: '🗒️', color: '#FDE8EC', title: 'Smart Itinerary', desc: 'Timeline planner for every event — Mehendi, Sangeet, Wedding, Reception.' },
  { emoji: '🎟️', color: '#E8F4EE', title: 'Guest Management', desc: 'Track RSVPs, dietary preferences, and seating across all your events.' },
  { emoji: '🤝', color: '#FAF0E8', title: 'Vendor Tracker', desc: 'Shortlist, compare, and communicate with all your vendors in one place.' },
  { emoji: '📊', color: '#E8F0F8', title: 'Budget Control', desc: 'Category-wise budget tracking with payment status and due date alerts.' },
  { emoji: '🎨', color: '#F2E8F0', title: 'Moodboard', desc: 'Pin your vision — decor, outfits, makeup — and share with vendors.' },
  { emoji: '🔖', color: '#FDE8EC', title: 'Checklist', desc: 'Timeline-driven tasks from 6 months out to the morning of your big day.' },
]

const TESTIMONIALS = [
  {
    name: 'Priya & Arjun',
    location: 'Mumbai',
    text: 'We planned our entire 3-day wedding using The Bride Side. From 400+ guests to 12 vendors — everything was organised in one place. Absolute lifesaver!',
    avatar: 'PA',
    photo: 'https://picsum.photos/seed/reception-lights/800/480',
  },
  {
    name: 'Sneha & Rohan',
    location: 'Delhi',
    text: 'The budget tracker alone saved us ₹2L. We could see exactly where every rupee was going and avoided last-minute surprises.',
    avatar: 'SR',
    photo: 'https://picsum.photos/seed/ceremony-florals/800/480',
  },
  {
    name: 'Meera & Karan',
    location: 'Bangalore',
    text: 'As a destination wedding couple, coordinating vendors across cities was a nightmare — until we found The Bride Side. The vendor tracker is brilliant.',
    avatar: 'MK',
    photo: 'https://picsum.photos/seed/garden-venue-warm/800/480',
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

  function resetCenterTilt() {
    const card = centerCardRef.current
    if (!card) return
    card.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    const glare = card.querySelector('.t-glare') as HTMLElement | null
    if (glare) glare.style.background = 'transparent'
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

          {/* Text layer — fades & slides up as you scroll */}
          <div className="hero-text-layer" ref={textLayerRef}>
            <div className="container hero-center-container">
              <div className="hero-eyebrow">Made for Indian weddings</div>
              <h1 className="hero-h1 hero-h1-center">
                Your dream wedding,<br />
                <em>beautifully organised.</em>
              </h1>
              <p className="hero-sub hero-sub-center">
                Guests, vendors, budget, timeline — everything for your big day in one place. Built for the magic and madness of Indian weddings.
              </p>
              <div className="hero-btns hero-btns-center">
                <button className="hero-btn-primary" onClick={handleGoogleSignIn} disabled={false}>
                  Start planning free →
                </button>
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
                <div className="preview-topbar">
                  <div className="preview-topbar-logo">The Bride Side</div>
                  <div className="preview-topbar-right">
                    <div className="preview-notif">🔔</div>
                    <div className="preview-userav">PA</div>
                  </div>
                </div>
                <div className="preview-app-body">
                  <div className="preview-sidebar">
                    <div className="preview-sb active">📊 Dashboard</div>
                    <div className="preview-sb">👥 Guests</div>
                    <div className="preview-sb">🎥 Vendors</div>
                    <div className="preview-sb">💰 Budget</div>
                    <div className="preview-sb">✅ Checklist</div>
                    <div className="preview-sb">🌸 Moodboard</div>
                  </div>
                  <div className="preview-main">
                    <div className="preview-page-head">
                      <div className="preview-page-title">Priya &amp; Arjun's Wedding</div>
                      <div className="preview-page-date">Tuesday, 2 December 2026</div>
                    </div>
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
                    <div className="preview-content-grid">
                      <div className="preview-card">
                        <div className="preview-card-title">Pending Tasks</div>
                        <div className="preview-task-list">
                          <div className="preview-task"><span className="preview-check" />Book final photographer</div>
                          <div className="preview-task"><span className="preview-check" />Order wedding cake</div>
                          <div className="preview-task"><span className="preview-check" />Send Mehendi invites</div>
                          <div className="preview-task done-task"><span className="preview-check done" />Finalise venue décor</div>
                        </div>
                      </div>
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
            <div className="section-eyebrow">Features</div>
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
            <div className="section-eyebrow">Testimonials</div>
            <h2 className="serif section-title">
              Loved by couples across India
            </h2>
            <p className="section-subtitle">
              Real stories from couples who planned their dream wedding with The Bride Side.
            </p>
          </div>
          <div className="t-stage-outer" onMouseMove={handleStageMouseMove} onMouseLeave={handleStageMouseLeave}>
            <div className="t-stage">
              {TESTIMONIALS.map((t, i) => {
                const pos = getPos(i)
                return (
                  <div
                    key={t.name}
                    className={`t-positioner t-pos-${pos}`}
                    onClick={() => pos !== 'center' && goTo(i)}
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
                      {pos === 'center' && (
                        <>
                          <button
                            className="t-nav-zone t-nav-prev"
                            onClick={() => goTo((activeTest - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                            aria-label="Previous testimonial"
                          />
                          <button
                            className="t-nav-zone t-nav-next"
                            onClick={() => goTo((activeTest + 1) % TESTIMONIALS.length)}
                            aria-label="Next testimonial"
                          />
                        </>
                      )}
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
