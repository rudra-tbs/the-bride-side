import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'
import { supabase, dbFetchWedding, dbFetchGuests, dbFetchVendors, dbFetchBudget, dbFetchChecklist, dbFetchPins, dbFetchNotes, dbFetchEvents } from '@/lib/supabase'
import type { Screen } from '@/types'
import {
  mockEvents, mockItinerary, mockGuests,
  mockVendors, mockBudgetCategories, mockExpenses,
  mockClCategories, mockClTasks, mockPins, mockNotes,
  MOCK_USER_ID,
} from '@/mock/data'
import Landing from '@/screens/Landing'
import Onboarding from '@/screens/Onboarding'
import AppShell from '@/components/layout/AppShell'
import Dashboard from '@/screens/Dashboard'
import Vendors from '@/screens/Vendors'
import Budget from '@/screens/Budget'
import Guests from '@/screens/Guests'
import Moodboard from '@/screens/Moodboard'
import Checklist from '@/screens/Checklist'

const APP_SCREENS: Screen[] = ['dashboard', 'vendors', 'budget', 'guests', 'moodboard', 'checklist']

const SCREEN_LABELS: Record<Screen, string> = {
  landing: 'Landing',
  onboarding: 'Onboarding',
  dashboard: 'Dashboard',
  vendors: 'Vendors',
  budget: 'Budget',
  guests: 'Guests',
  moodboard: 'Moodboard',
  checklist: 'Checklist',
}

const isDev = import.meta.env.DEV

function seedMockData() {
  const s = useAppStore.getState()
  s.setUserId(MOCK_USER_ID)
  s.setWedding(s.wedding ?? {
    id: 'w1',
    user_id: MOCK_USER_ID,
    couple_name: 'Priya & Arjun',
    partner_name: 'Arjun',
    self_name: 'Priya',
    role: 'bride',
    wedding_date: '2026-11-15',
    venue: 'Grand Hyatt Mumbai',
    city: 'Mumbai',
    total_budget: 2500000,
    vibe_tags: ['Elegant', 'Floral', 'Modern'],
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  })
  s.setEvents(mockEvents)
  s.setItinerary(mockItinerary)
  s.setGuests(mockGuests)
  s.setVendors(mockVendors)
  s.setBudgetCategories(mockBudgetCategories)
  s.setExpenses(mockExpenses)
  s.setClCategories(mockClCategories)
  s.setClTasks(mockClTasks)
  s.setPins(mockPins)
  s.setNotes(mockNotes)
}

function DemoBar() {
  const { screen, setScreen } = useAppStore()

  function seedAndGo(s: Screen) {
    if (s !== 'landing' && s !== 'onboarding') {
      seedMockData()
    }
    setScreen(s)
  }

  return (
    <div className="demo-bar">
      <span className="demo-lbl">Demo</span>
      {(['landing', 'onboarding', ...APP_SCREENS] as Screen[]).map(s => (
        <button
          key={s}
          className={`demo-btn${screen === s ? ' on' : ''}`}
          onClick={() => seedAndGo(s)}
        >
          {SCREEN_LABELS[s]}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const screen = useAppStore(s => s.screen)
  const wedding = useAppStore(s => s.wedding)
  const userId = useAppStore(s => s.userId)
  const setUserId = useAppStore(s => s.setUserId)
  const setScreen = useAppStore(s => s.setScreen)
  const [authLoading, setAuthLoading] = useState(true)

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        // If user just logged in and is on landing, send to dashboard or onboarding
        const currentScreen = useAppStore.getState().screen
        if (currentScreen === 'landing') {
          const hasWedding = useAppStore.getState().wedding
          setScreen(hasWedding ? 'dashboard' : 'onboarding')
        }
      }
      setAuthLoading(false)
    })

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        const currentScreen = useAppStore.getState().screen
        if (currentScreen === 'landing') {
          const hasWedding = useAppStore.getState().wedding
          setScreen(hasWedding ? 'dashboard' : 'onboarding')
        }
      } else {
        setUserId(null)
        setScreen('landing')
      }
    })

    return () => subscription.unsubscribe()
  }, [setUserId, setScreen])

  // Load real data from Supabase when userId is set
  useEffect(() => {
    if (!userId || userId === MOCK_USER_ID) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function loadFromSupabase() {
      try {
        const w = await dbFetchWedding(userId!)
        if (!w) return
        const s = useAppStore.getState()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setWedding(w as any)
        // If the user was sent to onboarding because wedding hadn't loaded yet
        // (race between onAuthStateChange and DB fetch), redirect to dashboard
        if (useAppStore.getState().screen === 'onboarding') setScreen('dashboard')
        const [guests, vendors, budget, checklist, pins, notes, evData] = await Promise.all([
          dbFetchGuests(w.id),
          dbFetchVendors(w.id),
          dbFetchBudget(w.id),
          dbFetchChecklist(w.id),
          dbFetchPins(w.id),
          dbFetchNotes(w.id),
          dbFetchEvents(w.id),
        ])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setGuests(guests as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setVendors(vendors as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setBudgetCategories(budget.categories as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setExpenses(budget.expenses as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setClCategories(checklist.categories as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setClTasks(checklist.tasks as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setPins(pins as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setNotes(notes as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setEvents(evData.events as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.setItinerary(evData.itinerary as any)
      } catch {
        // Supabase not configured or no data — local storage data is used
      }
    }
    loadFromSupabase()
  }, [userId])

  // Seed mock data for authenticated users who are on app screens without data
  useEffect(() => {
    if (!wedding && userId && APP_SCREENS.includes(screen)) {
      seedMockData()
    }
  }, [wedding, userId, screen])

  // Auth guard: redirect unauthenticated users away from app screens
  useEffect(() => {
    if (!authLoading && !userId && APP_SCREENS.includes(screen)) {
      setScreen('landing')
    }
  }, [authLoading, userId, screen, setScreen])

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="logo" style={{ fontSize: '24px', marginBottom: '12px' }}>The Bride Side</div>
          <div style={{ color: 'var(--ink3)', fontSize: '14px' }}>Loading...</div>
        </div>
      </div>
    )
  }

  const isAppScreen = APP_SCREENS.includes(screen)

  return (
    <div className="app-root">
      {isDev && <DemoBar />}
      {screen === 'landing' && <Landing />}
      {screen === 'onboarding' && <Onboarding />}
      {isAppScreen && (
        <AppShell>
          {screen === 'dashboard'  && <Dashboard />}
          {screen === 'vendors'    && <Vendors />}
          {screen === 'budget'     && <Budget />}
          {screen === 'guests'     && <Guests />}
          {screen === 'moodboard'  && <Moodboard />}
          {screen === 'checklist'  && <Checklist />}
        </AppShell>
      )}
    </div>
  )
}
