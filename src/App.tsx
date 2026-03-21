import { useEffect } from 'react'
import { useAppStore } from '@/store/app'
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
  const setScreen = useAppStore(s => s.setScreen)

  // Seed mock data if user lands on an app screen without any data
  useEffect(() => {
    if (!wedding && userId && APP_SCREENS.includes(screen)) {
      seedMockData()
    }
  }, [wedding, userId, screen])

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
