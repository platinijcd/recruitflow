export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ... existing tables ...
      chat_messages: {
        Row: {
          id: string
          created_at: string
          user_email: string
          role: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_email: string
          role: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          user_email?: string
          role?: string
          content?: string
        }
      }
      // ... other tables ...
    }
  }
} 