import { createClient } from '@supabase/supabase-js'
// Database type kept for reference; client uses untyped variant to avoid v2.99 PostgrestVersion conflicts
import type { Database } from './database.types'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnon) {
  console.warn('[supabase] Missing env vars — check .env.local')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ── WEDDING ───────────────────────────────────────────────────────────────────
export async function dbFetchWedding(userId: string) {
  const { data } = await supabase.from('weddings').select('*').eq('user_id', userId).maybeSingle()
  return data
}
export async function dbSaveWedding(wedding: Database['public']['Tables']['weddings']['Insert']) {
  const { data, error } = await supabase.from('weddings').upsert(wedding).select().single()
  if (error) throw error
  return data
}

// ── GUESTS ────────────────────────────────────────────────────────────────────
export async function dbFetchGuests(weddingId: string) {
  const { data } = await supabase.from('guests').select('*').eq('wedding_id', weddingId).order('created_at')
  return data ?? []
}
export async function dbInsertGuest(g: Database['public']['Tables']['guests']['Insert']) {
  const { data, error } = await supabase.from('guests').insert(g).select().single()
  if (error) throw error
  return data
}
export async function dbUpdateGuest(id: string, patch: Database['public']['Tables']['guests']['Update']) {
  const { error } = await supabase.from('guests').update(patch).eq('id', id)
  if (error) throw error
}
export async function dbDeleteGuest(id: string) {
  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) throw error
}

// ── VENDORS ───────────────────────────────────────────────────────────────────
export async function dbFetchVendors(weddingId: string) {
  const { data } = await supabase.from('vendors').select('*').eq('wedding_id', weddingId).order('created_at')
  return data ?? []
}
export async function dbInsertVendor(v: Database['public']['Tables']['vendors']['Insert']) {
  const { data, error } = await supabase.from('vendors').insert(v).select().single()
  if (error) throw error
  return data
}
export async function dbUpdateVendor(id: string, patch: Database['public']['Tables']['vendors']['Update']) {
  const { error } = await supabase.from('vendors').update(patch).eq('id', id)
  if (error) throw error
}
export async function dbDeleteVendor(id: string) {
  const { error } = await supabase.from('vendors').delete().eq('id', id)
  if (error) throw error
}

// ── BUDGET ────────────────────────────────────────────────────────────────────
export async function dbFetchBudget(weddingId: string) {
  const [{ data: cats }, { data: exps }] = await Promise.all([
    supabase.from('budget_categories').select('*').eq('wedding_id', weddingId).order('sort_order'),
    supabase.from('expenses').select('*').eq('wedding_id', weddingId).order('created_at'),
  ])
  return { categories: cats ?? [], expenses: exps ?? [] }
}
export async function dbInsertExpense(e: Database['public']['Tables']['expenses']['Insert']) {
  const { data, error } = await supabase.from('expenses').insert(e).select().single()
  if (error) throw error
  return data
}
export async function dbDeleteExpense(id: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}

// ── CHECKLIST ─────────────────────────────────────────────────────────────────
export async function dbFetchChecklist(weddingId: string) {
  const [{ data: cats }, { data: tasks }] = await Promise.all([
    supabase.from('checklist_categories').select('*').eq('wedding_id', weddingId).order('sort_order'),
    supabase.from('checklist_tasks').select('*').eq('wedding_id', weddingId).order('sort_order'),
  ])
  return { categories: cats ?? [], tasks: tasks ?? [] }
}
export async function dbInsertTask(t: Database['public']['Tables']['checklist_tasks']['Insert']) {
  const { data, error } = await supabase.from('checklist_tasks').insert(t).select().single()
  if (error) throw error
  return data
}
export async function dbToggleTask(id: string, isDone: boolean) {
  const { error } = await supabase.from('checklist_tasks').update({ is_done: isDone }).eq('id', id)
  if (error) throw error
}

// ── MOODBOARD ─────────────────────────────────────────────────────────────────
export async function dbFetchPins(weddingId: string) {
  const { data } = await supabase.from('mood_pins').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false })
  return data ?? []
}
export async function dbInsertPin(p: Database['public']['Tables']['mood_pins']['Insert']) {
  const { data, error } = await supabase.from('mood_pins').insert(p).select().single()
  if (error) throw error
  return data
}
export async function dbDeletePin(id: string) {
  const { error } = await supabase.from('mood_pins').delete().eq('id', id)
  if (error) throw error
}
export async function dbTogglePin(id: string, isLiked: boolean) {
  const { error } = await supabase.from('mood_pins').update({ is_liked: isLiked }).eq('id', id)
  if (error) throw error
}

// ── NOTES ─────────────────────────────────────────────────────────────────────
export async function dbFetchNotes(weddingId: string) {
  const { data } = await supabase.from('notes').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false })
  return data ?? []
}
export async function dbInsertNote(n: Database['public']['Tables']['notes']['Insert']) {
  const { data, error } = await supabase.from('notes').insert(n).select().single()
  if (error) throw error
  return data
}
export async function dbDeleteNote(id: string) {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}

// ── EVENTS + ITINERARY ────────────────────────────────────────────────────────
export async function dbFetchEvents(weddingId: string) {
  const [{ data: evs }, { data: items }] = await Promise.all([
    supabase.from('wedding_events').select('*').eq('wedding_id', weddingId),
    supabase.from('itinerary_items').select('*').eq('wedding_id', weddingId).order('sort_order'),
  ])
  return { events: evs ?? [], itinerary: items ?? [] }
}

export default supabase
