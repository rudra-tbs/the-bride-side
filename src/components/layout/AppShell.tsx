import type { ReactNode } from 'react'
import { useAppStore } from '@/store/app'
import { signOut } from '@/lib/supabase'
import type { Screen } from '@/types'
import { initials } from '@/lib/utils'

interface NavItem {
  screen: Screen
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

const NAV_ITEMS: NavItem[] = [
  { screen: 'dashboard', label: 'Dashboard', icon: <Icon path="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" /> },
  { screen: 'guests',    label: 'Guests',    icon: <Icon path="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" /> },
  { screen: 'vendors',   label: 'Vendors',   icon: <Icon path="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M1 7l3-4h16l3 4 M9 17v4 M15 17v4" /> },
  { screen: 'budget',    label: 'Budget',    icon: <Icon path="M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /> },
  { screen: 'checklist', label: 'Checklist', icon: <Icon path="M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /> },
  { screen: 'moodboard', label: 'Moodboard', icon: <Icon path="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7" /> },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const { screen, setScreen, wedding } = useAppStore()
  const coupleName = wedding?.couple_name ?? 'Your Wedding'
  const selfName = wedding?.self_name ?? 'Bride'

  return (
    <div className="app-shell">
      {/* Topbar */}
      <header className="app-topbar">
        <div className="topbar-logo-zone">
          <span className="logo">The Bride Side</span>
        </div>
        <nav className="topbar-nav" />
        <div className="topbar-right">
          <div className="topbar-notif" title="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="notif-dot" />
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

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="sidebar-section">
            <div className="sidebar-label">Planning</div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.screen}
                className={`sb-item${screen === item.screen ? ' active' : ''}`}
                onClick={() => setScreen(item.screen)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          <div className="sb-divider" />
          <div className="sb-bottom">
            <button className="sb-item" onClick={() => { signOut(); setScreen('landing') }}>
              <Icon path="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-wrapper">
        {children}
      </main>

      {/* Mobile bottom navigation */}
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
