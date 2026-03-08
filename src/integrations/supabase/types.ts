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
      consultation_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role?: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          allergies: string | null
          avatar_color: string | null
          blood_group: string | null
          conditions: string | null
          created_at: string
          date_of_birth: string | null
          gender: string | null
          id: string
          name: string
          notes: string | null
          relationship: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string | null
          avatar_color?: string | null
          blood_group?: string | null
          conditions?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          name: string
          notes?: string | null
          relationship?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string | null
          avatar_color?: string | null
          blood_group?: string | null
          conditions?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          name?: string
          notes?: string | null
          relationship?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      image_diagnoses: {
        Row: {
          condition_name: string | null
          condition_type: string | null
          confidence: string | null
          created_at: string
          diagnosis: string | null
          id: string
          image_url: string | null
          possible_conditions: Json | null
          recommendations: Json | null
          urgency: string | null
          user_id: string
          when_to_see_doctor: string | null
        }
        Insert: {
          condition_name?: string | null
          condition_type?: string | null
          confidence?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          image_url?: string | null
          possible_conditions?: Json | null
          recommendations?: Json | null
          urgency?: string | null
          user_id: string
          when_to_see_doctor?: string | null
        }
        Update: {
          condition_name?: string | null
          condition_type?: string | null
          confidence?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          image_url?: string | null
          possible_conditions?: Json | null
          recommendations?: Json | null
          urgency?: string | null
          user_id?: string
          when_to_see_doctor?: string | null
        }
        Relationships: []
      }
      medicine_votes: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      medicines: {
        Row: {
          brand: string | null
          category: string | null
          contraindications: string | null
          created_at: string
          description: string | null
          dosage_adult: string | null
          dosage_child: string | null
          id: string
          name: string
          pregnancy_safety: string | null
          price: number | null
          side_effects: string | null
          storage: string | null
          strength: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          contraindications?: string | null
          created_at?: string
          description?: string | null
          dosage_adult?: string | null
          dosage_child?: string | null
          id?: string
          name: string
          pregnancy_safety?: string | null
          price?: number | null
          side_effects?: string | null
          storage?: string | null
          strength?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          contraindications?: string | null
          created_at?: string
          description?: string | null
          dosage_adult?: string | null
          dosage_child?: string | null
          id?: string
          name?: string
          pregnancy_safety?: string | null
          price?: number | null
          side_effects?: string | null
          storage?: string | null
          strength?: string | null
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          activities: string | null
          created_at: string
          id: string
          mood: string
          mood_score: number
          notes: string | null
          triggers: string | null
          user_id: string
        }
        Insert: {
          activities?: string | null
          created_at?: string
          id?: string
          mood: string
          mood_score?: number
          notes?: string | null
          triggers?: string | null
          user_id: string
        }
        Update: {
          activities?: string | null
          created_at?: string
          id?: string
          mood?: string
          mood_score?: number
          notes?: string | null
          triggers?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_plans: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          fat: number
          id: string
          items: Json
          meal_name: string
          meal_time: string
          meal_type: string
          notes: string | null
          protein: number
          user_id: string
        }
        Insert: {
          calories?: number
          carbs?: number
          created_at?: string
          fat?: number
          id?: string
          items?: Json
          meal_name: string
          meal_time?: string
          meal_type?: string
          notes?: string | null
          protein?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          fat?: number
          id?: string
          items?: Json
          meal_name?: string
          meal_time?: string
          meal_type?: string
          notes?: string | null
          protein?: number
          user_id?: string
        }
        Relationships: []
      }
      pharmacy_inventory: {
        Row: {
          alternative_group: string | null
          batch_number: string | null
          brand: string | null
          category: string
          created_at: string
          expiry_date: string | null
          generic_name: string
          id: string
          is_prescription_required: boolean | null
          last_restocked_at: string | null
          medicine_name: string
          mrp: number | null
          price: number | null
          rack_location: string | null
          status: string
          stock_quantity: number
          strength: string | null
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          alternative_group?: string | null
          batch_number?: string | null
          brand?: string | null
          category?: string
          created_at?: string
          expiry_date?: string | null
          generic_name?: string
          id?: string
          is_prescription_required?: boolean | null
          last_restocked_at?: string | null
          medicine_name: string
          mrp?: number | null
          price?: number | null
          rack_location?: string | null
          status?: string
          stock_quantity?: number
          strength?: string | null
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          alternative_group?: string | null
          batch_number?: string | null
          brand?: string | null
          category?: string
          created_at?: string
          expiry_date?: string | null
          generic_name?: string
          id?: string
          is_prescription_required?: boolean | null
          last_restocked_at?: string | null
          medicine_name?: string
          mrp?: number | null
          price?: number | null
          rack_location?: string | null
          status?: string
          stock_quantity?: number
          strength?: string | null
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          clinic_name: string | null
          created_at: string
          date: string | null
          diagnosis: string | null
          hash: string | null
          id: string
          image_url: string | null
          medicines: Json | null
          prescribed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          clinic_name?: string | null
          created_at?: string
          date?: string | null
          diagnosis?: string | null
          hash?: string | null
          id?: string
          image_url?: string | null
          medicines?: Json | null
          prescribed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          clinic_name?: string | null
          created_at?: string
          date?: string | null
          diagnosis?: string | null
          hash?: string | null
          id?: string
          image_url?: string | null
          medicines?: Json | null
          prescribed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          adherence_score: number | null
          created_at: string
          dosage: string
          frequency: string
          id: string
          medicine_name: string
          missed_count: number | null
          notes: string | null
          reminder_time: string
          status: string
          taken_count: number | null
          user_id: string
        }
        Insert: {
          adherence_score?: number | null
          created_at?: string
          dosage?: string
          frequency?: string
          id?: string
          medicine_name: string
          missed_count?: number | null
          notes?: string | null
          reminder_time?: string
          status?: string
          taken_count?: number | null
          user_id: string
        }
        Update: {
          adherence_score?: number | null
          created_at?: string
          dosage?: string
          frequency?: string
          id?: string
          medicine_name?: string
          missed_count?: number | null
          notes?: string | null
          reminder_time?: string
          status?: string
          taken_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      symptom_logs: {
        Row: {
          created_at: string
          detected_symptoms: Json | null
          id: string
          possible_conditions: Json | null
          recommended_actions: Json | null
          risk_score: number | null
          severity: string | null
          symptoms: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detected_symptoms?: Json | null
          id?: string
          possible_conditions?: Json | null
          recommended_actions?: Json | null
          risk_score?: number | null
          severity?: string | null
          symptoms: string
          user_id: string
        }
        Update: {
          created_at?: string
          detected_symptoms?: Json | null
          id?: string
          possible_conditions?: Json | null
          recommended_actions?: Json | null
          risk_score?: number | null
          severity?: string | null
          symptoms?: string
          user_id?: string
        }
        Relationships: []
      }
      telemedicine_bookings: {
        Row: {
          appointment_date: string
          appointment_time: string
          consultation_type: string
          created_at: string
          doctor_country: string
          doctor_name: string
          doctor_specialty: string
          id: string
          notes: string | null
          price: string
          status: string
          timezone: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          consultation_type?: string
          created_at?: string
          doctor_country: string
          doctor_name: string
          doctor_specialty: string
          id?: string
          notes?: string | null
          price?: string
          status?: string
          timezone?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          consultation_type?: string
          created_at?: string
          doctor_country?: string
          doctor_name?: string
          doctor_specialty?: string
          id?: string
          notes?: string | null
          price?: string
          status?: string
          timezone?: string
          user_id?: string
        }
        Relationships: []
      }
      wearable_devices: {
        Row: {
          battery: number
          brand: string
          connected: boolean
          created_at: string
          icon: string
          id: string
          last_sync: string
          name: string
          sync_enabled: boolean
          type: string
          user_id: string
        }
        Insert: {
          battery?: number
          brand?: string
          connected?: boolean
          created_at?: string
          icon?: string
          id?: string
          last_sync?: string
          name: string
          sync_enabled?: boolean
          type?: string
          user_id: string
        }
        Update: {
          battery?: number
          brand?: string
          connected?: boolean
          created_at?: string
          icon?: string
          id?: string
          last_sync?: string
          name?: string
          sync_enabled?: boolean
          type?: string
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
      app_role: "patient" | "pharmacist" | "doctor" | "admin"
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
      app_role: ["patient", "pharmacist", "doctor", "admin"],
    },
  },
} as const
