// ── AUTH ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  created_at: string
}

// ── WEDDING ──────────────────────────────────────────────────────────────────
export type Role = 'bride' | 'groom' | 'planner' | 'other'

export interface Wedding {
  id: string
  user_id: string
  couple_name: string          // "Priya & Rahul"
  partner_name: string
  self_name: string
  role: Role
  wedding_date: string         // ISO date
  venue: string
  city: string
  total_budget: number
  vibe_tags: string[]          // ["modern", "minimal", "floral"]
  created_at: string
  updated_at: string
}

// ── EVENTS ───────────────────────────────────────────────────────────────────
export type EventType = 'wedding' | 'reception' | 'mehndi' | 'sangeet' | 'haldi' | 'other'

export interface WeddingEvent {
  id: string
  wedding_id: string
  type: EventType
  name: string
  date: string
  venue: string
  start_time: string
  end_time: string
  notes: string
}

// ── ITINERARY ─────────────────────────────────────────────────────────────────
export interface ItineraryItem {
  id: string
  event_id: string
  time: string
  duration_min: number
  name: string
  note: string
  tags: string[]
  is_milestone: boolean
  is_done: boolean
  sort_order: number
}

// ── GUESTS ───────────────────────────────────────────────────────────────────
export type RSVPStatus = 'pending' | 'confirmed' | 'declined'
export type GuestSide = 'bride' | 'groom' | 'both'
export type DietaryPref = 'vegetarian' | 'non-veg' | 'vegan' | 'jain' | 'no-preference'

export interface Guest {
  id: string
  wedding_id: string
  name: string
  phone: string
  email: string
  side: GuestSide
  rsvp_status: RSVPStatus
  dietary: DietaryPref
  events: string[]             // event IDs
  plus_one: boolean
  notes: string
  created_at: string
}

// ── VENDORS ──────────────────────────────────────────────────────────────────
export type VendorCategory =
  | 'photography'
  | 'videography'
  | 'mua'
  | 'decor'
  | 'catering'
  | 'dj'
  | 'mehendi'
  | 'venue'
  | 'invitation'
  | 'transport'
  | 'other'

export type VendorStatus = 'saved' | 'contacted' | 'quoted' | 'booked' | 'rejected'

export interface Vendor {
  id: string
  wedding_id: string
  name: string
  category: VendorCategory
  city: string
  rating: number
  reviews_count: number
  price_from: number
  price_to: number
  tags: string[]
  status: VendorStatus
  notes: string
  contact_name: string
  contact_phone: string
  contact_email: string
  booked_amount: number
  paid_amount: number
  is_shortlisted: boolean
  created_at: string
}

// ── BUDGET ───────────────────────────────────────────────────────────────────
export type PaymentStatus = 'paid' | 'pending' | 'due_soon' | 'overdue'

export interface BudgetCategory {
  id: string
  wedding_id: string
  name: string
  emoji: string
  allocated: number
  sort_order: number
}

export interface Expense {
  id: string
  category_id: string
  wedding_id: string
  vendor_name: string
  description: string
  amount: number
  status: PaymentStatus
  due_date: string | null
  paid_date: string | null
  created_at: string
}

// ── CHECKLIST ────────────────────────────────────────────────────────────────
export interface ChecklistCategory {
  id: string
  wedding_id: string
  name: string
  sort_order: number
  badge_label: string          // "To Do" | "In Progress" | "Done" | "Covered"
}

export interface ChecklistTask {
  id: string
  category_id: string
  wedding_id: string
  name: string
  is_done: boolean
  cost_estimate: number | null
  due_date: string | null
  assigned_to: string
  sort_order: number
}

// ── MOODBOARD ────────────────────────────────────────────────────────────────
export type PinCategory = 'decor' | 'outfit' | 'makeup' | 'venue' | 'food' | 'lighting' | 'other'

export interface MoodPin {
  id: string
  wedding_id: string
  image_url: string
  storage_path: string | null  // Supabase storage path
  caption: string
  category: PinCategory
  is_liked: boolean
  color_palette: string[]      // hex colors extracted/chosen
  created_at: string
}

// ── NOTES / MOM ──────────────────────────────────────────────────────────────
export interface Note {
  id: string
  wedding_id: string
  title: string
  body: string
  type: 'mom' | 'general' | 'vendor'  // MOM = Minutes of Meeting
  vendor_id: string | null
  created_at: string
  updated_at: string
}

// ── UI HELPERS ───────────────────────────────────────────────────────────────
export type Screen =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'vendors'
  | 'budget'
  | 'guests'
  | 'moodboard'
  | 'checklist'

export type DashTab = 'guest' | 'itinerary' | 'details' | 'mom'
