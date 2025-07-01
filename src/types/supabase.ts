export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      model_evaluations: {
        Row: {
          id: string
          user_id: string | null
          model_name: string
          image_id: string
          bouquet_shape: string
          style: string
          flower_quality: string
          color_balance: string
          accent_elements: string
          wrapping_style: string
          bouquet_size: string
          background: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          model_name: string
          image_id: string
          bouquet_shape: string
          style: string
          flower_quality: string
          color_balance: string
          accent_elements: string
          wrapping_style: string
          bouquet_size: string
          background: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          model_name?: string
          image_id?: string
          bouquet_shape?: string
          style?: string
          flower_quality?: string
          color_balance?: string
          accent_elements?: string
          wrapping_style?: string
          bouquet_size?: string
          background?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}