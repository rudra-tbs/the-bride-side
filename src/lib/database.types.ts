// Auto-generated types from Supabase schema.
// Regenerate with: npx supabase gen types typescript --local > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      weddings: {
        Row: {
          id: string
          user_id: string
          couple_name: string
          partner_name: string
          self_name: string
          role: string
          wedding_date: string
          venue: string
          city: string
          total_budget: number
          vibe_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['weddings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['weddings']['Insert']>
      }
      wedding_events: {
        Row: {
          id: string
          wedding_id: string
          type: string
          name: string
          date: string
          venue: string
          start_time: string
          end_time: string
          notes: string
        }
        Insert: Omit<Database['public']['Tables']['wedding_events']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['wedding_events']['Insert']>
      }
      itinerary_items: {
        Row: {
          id: string
          event_id: string
          wedding_id: string
          time: string
          duration_min: number
          name: string
          note: string
          tags: string[]
          is_milestone: boolean
          is_done: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['itinerary_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['itinerary_items']['Insert']>
      }
      guests: {
        Row: {
          id: string
          wedding_id: string
          name: string
          phone: string
          email: string
          side: string
          rsvp_status: string
          dietary: string
          events: string[]
          plus_one: boolean
          notes: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['guests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['guests']['Insert']>
      }
      vendors: {
        Row: {
          id: string
          wedding_id: string
          name: string
          category: string
          city: string
          rating: number
          reviews_count: number
          price_from: number
          price_to: number
          tags: string[]
          status: string
          notes: string
          contact_name: string
          contact_phone: string
          contact_email: string
          booked_amount: number
          paid_amount: number
          is_shortlisted: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>
      }
      budget_categories: {
        Row: {
          id: string
          wedding_id: string
          name: string
          emoji: string
          allocated: number
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['budget_categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['budget_categories']['Insert']>
      }
      expenses: {
        Row: {
          id: string
          category_id: string
          wedding_id: string
          vendor_name: string
          description: string
          amount: number
          status: string
          due_date: string | null
          paid_date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
      }
      checklist_categories: {
        Row: {
          id: string
          wedding_id: string
          name: string
          sort_order: number
          badge_label: string
        }
        Insert: Omit<Database['public']['Tables']['checklist_categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['checklist_categories']['Insert']>
      }
      checklist_tasks: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['checklist_tasks']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['checklist_tasks']['Insert']>
      }
      mood_pins: {
        Row: {
          id: string
          wedding_id: string
          image_url: string
          storage_path: string | null
          caption: string
          category: string
          is_liked: boolean
          color_palette: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mood_pins']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mood_pins']['Insert']>
      }
      notes: {
        Row: {
          id: string
          wedding_id: string
          title: string
          body: string
          type: string
          vendor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notes']['Insert']>
      }
    }
  }
}
