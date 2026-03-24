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
  updateEvent: (id: string, patch: Partial<WeddingEvent>) => void

  // ── Itinerary ─────────────────────────────────────────────────────────────
  itinerary: ItineraryItem[]
  setItinerary: (items: ItineraryItem[]) => void
  addItineraryItem: (item: ItineraryItem) => void
  updateItineraryItem: (id: string, patch: Partial<ItineraryItem>) => void
  deleteItineraryItem: (id: string) => void

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
  updateExpense: (id: string, patch: Partial<Expense>) => void
  removeExpense: (id: string) => void
  updateBudgetCategory: (id: string, patch: Partial<BudgetCategory>) => void

  // ── Checklist ─────────────────────────────────────────────────────────────
  clCategories: ChecklistCategory[]
  clTasks: ChecklistTask[]
  setClCategories: (cats: ChecklistCategory[]) => void
  setClTasks: (tasks: ChecklistTask[]) => void
  toggleTask: (id: string) => void
  addTask: (t: ChecklistTask) => void
  updateTask: (id: string, patch: Partial<ChecklistTask>) => void
  removeTask: (id: string) => void

  // ── Moodboard ─────────────────────────────────────────────────────────────
  pins: MoodPin[]
  setPins: (p: MoodPin[]) => void
  addPin: (p: MoodPin) => void
  updatePin: (id: string, patch: Partial<MoodPin>) => void
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
      updateEvent: (id, patch) =>
        set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),

      // Itinerary
      itinerary: [],
      setItinerary: (itinerary) => set({ itinerary }),
      addItineraryItem: (item) => set((s) => ({ itinerary: [...s.itinerary, item] })),
      updateItineraryItem: (id, patch) =>
        set((s) => ({ itinerary: s.itinerary.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      deleteItineraryItem: (id) => set((s) => ({ itinerary: s.itinerary.filter((i) => i.id !== id) })),

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
      updateExpense: (id, patch) =>
        set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
      updateBudgetCategory: (id, patch) =>
        set((s) => ({ budgetCategories: s.budgetCategories.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

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
      updateTask: (id, patch) =>
        set((s) => ({ clTasks: s.clTasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      removeTask: (id) => set((s) => ({ clTasks: s.clTasks.filter((t) => t.id !== id) })),

      // Moodboard
      pins: [],
      setPins: (pins) => set({ pins }),
      addPin: (p) => set((s) => ({ pins: [p, ...s.pins] })),
      updatePin: (id, patch) =>
        set((s) => ({ pins: s.pins.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
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
