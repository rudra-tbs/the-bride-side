import { useState } from 'react'
import type { ReactNode } from 'react'
import { useAppStore } from '@/store/app'
import { signOut } from '@/lib/supabase'
import type { Screen, DashTab } from '@/types'
import { initials, daysUntil, formatDate } from '@/lib/utils'

interface NavItem {
  screen: Screen
  label: string
  icon: ReactNode
}

interface DashItem {
  id: DashTab
  label: string
  icon: ReactNode
}

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

// Dashboard sub-items (no Overview — Dashboard itself is the overview)
const DASH_ITEMS: DashItem[] = [
  { id: 'itinerary', label: 'Itinerary',     icon: <Icon path="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" /> },
  { id: 'details',   label: 'Event Details', icon: <Icon path="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /> },
  { id: 'mom',       label: 'Notes',         icon: <Icon path="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" /> },
]

const NAV_ITEMS: NavItem[] = [
  { screen: 'dashboard', label: 'Dashboard', icon: <Icon path="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" /> },
  { screen: 'guests',    label: 'Guests',    icon: <Icon path="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" /> },
  { screen: 'vendors',   label: 'Vendors',   icon: <Icon path="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M1 7l3-4h16l3 4 M9 17v4 M15 17v4" /> },
  { screen: 'budget',    label: 'Budget',    icon: <Icon path="M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /> },
  { screen: 'checklist', label: 'Checklist', icon: <Icon path="M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /> },
  { screen: 'moodboard', label: 'Moodboard', icon: <Icon path="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7" /> },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const { screen, setScreen, wedding, dashTab, setDashTab, setUserId, setWedding } = useAppStore()
  const [open, setOpen] = useState(true)

  const coupleName = wedding?.couple_name ?? 'Your Wedding'
  const selfName   = wedding?.self_name ?? 'Bride'
  const days = wedding ? Math.max(0, daysUntil(wedding.wedding_date)) : 0
  const offset = 314 * (1 - Math.min(1, Math.max(0, (365 - days) / 365)))
  const ringColor = days <= 30 ? 'var(--rose)' : days <= 90 ? 'var(--amber)' : 'var(--sage)'

  return (
    <div className={`app-shell${open ? '' : ' sidebar-closed'}`}>

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <header className="app-topbar">
        <div className="topbar-logo-zone">
          <span className="logo">
            <span className="logo-mark">🌸</span>
            <span className="logo-text">The Bride Side</span>
          </span>
          <button className="sidebar-toggle" onClick={() => setOpen(o => !o)} title={open ? 'Collapse sidebar' : 'Expand sidebar'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              {open
                ? <path d="M15 18l-6-6 6-6" />
                : <path d="M9 18l6-6-6-6" />
              }
            </svg>
          </button>
        </div>
        <nav className="topbar-nav" />
        <div className="topbar-right">
          <button
            className="topbar-search-btn"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="topbar-notif" title="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          <div className="topbar-user">
            <div className="user-avatar">{initials(selfName)}</div>
            <div>
              <div className="user-name">{selfName}</div>
              <div className="user-email">{coupleName}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-inner">

          {/* Countdown ring card */}
          {wedding && (
            <div className="sb-countdown-card">
              <div className={`sb-countdown-ring-wrap${days <= 30 ? ' urgent' : ''}`}>
                <svg className="sb-countdown-svg" viewBox="0 0 108 108">
                  {/* Decorative outer tick ring */}
                  <circle cx="54" cy="54" r="51" fill="none" stroke="rgba(232,116,138,0.12)" strokeWidth="1.5" strokeDasharray="2.5 6.5" strokeLinecap="round" />
                  <circle className="sb-countdown-track" cx="54" cy="54" r="46" />
                  <circle className="sb-countdown-progress" cx="54" cy="54" r="46"
                    style={{ strokeDashoffset: offset, stroke: ringColor }} />
                </svg>
                <div className="sb-countdown-centre">
                  <div className="sb-countdown-num">{days}</div>
                  <div className="sb-countdown-unit">days to go</div>
                </div>
              </div>
              <div className="sb-countdown-names">{coupleName}</div>
              <div className="sb-countdown-date">{formatDate(wedding.wedding_date, 'd MMM yyyy')}</div>
              <div className="sb-countdown-ornament" />
              <div className="sb-countdown-venue">
                <svg viewBox="0 0 24 24" fill="currentColor" className="sb-venue-pin"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {wedding.venue}
              </div>
              <div className="sb-countdown-stats">
                <div className="sb-countdown-stat">
                  <span className="sb-countdown-stat-n">{Math.floor(days / 7)}</span>
                  <span className="sb-countdown-stat-l">wks</span>
                </div>
                <div className="sb-countdown-stat-div" />
                <div className="sb-countdown-stat">
                  <span className="sb-countdown-stat-n">{Math.floor(days / 30)}</span>
                  <span className="sb-countdown-stat-l">mo</span>
                </div>
              </div>
            </div>
          )}

          {/* Main nav */}
          <div className="sidebar-section">
            <div className="sidebar-label">Planning</div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.screen}
                className={`sb-item${screen === item.screen && (item.screen !== 'dashboard' || dashTab === 'guest') ? ' active' : ''}`}
                onClick={() => { setScreen(item.screen); if (item.screen === 'dashboard') setDashTab('guest') }}
              >
                <span className="sb-item-icon">{item.icon}</span>
                <span className="sb-item-label">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Dashboard sub-nav — always visible when wedding data exists */}
          {!!wedding && (
            <div className="sb-sub-section">
              {DASH_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`sb-item${screen === 'dashboard' && dashTab === item.id ? ' active' : ''}`}
                  onClick={() => { setScreen('dashboard'); setDashTab(item.id) }}
                >
                  <span className="sb-item-icon">{item.icon}</span>
                  <span className="sb-item-label">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sign out */}
          <div className="sb-bottom">
            <button className="sb-item sb-signout" onClick={() => { signOut(); setUserId(null); setWedding(null); setScreen('landing') }}>
              <span className="sb-item-icon">
                <Icon path="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
              </span>
              <span className="sb-item-label">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="main-wrapper">
        <div key={screen} className="page-enter" style={{ height: '100%' }}>
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.screen}
            className={`mob-nav-item${screen === item.screen ? ' active' : ''}`}
            onClick={() => setScreen(item.screen)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
