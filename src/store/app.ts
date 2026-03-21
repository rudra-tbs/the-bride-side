import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Wedding, Guest, Vendor, BudgetCategory, Expense,
  ChecklistCategory, ChecklistTask, MoodPin, Note,
  WeddingEvent, ItineraryItem, Screen, DashTab,
} from '../types'

interface AppState {
  // ── Auth ──────────────────────────────────────────────────────────────────
  userId: string | null
  setUserId: (id: string | null) => void

  // ── Navigation ────────────────────────────────────────────────────────────
  screen: Screen
  dashTab: DashTab
  setScreen: (s: Screen) => void
  setDashTab: (t: DashTab) => void

  // ── Wedding ───────────────────────────────────────────────────────────────
  wedding: Wedding | null
  setWedding: (w: Wedding | null) => void

  // ── Events ────────────────────────────────────────────────────────────────
  events: WeddingEvent[]
  setEvents: (e: WeddingEvent[]) => void

  // ── Itinerary ─────────────────────────────────────────────────────────────
  itinerary: ItineraryItem[]
  setItinerary: (items: ItineraryItem[]) => void
  updateItineraryItem: (id: string, patch: Partial<ItineraryItem>) => void

  // ── Guests ────────────────────────────────────────────────────────────────
  guests: Guest[]
  setGuests: (g: Guest[]) => void
  addGuest: (g: Guest) => void
  updateGuest: (id: string, patch: Partial<Guest>) => void
  removeGuest: (id: string) => void

  // ── Vendors ───────────────────────────────────────────────────────────────
  vendors: Vendor[]
  setVendors: (v: Vendor[]) => void
  addVendor: (v: Vendor) => void
  updateVendor: (id: string, patch: Partial<Vendor>) => void
  removeVendor: (id: string) => void

  // ── Budget ────────────────────────────────────────────────────────────────
  budgetCategories: BudgetCategory[]
  expenses: Expense[]
  setBudgetCategories: (cats: BudgetCategory[]) => void
  setExpenses: (e: Expense[]) => void
  addExpense: (e: Expense) => void
  removeExpense: (id: string) => void

  // ── Checklist ─────────────────────────────────────────────────────────────
  clCategories: ChecklistCategory[]
  clTasks: ChecklistTask[]
  setClCategories: (cats: ChecklistCategory[]) => void
  setClTasks: (tasks: ChecklistTask[]) => void
  toggleTask: (id: string) => void
  addTask: (t: ChecklistTask) => void

  // ── Moodboard ─────────────────────────────────────────────────────────────
  pins: MoodPin[]
  setPins: (p: MoodPin[]) => void
  addPin: (p: MoodPin) => void
  removePin: (id: string) => void
  togglePinLike: (id: string) => void

  // ── Notes / MOM ───────────────────────────────────────────────────────────
  notes: Note[]
  setNotes: (n: Note[]) => void
  addNote: (n: Note) => void
  updateNote: (id: string, patch: Partial<Note>) => void
  removeNote: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      userId: null,
      setUserId: (id) => set({ userId: id }),

      // Navigation
      screen: 'landing',
      dashTab: 'guest',
      setScreen: (screen) => set({ screen }),
      setDashTab: (dashTab) => set({ dashTab }),

      // Wedding
      wedding: null,
      setWedding: (wedding) => set({ wedding }),

      // Events
      events: [],
      setEvents: (events) => set({ events }),

      // Itinerary
      itinerary: [],
      setItinerary: (itinerary) => set({ itinerary }),
      updateItineraryItem: (id, patch) =>
        set((s) => ({ itinerary: s.itinerary.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),

      // Guests
      guests: [],
      setGuests: (guests) => set({ guests }),
      addGuest: (g) => set((s) => ({ guests: [g, ...s.guests] })),
      updateGuest: (id, patch) =>
        set((s) => ({ guests: s.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      removeGuest: (id) => set((s) => ({ guests: s.guests.filter((g) => g.id !== id) })),

      // Vendors
      vendors: [],
      setVendors: (vendors) => set({ vendors }),
      addVendor: (v) => set((s) => ({ vendors: [v, ...s.vendors] })),
      updateVendor: (id, patch) =>
        set((s) => ({ vendors: s.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      removeVendor: (id) => set((s) => ({ vendors: s.vendors.filter((v) => v.id !== id) })),

      // Budget
      budgetCategories: [],
      expenses: [],
      setBudgetCategories: (budgetCategories) => set({ budgetCategories }),
      setExpenses: (expenses) => set({ expenses }),
      addExpense: (e) => set((s) => ({ expenses: [e, ...s.expenses] })),
      removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      // Checklist
      clCategories: [],
      clTasks: [],
      setClCategories: (clCategories) => set({ clCategories }),
      setClTasks: (clTasks) => set({ clTasks }),
      toggleTask: (id) =>
        set((s) => ({
          clTasks: s.clTasks.map((t) => (t.id === id ? { ...t, is_done: !t.is_done } : t)),
        })),
      addTask: (t) => set((s) => ({ clTasks: [...s.clTasks, t] })),

      // Moodboard
      pins: [],
      setPins: (pins) => set({ pins }),
      addPin: (p) => set((s) => ({ pins: [p, ...s.pins] })),
      removePin: (id) => set((s) => ({ pins: s.pins.filter((p) => p.id !== id) })),
      togglePinLike: (id) =>
        set((s) => ({
          pins: s.pins.map((p) => (p.id === id ? { ...p, is_liked: !p.is_liked } : p)),
        })),

      // Notes
      notes: [],
      setNotes: (notes) => set({ notes }),
      addNote: (n) => set((s) => ({ notes: [n, ...s.notes] })),
      updateNote: (id, patch) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    {
      name: 'tbs-app-store',
      partialize: (state) => ({
        userId: state.userId,
        screen: state.screen,
        dashTab: state.dashTab,
        wedding: state.wedding,
        events: state.events,
        itinerary: state.itinerary,
        guests: state.guests,
        vendors: state.vendors,
        budgetCategories: state.budgetCategories,
        expenses: state.expenses,
        clCategories: state.clCategories,
        clTasks: state.clTasks,
        pins: state.pins,
        notes: state.notes,
      }),
    }
  )
)
