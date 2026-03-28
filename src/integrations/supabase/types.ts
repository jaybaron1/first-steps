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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ab_assignments: {
        Row: {
          created_at: string | null
          experiment_id: string | null
          id: string
          session_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string | null
          experiment_id?: string | null
          id?: string
          session_id: string
          variant_id: string
        }
        Update: {
          created_at?: string | null
          experiment_id?: string | null
          id?: string
          session_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_conversions: {
        Row: {
          conversion_type: string
          created_at: string | null
          experiment_id: string | null
          id: string
          session_id: string
          variant_id: string
        }
        Insert: {
          conversion_type: string
          created_at?: string | null
          experiment_id?: string | null
          id?: string
          session_id: string
          variant_id: string
        }
        Update: {
          conversion_type?: string
          created_at?: string | null
          experiment_id?: string | null
          id?: string
          session_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_conversions_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_experiments: {
        Row: {
          created_at: string | null
          description: string | null
          element_selector: string
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          traffic_percent: number | null
          variants: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          element_selector: string
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          traffic_percent?: number | null
          variants?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          element_selector?: string
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          traffic_percent?: number | null
          variants?: Json
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          created_at: string
          id: string
          last_activity: string
          session_token: string
          terminated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity?: string
          session_token: string
          terminated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string
          session_token?: string
          terminated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      attribution_credits: {
        Row: {
          attributed_revenue: number
          calculated_at: string
          credit_percent: number
          deal_id: string
          id: string
          model: Database["public"]["Enums"]["attribution_model"]
          touchpoint_id: string
        }
        Insert: {
          attributed_revenue?: number
          calculated_at?: string
          credit_percent: number
          deal_id: string
          id?: string
          model: Database["public"]["Enums"]["attribution_model"]
          touchpoint_id: string
        }
        Update: {
          attributed_revenue?: number
          calculated_at?: string
          credit_percent?: number
          deal_id?: string
          id?: string
          model?: Database["public"]["Enums"]["attribution_model"]
          touchpoint_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribution_credits_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribution_credits_touchpoint_id_fkey"
            columns: ["touchpoint_id"]
            isOneToOne: false
            referencedRelation: "attribution_touchpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      attribution_touchpoints: {
        Row: {
          campaign: string | null
          channel: string | null
          content: string | null
          created_at: string
          deal_id: string
          id: string
          is_converting_touch: boolean | null
          medium: string | null
          metadata: Json | null
          page_url: string | null
          session_id: string | null
          source: string | null
          touchpoint_time: string
          touchpoint_type: string
        }
        Insert: {
          campaign?: string | null
          channel?: string | null
          content?: string | null
          created_at?: string
          deal_id: string
          id?: string
          is_converting_touch?: boolean | null
          medium?: string | null
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          source?: string | null
          touchpoint_time?: string
          touchpoint_type: string
        }
        Update: {
          campaign?: string | null
          channel?: string | null
          content?: string | null
          created_at?: string
          deal_id?: string
          id?: string
          is_converting_touch?: boolean | null
          medium?: string | null
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          source?: string | null
          touchpoint_time?: string
          touchpoint_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribution_touchpoints_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          actual_spend: number | null
          budget: number | null
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          actual_spend?: number | null
          budget?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          actual_spend?: number | null
          budget?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      conversion_goals: {
        Row: {
          created_at: string
          description: string | null
          goal_config: Json
          goal_type: string
          id: string
          name: string
          status: string
          value: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          goal_config?: Json
          goal_type: string
          id?: string
          name: string
          status?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          goal_config?: Json
          goal_type?: string
          id?: string
          name?: string
          status?: string
          value?: number | null
        }
        Relationships: []
      }
      customer_cohorts: {
        Row: {
          churn_reason: string | null
          churned_at: string | null
          cohort_month: string
          created_at: string
          customer_id: string
          first_revenue_date: string
          id: string
          is_churned: boolean | null
          last_activity_date: string | null
          metadata: Json | null
          total_lifetime_value: number | null
          updated_at: string
        }
        Insert: {
          churn_reason?: string | null
          churned_at?: string | null
          cohort_month: string
          created_at?: string
          customer_id: string
          first_revenue_date: string
          id?: string
          is_churned?: boolean | null
          last_activity_date?: string | null
          metadata?: Json | null
          total_lifetime_value?: number | null
          updated_at?: string
        }
        Update: {
          churn_reason?: string | null
          churned_at?: string | null
          cohort_month?: string
          created_at?: string
          customer_id?: string
          first_revenue_date?: string
          id?: string
          is_churned?: boolean | null
          last_activity_date?: string | null
          metadata?: Json | null
          total_lifetime_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      deal_stage_history: {
        Row: {
          changed_at: string
          created_at: string
          deal_id: string
          duration_hours: number | null
          from_stage: Database["public"]["Enums"]["deal_stage"] | null
          id: string
          to_stage: Database["public"]["Enums"]["deal_stage"]
        }
        Insert: {
          changed_at?: string
          created_at?: string
          deal_id: string
          duration_hours?: number | null
          from_stage?: Database["public"]["Enums"]["deal_stage"] | null
          id?: string
          to_stage: Database["public"]["Enums"]["deal_stage"]
        }
        Update: {
          changed_at?: string
          created_at?: string
          deal_id?: string
          duration_hours?: number | null
          from_stage?: Database["public"]["Enums"]["deal_stage"] | null
          id?: string
          to_stage?: Database["public"]["Enums"]["deal_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "deal_stage_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_close_date: string | null
          company: string | null
          created_at: string
          expected_close_date: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          name: string
          notes: string | null
          owner_email: string | null
          probability: number | null
          stage: Database["public"]["Enums"]["deal_stage"]
          updated_at: string
          value: number
        }
        Insert: {
          actual_close_date?: string | null
          company?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          owner_email?: string | null
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          updated_at?: string
          value?: number
        }
        Update: {
          actual_close_date?: string | null
          company?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          owner_email?: string | null
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_steps: {
        Row: {
          created_at: string | null
          funnel_name: string | null
          id: string
          name: string
          step_order: number
          url_pattern: string
        }
        Insert: {
          created_at?: string | null
          funnel_name?: string | null
          id?: string
          name: string
          step_order: number
          url_pattern: string
        }
        Update: {
          created_at?: string | null
          funnel_name?: string | null
          id?: string
          name?: string
          step_order?: number
          url_pattern?: string
        }
        Relationships: []
      }
      goal_completions: {
        Row: {
          completed_at: string
          goal_id: string
          id: string
          metadata: Json | null
          session_id: string
        }
        Insert: {
          completed_at?: string
          goal_id: string
          id?: string
          metadata?: Json | null
          session_id: string
        }
        Update: {
          completed_at?: string
          goal_id?: string
          id?: string
          metadata?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_completions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "conversion_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      keep_alive_logs: {
        Row: {
          executed_at: string
          id: string
          response_time_ms: number | null
          status: string
        }
        Insert: {
          executed_at?: string
          id?: string
          response_time_ms?: number | null
          status: string
        }
        Update: {
          executed_at?: string
          id?: string
          response_time_ms?: number | null
          status?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          lead_score: number | null
          message: string | null
          metadata: Json | null
          name: string | null
          phone: string | null
          session_id: string | null
          sheets_synced_at: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lead_score?: number | null
          message?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          session_id?: string | null
          sheets_synced_at?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lead_score?: number | null
          message?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          session_id?: string | null
          sheets_synced_at?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      page_views: {
        Row: {
          created_at: string | null
          id: string
          page_title: string | null
          page_url: string
          scroll_depth: number | null
          session_id: string | null
          time_on_page: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_title?: string | null
          page_url: string
          scroll_depth?: number | null
          session_id?: string | null
          time_on_page?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_title?: string | null
          page_url?: string
          scroll_depth?: number | null
          session_id?: string | null
          time_on_page?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      revenue_events: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          deal_id: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          deal_id: string
          description?: string | null
          event_date?: string
          event_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          deal_id?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_events_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      section_engagement: {
        Row: {
          created_at: string | null
          entered_at: string | null
          entry_scroll_depth: number | null
          exit_scroll_depth: number | null
          exited_at: string | null
          focus_duration_seconds: number | null
          id: string
          page_url: string
          section_id: string
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          entered_at?: string | null
          entry_scroll_depth?: number | null
          exit_scroll_depth?: number | null
          exited_at?: string | null
          focus_duration_seconds?: number | null
          id?: string
          page_url: string
          section_id: string
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          entered_at?: string | null
          entry_scroll_depth?: number | null
          exit_scroll_depth?: number | null
          exited_at?: string | null
          focus_duration_seconds?: number | null
          id?: string
          page_url?: string
          section_id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_engagement_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      visitor_sessions: {
        Row: {
          browser: string | null
          city: string | null
          company_industry: string | null
          company_name: string | null
          company_size: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          fingerprint_hash: string | null
          first_seen: string | null
          id: string
          ip_address: unknown
          language: string | null
          last_seen: string | null
          latitude: number | null
          lead_score: number | null
          longitude: number | null
          os: string | null
          page_views: number | null
          referrer: string | null
          screen_resolution: string | null
          session_id: string
          timezone: string | null
          total_time_seconds: number | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          viewport_size: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          company_industry?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          fingerprint_hash?: string | null
          first_seen?: string | null
          id?: string
          ip_address?: unknown
          language?: string | null
          last_seen?: string | null
          latitude?: number | null
          lead_score?: number | null
          longitude?: number | null
          os?: string | null
          page_views?: number | null
          referrer?: string | null
          screen_resolution?: string | null
          session_id: string
          timezone?: string | null
          total_time_seconds?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewport_size?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          company_industry?: string | null
          company_name?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          fingerprint_hash?: string | null
          first_seen?: string | null
          id?: string
          ip_address?: unknown
          language?: string | null
          last_seen?: string | null
          latitude?: number | null
          lead_score?: number | null
          longitude?: number | null
          os?: string | null
          page_views?: number | null
          referrer?: string | null
          screen_resolution?: string | null
          session_id?: string
          timezone?: string | null
          total_time_seconds?: number | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewport_size?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_attribution: {
        Args: {
          p_deal_id: string
          p_model: Database["public"]["Enums"]["attribution_model"]
        }
        Returns: {
          attributed_revenue: number
          credit_percent: number
          touchpoint_id: string
        }[]
      }
      calculate_lead_score: { Args: { p_session_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      attribution_model:
        | "first_touch"
        | "last_touch"
        | "linear"
        | "time_decay"
        | "position_based"
      deal_stage:
        | "lead"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      attribution_model: [
        "first_touch",
        "last_touch",
        "linear",
        "time_decay",
        "position_based",
      ],
      deal_stage: [
        "lead",
        "qualified",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
    },
  },
} as const
