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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_last_four: string | null
          bank_name: string
          created_at: string
          id: string
          is_connected: boolean
          is_primary: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_last_four?: string | null
          bank_name: string
          created_at?: string
          id?: string
          is_connected?: boolean
          is_primary?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_last_four?: string | null
          bank_name?: string
          created_at?: string
          id?: string
          is_connected?: boolean
          is_primary?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          category: string
          created_at: string
          due_date: string
          id: string
          name: string
          paid_at: string | null
          status: Database["public"]["Enums"]["bill_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          due_date: string
          id?: string
          name: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["bill_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          due_date?: string
          id?: string
          name?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["bill_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_installments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          paid_at: string | null
          payment_plan_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          paid_at?: string | null
          payment_plan_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          paid_at?: string | null
          payment_plan_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_installments_payment_plan_id_fkey"
            columns: ["payment_plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          amount_paid: number
          bill_id: string | null
          created_at: string
          id: string
          installment_amount: number
          installments_paid: number
          installments_total: number
          next_payment_date: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number
          bill_id?: string | null
          created_at?: string
          id?: string
          installment_amount: number
          installments_paid?: number
          installments_total?: number
          next_payment_date?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          bill_id?: string | null
          created_at?: string
          id?: string
          installment_amount?: number
          installments_paid?: number
          installments_total?: number
          next_payment_date?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          documents_verified: boolean | null
          drivers_license_url: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          paystub_url: string | null
          referral_code: string | null
          referred_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          documents_verified?: boolean | null
          drivers_license_url?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          paystub_url?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          documents_verified?: boolean | null
          drivers_license_url?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          paystub_url?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_amount: number
          reward_paid: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_amount?: number
          reward_paid?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          reward_amount?: number
          reward_paid?: boolean
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          access_limit: number
          access_used: number
          created_at: string
          id: string
          is_active: boolean
          next_settlement_date: string | null
          settlement_frequency: string | null
          settlement_timing: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          access_limit?: number
          access_used?: number
          created_at?: string
          id?: string
          is_active?: boolean
          next_settlement_date?: string | null
          settlement_frequency?: string | null
          settlement_timing?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          access_limit?: number
          access_used?: number
          created_at?: string
          id?: string
          is_active?: boolean
          next_settlement_date?: string | null
          settlement_frequency?: string | null
          settlement_timing?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          insurance_provider: string | null
          insurance_verified: boolean
          is_verified: boolean
          license_plate: string | null
          make: string | null
          model: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          insurance_provider?: string | null
          insurance_verified?: boolean
          is_verified?: boolean
          license_plate?: string | null
          make?: string | null
          model?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          insurance_provider?: string | null
          insurance_verified?: boolean
          is_verified?: boolean
          license_plate?: string | null
          make?: string | null
          model?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          vin?: string | null
          year?: number | null
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
      bill_status: "pending" | "scheduled" | "paid" | "failed"
      subscription_tier: "basic" | "plus" | "auto_plus"
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
      bill_status: ["pending", "scheduled", "paid", "failed"],
      subscription_tier: ["basic", "plus", "auto_plus"],
    },
  },
} as const
