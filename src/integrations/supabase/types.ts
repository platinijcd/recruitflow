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
      candidates: {
        Row: {
          application_date: string | null
          application_status: Database["public"]["Enums"]["application_status"]
          certifications: Json[] | null
          cv_url: string | null
          degrees: Json[] | null
          desired_position: string | null
          email: string
          experiences: Json[] | null
          id: string
          interview_date: string | null
          interview_id: string | null
          linkedin_url: string | null
          name: string
          phone: string | null
          post_id: string | null
          profile_summary: string | null
          recruiter_assigned: string | null
          relevance_score: number | null
          score_justification: string | null
          skills: Json[] | null
        }
        Insert: {
          application_date?: string | null
          application_status?: Database["public"]["Enums"]["application_status"]
          certifications?: Json[] | null
          cv_url?: string | null
          degrees?: Json[] | null
          desired_position?: string | null
          email: string
          experiences?: Json[] | null
          id?: string
          interview_date?: string | null
          interview_id?: string | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          post_id?: string | null
          profile_summary?: string | null
          recruiter_assigned?: string | null
          relevance_score?: number | null
          score_justification?: string | null
          skills?: Json[] | null
        }
        Update: {
          application_date?: string | null
          application_status?: Database["public"]["Enums"]["application_status"]
          certifications?: Json[] | null
          cv_url?: string | null
          degrees?: Json[] | null
          desired_position?: string | null
          email?: string
          experiences?: Json[] | null
          id?: string
          interview_date?: string | null
          interview_id?: string | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          post_id?: string | null
          profile_summary?: string | null
          recruiter_assigned?: string | null
          relevance_score?: number | null
          score_justification?: string | null
          skills?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
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
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string
          created_at: string
          feedback: string | null
          id: string
          interview_status: Database["public"]["Enums"]["interviews_status"]
          location: string | null
          post_id: string
          recruiter_id: string
          scheduled_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          interview_status?: Database["public"]["Enums"]["interviews_status"]
          location?: string | null
          post_id: string
          recruiter_id: string
          scheduled_at: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          interview_status?: Database["public"]["Enums"]["interviews_status"]
          location?: string | null
          post_id?: string
          recruiter_id?: string
          scheduled_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string | null
          department: string | null
          description: string | null
          enterprise: string | null
          id: string
          location: string | null
          post_status: Database["public"]["Enums"]["Post_status"]
          title: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          enterprise?: string | null
          id?: string
          location?: string | null
          post_status?: Database["public"]["Enums"]["Post_status"]
          title: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          enterprise?: string | null
          id?: string
          location?: string | null
          post_status?: Database["public"]["Enums"]["Post_status"]
          title?: string
        }
        Relationships: []
      }
      recruiters: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      application_status: "To Be Reviewed" | "Relevant" | "Rejectable"
      candidate_match: "Exact Match" | "AI" | "No Match"
      evaluation_status: "Not Started" | "Scheduled" | "Hired" | "Rejected"
      interviews_status: "Scheduled" | "Retained" | "Rejected"
      Post_status: "Open" | "Close"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["To Be Reviewed", "Relevant", "Rejectable"],
      candidate_match: ["Exact Match", "AI", "No Match"],
      evaluation_status: ["Not Started", "Scheduled", "Hired", "Rejected"],
      interviews_status: ["Scheduled", "Retained", "Rejected"],
      Post_status: ["Open", "Close"],
    },
  },
} as const
