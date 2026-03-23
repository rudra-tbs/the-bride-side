import type {
  Wedding, WeddingEvent, ItineraryItem, Guest, Vendor,
  BudgetCategory, Expense, ChecklistCategory, ChecklistTask,
  MoodPin, Note, EventType,
} from '@/types'

export const MOCK_WEDDING_ID = 'w1'
export const MOCK_USER_ID = 'u1'

export const EV_MEHENDI = 'ev1'
export const EV_SANGEET = 'ev2'
export const EV_WEDDING = 'ev3'
export const EV_RECEPTION = 'ev4'

export const mockWedding: Wedding = {
  id: MOCK_WEDDING_ID,
  user_id: MOCK_USER_ID,
  couple_name: 'Priya & Arjun',
  partner_name: 'Arjun Mehta',
  self_name: 'Priya Sharma',
  role: 'bride',
  wedding_date: '2026-11-15',
  venue: 'Grand Hyatt Mumbai',
  city: 'Mumbai',
  total_budget: 2500000,
  vibe_tags: ['Romantic', 'Floral', 'Elegant', 'Traditional'],
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-03-01T10:00:00Z',
}

export const mockEvents: WeddingEvent[] = [
  {
    id: EV_MEHENDI, wedding_id: MOCK_WEDDING_ID, type: 'mehndi', name: 'Mehendi',
    date: '2026-11-12', venue: "Priya's Family Home, Bandra",
    start_time: '14:00', end_time: '20:00',
    notes: 'Intimate family ceremony with haldi and mehendi artists booked.',
  },
  {
    id: EV_SANGEET, wedding_id: MOCK_WEDDING_ID, type: 'sangeet', name: 'Sangeet',
    date: '2026-11-13', venue: 'The Taj Lands End, Bandra',
    start_time: '19:00', end_time: '23:30',
    notes: 'DJ Arjun booked. Choreographer meeting on Oct 5.',
  },
  {
    id: EV_WEDDING, wedding_id: MOCK_WEDDING_ID, type: 'wedding', name: 'Wedding Ceremony',
    date: '2026-11-15', venue: 'Grand Hyatt Mumbai',
    start_time: '09:00', end_time: '14:00',
    notes: 'Pheras at 10:30 AM. Pandit confirmed.',
  },
  {
    id: EV_RECEPTION, wedding_id: MOCK_WEDDING_ID, type: 'reception', name: 'Reception',
    date: '2026-11-15', venue: 'Grand Hyatt Mumbai',
    start_time: '19:00', end_time: '23:00',
    notes: 'Cocktail hour from 7–8 PM. Dinner from 8 PM.',
  },
]

export const mockItinerary: ItineraryItem[] = [
  { id: 'it1', event_id: EV_WEDDING, time: '06:00', duration_min: 90, name: 'Bride gets ready — Hair & Makeup', note: 'Team arrives at suite 602', tags: ['makeup', 'prep'], is_milestone: false, is_done: false, sort_order: 1 },
  { id: 'it2', event_id: EV_WEDDING, time: '07:30', duration_min: 45, name: 'Family portraits in suite', note: '', tags: ['photography'], is_milestone: false, is_done: false, sort_order: 2 },
  { id: 'it3', event_id: EV_WEDDING, time: '09:00', duration_min: 30, name: 'Baraat arrives', note: 'Groom enters with dhol party', tags: ['ceremony'], is_milestone: true, is_done: false, sort_order: 3 },
  { id: 'it4', event_id: EV_WEDDING, time: '09:30', duration_min: 20, name: 'Jaimala / Varmala', note: 'Garland exchange in the mandap', tags: ['ceremony'], is_milestone: true, is_done: false, sort_order: 4 },
  { id: 'it5', event_id: EV_WEDDING, time: '10:30', duration_min: 90, name: 'Pheras & rituals', note: 'Panditji leads. ~7 pheras expected.', tags: ['ceremony', 'rituals'], is_milestone: true, is_done: false, sort_order: 5 },
  { id: 'it6', event_id: EV_WEDDING, time: '12:00', duration_min: 60, name: 'Photography portraits — terrace', note: 'Terrace booked 12–1 PM', tags: ['photography'], is_milestone: false, is_done: false, sort_order: 6 },
  { id: 'it7', event_id: EV_WEDDING, time: '13:00', duration_min: 60, name: 'Vidaai', note: 'Video crew on both sides', tags: ['ceremony'], is_milestone: true, is_done: false, sort_order: 7 },
]

export const mockGuests: Guest[] = [
  { id: 'g1', wedding_id: MOCK_WEDDING_ID, name: 'Sunita Sharma', phone: '+91 98200 11111', email: 'sunita@email.com', side: 'bride', rsvp_status: 'confirmed', dietary: 'vegetarian', events: [EV_MEHENDI, EV_SANGEET, EV_WEDDING, EV_RECEPTION], plus_one: false, notes: "Bride's mother", created_at: '2026-02-01T00:00:00Z' },
  { id: 'g2', wedding_id: MOCK_WEDDING_ID, name: 'Rajesh Sharma', phone: '+91 98200 22222', email: 'rajesh@email.com', side: 'bride', rsvp_status: 'confirmed', dietary: 'non-veg', events: [EV_WEDDING, EV_RECEPTION], plus_one: false, notes: "Bride's father", created_at: '2026-02-01T00:00:00Z' },
  { id: 'g3', wedding_id: MOCK_WEDDING_ID, name: 'Kavita Mehta', phone: '+91 98200 33333', email: 'kavita@email.com', side: 'groom', rsvp_status: 'confirmed', dietary: 'vegetarian', events: [EV_MEHENDI, EV_SANGEET, EV_WEDDING, EV_RECEPTION], plus_one: false, notes: "Groom's mother", created_at: '2026-02-01T00:00:00Z' },
  { id: 'g4', wedding_id: MOCK_WEDDING_ID, name: 'Vikram Mehta', phone: '+91 98200 44444', email: 'vikram@email.com', side: 'groom', rsvp_status: 'confirmed', dietary: 'non-veg', events: [EV_WEDDING, EV_RECEPTION], plus_one: false, notes: "Groom's father", created_at: '2026-02-01T00:00:00Z' },
  { id: 'g5', wedding_id: MOCK_WEDDING_ID, name: 'Ananya Kapoor', phone: '+91 99100 55555', email: 'ananya@email.com', side: 'bride', rsvp_status: 'confirmed', dietary: 'vegan', events: [EV_MEHENDI, EV_SANGEET, EV_WEDDING, EV_RECEPTION], plus_one: true, notes: 'BFF / MOH', created_at: '2026-02-05T00:00:00Z' },
  { id: 'g6', wedding_id: MOCK_WEDDING_ID, name: 'Rohan Verma', phone: '+91 99100 66666', email: 'rohan@email.com', side: 'groom', rsvp_status: 'confirmed', dietary: 'non-veg', events: [EV_SANGEET, EV_WEDDING, EV_RECEPTION], plus_one: true, notes: 'Best man', created_at: '2026-02-05T00:00:00Z' },
  { id: 'g7', wedding_id: MOCK_WEDDING_ID, name: 'Meera Joshi', phone: '+91 98765 77777', email: 'meera@email.com', side: 'bride', rsvp_status: 'pending', dietary: 'jain', events: [EV_WEDDING, EV_RECEPTION], plus_one: false, notes: 'Mausi', created_at: '2026-02-10T00:00:00Z' },
  { id: 'g8', wedding_id: MOCK_WEDDING_ID, name: 'Suresh Patel', phone: '+91 98765 88888', email: 'suresh@email.com', side: 'groom', rsvp_status: 'pending', dietary: 'vegetarian', events: [EV_WEDDING, EV_RECEPTION], plus_one: true, notes: 'Chacha', created_at: '2026-02-10T00:00:00Z' },
  { id: 'g9', wedding_id: MOCK_WEDDING_ID, name: 'Divya Nair', phone: '+91 97550 99999', email: 'divya@email.com', side: 'bride', rsvp_status: 'declined', dietary: 'non-veg', events: [], plus_one: false, notes: 'College friend — abroad', created_at: '2026-02-12T00:00:00Z' },
  { id: 'g10', wedding_id: MOCK_WEDDING_ID, name: 'Rahul Singhania', phone: '+91 97550 10000', email: 'rahul@email.com', side: 'groom', rsvp_status: 'confirmed', dietary: 'vegetarian', events: [EV_SANGEET, EV_WEDDING, EV_RECEPTION], plus_one: false, notes: 'College buddy', created_at: '2026-02-12T00:00:00Z' },
  { id: 'g11', wedding_id: MOCK_WEDDING_ID, name: 'Pooja Desai', phone: '+91 98200 11100', email: 'pooja@email.com', side: 'bride', rsvp_status: 'confirmed', dietary: 'vegetarian', events: [EV_MEHENDI, EV_SANGEET, EV_WEDDING, EV_RECEPTION], plus_one: false, notes: 'Cousin', created_at: '2026-02-15T00:00:00Z' },
  { id: 'g12', wedding_id: MOCK_WEDDING_ID, name: 'Aditya Shah', phone: '+91 98200 12200', email: 'aditya@email.com', side: 'groom', rsvp_status: 'pending', dietary: 'no-preference', events: [EV_WEDDING, EV_RECEPTION], plus_one: true, notes: 'Work friend', created_at: '2026-02-15T00:00:00Z' },
]

export const mockVendors: Vendor[] = [
  { id: 'v1', wedding_id: MOCK_WEDDING_ID, name: 'Pixel Perfect Studios', category: 'photography', city: 'Mumbai', rating: 4.9, reviews_count: 287, price_from: 150000, price_to: 300000, tags: ['cinematic', 'candid', 'traditional'], status: 'booked', notes: 'Full day + album. Contract signed.', contact_name: 'Deepak Soni', contact_phone: '+91 98100 11111', contact_email: 'deepak@pixelperfect.in', booked_amount: 220000, paid_amount: 110000, is_shortlisted: true, created_at: '2026-02-01T00:00:00Z' },
  { id: 'v2', wedding_id: MOCK_WEDDING_ID, name: 'Floral Fantasy Decor', category: 'decor', city: 'Mumbai', rating: 4.8, reviews_count: 195, price_from: 200000, price_to: 500000, tags: ['floral', 'romantic', 'modern'], status: 'booked', notes: 'Full decor for wedding + reception. 50% paid.', contact_name: 'Prerna Gupta', contact_phone: '+91 98100 22222', contact_email: 'prerna@floralfantasy.in', booked_amount: 380000, paid_amount: 190000, is_shortlisted: true, created_at: '2026-02-01T00:00:00Z' },
  { id: 'v3', wedding_id: MOCK_WEDDING_ID, name: 'Grand Hyatt Catering', category: 'catering', city: 'Mumbai', rating: 4.7, reviews_count: 412, price_from: 800000, price_to: 1500000, tags: ['premium', 'multi-cuisine', 'live counters'], status: 'booked', notes: 'Menu finalized. Tasting on Oct 20.', contact_name: 'Chef Ravi Kumar', contact_phone: '+91 22 1234 5678', contact_email: 'catering@grandhyatt.in', booked_amount: 1050000, paid_amount: 350000, is_shortlisted: true, created_at: '2026-02-05T00:00:00Z' },
  { id: 'v4', wedding_id: MOCK_WEDDING_ID, name: 'Beats by DJ Arjun', category: 'dj', city: 'Mumbai', rating: 4.6, reviews_count: 134, price_from: 40000, price_to: 80000, tags: ['bollywood', 'EDM', 'live'], status: 'booked', notes: 'Sangeet night only. Playlist shared.', contact_name: 'Arjun Malhotra', contact_phone: '+91 97100 33333', contact_email: 'dj@beatsByArjun.com', booked_amount: 65000, paid_amount: 65000, is_shortlisted: true, created_at: '2026-02-10T00:00:00Z' },
  { id: 'v5', wedding_id: MOCK_WEDDING_ID, name: 'Glam by Nisha', category: 'mua', city: 'Mumbai', rating: 4.8, reviews_count: 321, price_from: 30000, price_to: 70000, tags: ['airbrush', 'HD', 'bridal'], status: 'booked', notes: 'Trial booked Nov 1.', contact_name: 'Nisha Pillai', contact_phone: '+91 99000 44444', contact_email: 'nisha@glambyNisha.in', booked_amount: 55000, paid_amount: 20000, is_shortlisted: true, created_at: '2026-02-15T00:00:00Z' },
  { id: 'v6', wedding_id: MOCK_WEDDING_ID, name: 'Mehendi Magic', category: 'mehendi', city: 'Mumbai', rating: 4.5, reviews_count: 89, price_from: 10000, price_to: 25000, tags: ['rajasthani', 'arabic', 'bridal'], status: 'quoted', notes: 'Quote received. Compare with Henna Hub.', contact_name: 'Fatima Sheikh', contact_phone: '+91 97650 55555', contact_email: 'fatima@mehendimagic.in', booked_amount: 0, paid_amount: 0, is_shortlisted: true, created_at: '2026-02-20T00:00:00Z' },
  { id: 'v7', wedding_id: MOCK_WEDDING_ID, name: 'Henna Hub', category: 'mehendi', city: 'Mumbai', rating: 4.3, reviews_count: 62, price_from: 8000, price_to: 20000, tags: ['bridal', 'traditional'], status: 'saved', notes: 'Backup option. Portfolio looks good.', contact_name: 'Reena Shaikh', contact_phone: '+91 97650 66666', contact_email: 'reena@hennahub.in', booked_amount: 0, paid_amount: 0, is_shortlisted: false, created_at: '2026-02-22T00:00:00Z' },
  { id: 'v8', wedding_id: MOCK_WEDDING_ID, name: 'Dream Frames Video', category: 'videography', city: 'Mumbai', rating: 4.7, reviews_count: 178, price_from: 100000, price_to: 200000, tags: ['cinematic', '4K', 'drone'], status: 'contacted', notes: 'Awaiting availability confirmation.', contact_name: 'Kiran Joshi', contact_phone: '+91 98500 77777', contact_email: 'kiran@dreamframes.in', booked_amount: 0, paid_amount: 0, is_shortlisted: true, created_at: '2026-03-01T00:00:00Z' },
]

const CAT_VENUE = 'bc1'; const CAT_CATERING = 'bc2'; const CAT_PHOTO = 'bc3'
const CAT_DECOR = 'bc4'; const CAT_ENTERTAIN = 'bc5'; const CAT_ATTIRE = 'bc6'; const CAT_INVITES = 'bc7'

export const mockBudgetCategories: BudgetCategory[] = [
  { id: CAT_VENUE, wedding_id: MOCK_WEDDING_ID, name: 'Venue', emoji: '🏛️', allocated: 600000, sort_order: 1 },
  { id: CAT_CATERING, wedding_id: MOCK_WEDDING_ID, name: 'Catering', emoji: '🍽️', allocated: 700000, sort_order: 2 },
  { id: CAT_PHOTO, wedding_id: MOCK_WEDDING_ID, name: 'Photography & Film', emoji: '📷', allocated: 350000, sort_order: 3 },
  { id: CAT_DECOR, wedding_id: MOCK_WEDDING_ID, name: 'Decor & Flowers', emoji: '🌸', allocated: 400000, sort_order: 4 },
  { id: CAT_ENTERTAIN, wedding_id: MOCK_WEDDING_ID, name: 'Entertainment', emoji: '🎶', allocated: 150000, sort_order: 5 },
  { id: CAT_ATTIRE, wedding_id: MOCK_WEDDING_ID, name: 'Attire & Beauty', emoji: '💍', allocated: 200000, sort_order: 6 },
  { id: CAT_INVITES, wedding_id: MOCK_WEDDING_ID, name: 'Invitations', emoji: '✉️', allocated: 30000, sort_order: 7 },
]

export const mockExpenses: Expense[] = [
  { id: 'e1', category_id: CAT_VENUE, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Grand Hyatt Mumbai', description: 'Venue booking advance', amount: 300000, status: 'paid', due_date: null, paid_date: '2026-02-15', created_at: '2026-02-15T00:00:00Z' },
  { id: 'e2', category_id: CAT_VENUE, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Grand Hyatt Mumbai', description: 'Balance venue payment', amount: 280000, status: 'due_soon', due_date: '2026-10-01', paid_date: null, created_at: '2026-02-15T00:00:00Z' },
  { id: 'e3', category_id: CAT_CATERING, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Grand Hyatt Catering', description: 'Catering advance', amount: 350000, status: 'paid', due_date: null, paid_date: '2026-03-01', created_at: '2026-03-01T00:00:00Z' },
  { id: 'e4', category_id: CAT_CATERING, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Grand Hyatt Catering', description: 'Catering balance', amount: 700000, status: 'pending', due_date: '2026-11-10', paid_date: null, created_at: '2026-03-01T00:00:00Z' },
  { id: 'e5', category_id: CAT_PHOTO, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Pixel Perfect Studios', description: 'Photography advance', amount: 110000, status: 'paid', due_date: null, paid_date: '2026-02-10', created_at: '2026-02-10T00:00:00Z' },
  { id: 'e6', category_id: CAT_PHOTO, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Pixel Perfect Studios', description: 'Photography balance', amount: 110000, status: 'pending', due_date: '2026-11-14', paid_date: null, created_at: '2026-02-10T00:00:00Z' },
  { id: 'e7', category_id: CAT_DECOR, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Floral Fantasy Decor', description: 'Decor advance', amount: 190000, status: 'paid', due_date: null, paid_date: '2026-02-20', created_at: '2026-02-20T00:00:00Z' },
  { id: 'e8', category_id: CAT_DECOR, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Floral Fantasy Decor', description: 'Decor balance', amount: 190000, status: 'pending', due_date: '2026-11-10', paid_date: null, created_at: '2026-02-20T00:00:00Z' },
  { id: 'e9', category_id: CAT_ENTERTAIN, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Beats by DJ Arjun', description: 'DJ full payment', amount: 65000, status: 'paid', due_date: null, paid_date: '2026-02-25', created_at: '2026-02-25T00:00:00Z' },
  { id: 'e10', category_id: CAT_ATTIRE, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Sabyasachi Juhu', description: 'Bridal lehenga', amount: 145000, status: 'paid', due_date: null, paid_date: '2026-03-05', created_at: '2026-03-05T00:00:00Z' },
  { id: 'e11', category_id: CAT_ATTIRE, wedding_id: MOCK_WEDDING_ID, vendor_name: 'Glam by Nisha', description: 'MUA advance', amount: 20000, status: 'paid', due_date: null, paid_date: '2026-03-10', created_at: '2026-03-10T00:00:00Z' },
  { id: 'e12', category_id: CAT_INVITES, wedding_id: MOCK_WEDDING_ID, vendor_name: 'InviteBox.in', description: 'Digital invites', amount: 12000, status: 'paid', due_date: null, paid_date: '2026-04-01', created_at: '2026-04-01T00:00:00Z' },
]

const CL_6M = 'cc1'; const CL_3M = 'cc2'; const CL_1M = 'cc3'; const CL_WK = 'cc4'; const CL_DAY = 'cc5'

export const mockClCategories: ChecklistCategory[] = [
  { id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: '6 Months Before', sort_order: 1, badge_label: 'Done' },
  { id: CL_3M, wedding_id: MOCK_WEDDING_ID, name: '3 Months Before', sort_order: 2, badge_label: 'In Progress' },
  { id: CL_1M, wedding_id: MOCK_WEDDING_ID, name: '1 Month Before', sort_order: 3, badge_label: 'To Do' },
  { id: CL_WK, wedding_id: MOCK_WEDDING_ID, name: 'Week Of', sort_order: 4, badge_label: 'To Do' },
  { id: CL_DAY, wedding_id: MOCK_WEDDING_ID, name: 'Day Of', sort_order: 5, badge_label: 'To Do' },
]

export const mockClTasks: ChecklistTask[] = [
  { id: 'ct1', category_id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: 'Set overall wedding budget', is_done: true, cost_estimate: null, due_date: '2026-06-01', assigned_to: 'Priya', sort_order: 1 },
  { id: 'ct2', category_id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: 'Finalize & book venue', is_done: true, cost_estimate: 600000, due_date: '2026-06-15', assigned_to: 'Both', sort_order: 2 },
  { id: 'ct3', category_id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: 'Book photographer', is_done: true, cost_estimate: 220000, due_date: '2026-07-01', assigned_to: 'Priya', sort_order: 3 },
  { id: 'ct4', category_id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: 'Start guest list', is_done: true, cost_estimate: null, due_date: '2026-07-01', assigned_to: 'Both', sort_order: 4 },
  { id: 'ct5', category_id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: 'Book MUA', is_done: true, cost_estimate: 55000, due_date: '2026-07-15', assigned_to: 'Priya', sort_order: 5 },
  { id: 'ct6', category_id: CL_6M, wedding_id: MOCK_WEDDING_ID, name: 'Book DJ for Sangeet', is_done: true, cost_estimate: 65000, due_date: '2026-07-15', assigned_to: 'Arjun', sort_order: 6 },
  { id: 'ct7', category_id: CL_3M, wedding_id: MOCK_WEDDING_ID, name: 'Send save-the-dates', is_done: true, cost_estimate: null, due_date: '2026-08-15', assigned_to: 'Priya', sort_order: 1 },
  { id: 'ct8', category_id: CL_3M, wedding_id: MOCK_WEDDING_ID, name: 'Order bridal lehenga', is_done: true, cost_estimate: 145000, due_date: '2026-08-01', assigned_to: 'Priya', sort_order: 2 },
  { id: 'ct9', category_id: CL_3M, wedding_id: MOCK_WEDDING_ID, name: 'Finalize menu with caterer', is_done: false, cost_estimate: null, due_date: '2026-09-01', assigned_to: 'Both', sort_order: 3 },
  { id: 'ct10', category_id: CL_3M, wedding_id: MOCK_WEDDING_ID, name: 'Book mehendi artist', is_done: false, cost_estimate: 18000, due_date: '2026-09-15', assigned_to: 'Priya', sort_order: 4 },
  { id: 'ct11', category_id: CL_3M, wedding_id: MOCK_WEDDING_ID, name: 'Book videographer', is_done: false, cost_estimate: 150000, due_date: '2026-09-01', assigned_to: 'Arjun', sort_order: 5 },
  { id: 'ct12', category_id: CL_1M, wedding_id: MOCK_WEDDING_ID, name: 'Final guestlist + seating', is_done: false, cost_estimate: null, due_date: '2026-10-15', assigned_to: 'Both', sort_order: 1 },
  { id: 'ct13', category_id: CL_1M, wedding_id: MOCK_WEDDING_ID, name: 'Send formal invitations', is_done: false, cost_estimate: null, due_date: '2026-10-15', assigned_to: 'Priya', sort_order: 2 },
  { id: 'ct14', category_id: CL_1M, wedding_id: MOCK_WEDDING_ID, name: 'MUA makeup trial', is_done: false, cost_estimate: null, due_date: '2026-11-01', assigned_to: 'Priya', sort_order: 3 },
  { id: 'ct15', category_id: CL_1M, wedding_id: MOCK_WEDDING_ID, name: 'Confirm all vendor logistics', is_done: false, cost_estimate: null, due_date: '2026-11-01', assigned_to: 'Both', sort_order: 4 },
  { id: 'ct16', category_id: CL_WK, wedding_id: MOCK_WEDDING_ID, name: 'Final venue walkthrough', is_done: false, cost_estimate: null, due_date: '2026-11-09', assigned_to: 'Both', sort_order: 1 },
  { id: 'ct17', category_id: CL_WK, wedding_id: MOCK_WEDDING_ID, name: 'Vendor contact sheet ready', is_done: false, cost_estimate: null, due_date: '2026-11-09', assigned_to: 'Priya', sort_order: 2 },
  { id: 'ct18', category_id: CL_WK, wedding_id: MOCK_WEDDING_ID, name: 'Get outfits pressed & ready', is_done: false, cost_estimate: null, due_date: '2026-11-13', assigned_to: 'Priya', sort_order: 3 },
  { id: 'ct19', category_id: CL_DAY, wedding_id: MOCK_WEDDING_ID, name: 'MUA arrives at 6 AM', is_done: false, cost_estimate: null, due_date: '2026-11-15', assigned_to: 'Priya', sort_order: 1 },
  { id: 'ct20', category_id: CL_DAY, wedding_id: MOCK_WEDDING_ID, name: 'Photographer briefing', is_done: false, cost_estimate: null, due_date: '2026-11-15', assigned_to: 'Both', sort_order: 2 },
  { id: 'ct21', category_id: CL_DAY, wedding_id: MOCK_WEDDING_ID, name: 'Emergency kit ready (pins, tape, kit)', is_done: false, cost_estimate: null, due_date: '2026-11-15', assigned_to: 'Ananya', sort_order: 3 },
]

export const mockPins: MoodPin[] = [
  { id: 'p1', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'Blush mandap with hanging florals', category: 'decor', is_liked: true, color_palette: ['#F8D0D8', '#E8748A', '#FFFFFF'], created_at: '2026-02-01T00:00:00Z' },
  { id: 'p2', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'Sabyasachi Lehenga inspiration', category: 'outfit', is_liked: true, color_palette: ['#C45570', '#D4956A', '#FFFFFF'], created_at: '2026-02-03T00:00:00Z' },
  { id: 'p3', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'Dewy bridal makeup — natural glow', category: 'makeup', is_liked: false, color_palette: ['#FDE8EC', '#D4956A', '#F8D0D8'], created_at: '2026-02-05T00:00:00Z' },
  { id: 'p4', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'Grand Hyatt terrace — golden hour', category: 'venue', is_liked: true, color_palette: ['#D4956A', '#FAF0E8', '#7098B8'], created_at: '2026-02-07T00:00:00Z' },
  { id: 'p5', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'Live chaat + dessert station', category: 'food', is_liked: false, color_palette: ['#D4956A', '#FAF0E8', '#7AAA90'], created_at: '2026-02-10T00:00:00Z' },
  { id: 'p6', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'String lights + candles — sangeet vibe', category: 'lighting', is_liked: true, color_palette: ['#D4956A', '#2A1A20', '#F8D0D8'], created_at: '2026-02-12T00:00:00Z' },
  { id: 'p7', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: 'Arabic bridal mehendi design', category: 'other', is_liked: true, color_palette: ['#A06080', '#F2E8F0', '#D4956A'], created_at: '2026-02-14T00:00:00Z' },
  { id: 'p8', wedding_id: MOCK_WEDDING_ID, image_url: '', storage_path: null, caption: "Groom's sherwani — ivory with gold", category: 'outfit', is_liked: false, color_palette: ['#FAF0E8', '#D4956A', '#C898B8'], created_at: '2026-02-16T00:00:00Z' },
]

export const mockNotes: Note[] = [
  {
    id: 'n1', wedding_id: MOCK_WEDDING_ID,
    title: 'MOM — Floral Fantasy Meeting (Mar 5)',
    body: 'Met with Prerna Gupta at their studio. Reviewed moodboard.\n\nDecisions:\n• Mandap: Blush + white roses with hanging orchids\n• Reception: Ivory + gold centrepieces, candle-lit tables\n• Sangeet backdrop: Pampas grass + marigold arch\n\nAction items:\n• Share final moodboard by Mar 15\n• They will send revised quote by Mar 20\n• Visit venue for measurements: April 3',
    type: 'mom', vendor_id: 'v2', created_at: '2026-03-05T14:00:00Z', updated_at: '2026-03-05T14:00:00Z',
  },
  {
    id: 'n2', wedding_id: MOCK_WEDDING_ID,
    title: 'MOM — Catering Menu Tasting (Mar 12)',
    body: 'Attended tasting at Grand Hyatt with Chef Ravi.\n\nApproved dishes:\n• Starters: Dahi puri shots, paneer tikka, chicken seekh\n• Main: Dal makhani, butter paneer, biryani station\n• Dessert: Gulab jamun cheesecake, malpua, ice cream\n\nTo confirm:\n• Jain alternatives for starters\n• Live chaat station count by Oct 10\n• Mocktail menu with mixologist',
    type: 'mom', vendor_id: 'v3', created_at: '2026-03-12T16:30:00Z', updated_at: '2026-03-12T16:30:00Z',
  },
  {
    id: 'n3', wedding_id: MOCK_WEDDING_ID,
    title: 'General — Things to decide before April',
    body: "• Wedding colours confirmed: Blush, ivory, gold\n• Still need to decide: Bride's 2nd outfit (sangeet)\n• Arjun's sherwani — visit Manyavar next week\n• Order bridesmaid outfits (Ananya, Pooja, Divya)\n• Follow up with Dream Frames — no response in 5 days",
    type: 'general', vendor_id: null, created_at: '2026-03-15T10:00:00Z', updated_at: '2026-03-18T10:00:00Z',
  },
]

// ── Fresh starter data for real onboarded users ──────────────────
const EVENT_TYPE_MAP: Record<string, { type: EventType; name: string }> = {
  Wedding:    { type: 'wedding',    name: 'Wedding Ceremony' },
  Reception:  { type: 'reception',  name: 'Reception' },
  Mehndi:     { type: 'mehndi',     name: 'Mehendi' },
  Sangeet:    { type: 'sangeet',    name: 'Sangeet' },
  Haldi:      { type: 'haldi',      name: 'Haldi' },
  Engagement: { type: 'engagement', name: 'Engagement' },
  Roka:       { type: 'roka',       name: 'Roka' },
}

export function makeStarterData(
  weddingId: string,
  selectedEvents: string[],
  weddingDate: string,
  venue: string,
) {
  const now = new Date().toISOString()

  const events: WeddingEvent[] = selectedEvents.map((ev, i) => ({
    id: `ev_${weddingId}_${i}`,
    wedding_id: weddingId,
    type: EVENT_TYPE_MAP[ev]?.type ?? 'other',
    name: EVENT_TYPE_MAP[ev]?.name ?? ev,
    date: weddingDate || '',
    venue: venue || '',
    start_time: '',
    end_time: '',
    notes: '',
  }))

  const budgetCategories: BudgetCategory[] = [
    { name: 'Venue',               emoji: '🏛️', sort_order: 1 },
    { name: 'Catering',            emoji: '🍽️', sort_order: 2 },
    { name: 'Photography & Film',  emoji: '📷', sort_order: 3 },
    { name: 'Decor & Flowers',     emoji: '🌸', sort_order: 4 },
    { name: 'Entertainment',       emoji: '🎶', sort_order: 5 },
    { name: 'Attire & Beauty',     emoji: '💍', sort_order: 6 },
    { name: 'Invitations',         emoji: '✉️', sort_order: 7 },
  ].map((cat, i) => ({
    id: `bc_${weddingId}_${i}`,
    wedding_id: weddingId,
    allocated: 0,
    ...cat,
  }))

  // Checklist template — fresh IDs, all tasks reset to not done, no names assigned
  const idMap: Record<string, string> = {}
  const clCategories: ChecklistCategory[] = mockClCategories.map(cat => {
    const newId = `${cat.id}_${weddingId}`
    idMap[cat.id] = newId
    return { ...cat, id: newId, wedding_id: weddingId, badge_label: 'To Do' }
  })
  const clTasks: ChecklistTask[] = mockClTasks.map(task => ({
    ...task,
    id: `${task.id}_${weddingId}`,
    wedding_id: weddingId,
    category_id: idMap[task.category_id] ?? task.category_id,
    is_done: false,
    assigned_to: '',
    due_date: null,
    created_at: now,
  }))

  return { events, budgetCategories, clCategories, clTasks }
}
