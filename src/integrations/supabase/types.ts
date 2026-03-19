export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: number
          duration_unit: string
          end_date: string | null
          end_time: string | null
          group_id: string | null
          id: string
          invite_code: string | null
          is_single_day: boolean | null
          location: string | null
          notes: string | null
          start_date: string | null
          start_time: string | null
          status: string | null
          title: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          duration_unit?: string
          end_date?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          invite_code?: string | null
          is_single_day?: boolean | null
          location?: string | null
          notes?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: string | null
          title: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          duration_unit?: string
          end_date?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          invite_code?: string | null
          is_single_day?: boolean | null
          location?: string | null
          notes?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          left_at: string | null
          role: string | null
          status: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          left_at?: string | null
          role?: string | null
          status?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          activity_types: Json | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          invite_code: string
          name: string
          owner_id: string
          type: string | null
          visibility: string | null
        }
        Insert: {
          activity_types?: Json | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          invite_code?: string
          name: string
          owner_id: string
          type?: string | null
          visibility?: string | null
        }
        Update: {
          activity_types?: Json | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          invite_code?: string
          name?: string
          owner_id?: string
          type?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentorship_members: {
        Row: {
          id: string
          joined_at: string
          mentorship_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          mentorship_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          mentorship_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_members_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorships"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorships: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invite_code: string
          mentor_id: string
          name: string
          permissions: Json | null
          type: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string
          mentor_id: string
          name: string
          permissions?: Json | null
          type?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string
          mentor_id?: string
          name?: string
          permissions?: Json | null
          type?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_code: string | null
          action_id: string | null
          action_type: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          action_code?: string | null
          action_id?: string | null
          action_type?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          status?: string | null
          type?: string
          user_id: string
        }
        Update: {
          action_code?: string | null
          action_id?: string | null
          action_type?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_points: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          reflections: Json | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reflections?: Json | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reflections?: Json | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          church: string | null
          created_at: string
          email: string
          full_name: string
          greeting: string | null
          id: string
          spiritual_level: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          church?: string | null
          created_at?: string
          email?: string
          full_name?: string
          greeting?: string | null
          id: string
          spiritual_level?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          church?: string | null
          created_at?: string
          email?: string
          full_name?: string
          greeting?: string | null
          id?: string
          spiritual_level?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      program_participants: {
        Row: {
          id: string
          joined_at: string
          program_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          program_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          program_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_participants_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          invite_code: string
          name: string
          owner_id: string
          progress: number | null
          start_date: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          invite_code?: string
          name: string
          owner_id: string
          progress?: number | null
          start_date?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          invite_code?: string
          name?: string
          owner_id?: string
          progress?: number | null
          start_date?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      streaks: {
        Row: {
          created_at: string
          current_count: number
          enabled: boolean
          goal: number
          habit: string
          icon: string
          id: string
          last_date: string | null
          longest: number
          target_activity: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          enabled?: boolean
          goal?: number
          habit: string
          icon?: string
          id?: string
          last_date?: string | null
          longest?: number
          target_activity?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_count?: number
          enabled?: boolean
          goal?: number
          habit?: string
          icon?: string
          id?: string
          last_date?: string | null
          longest?: number
          target_activity?: string | null
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
