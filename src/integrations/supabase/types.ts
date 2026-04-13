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
      hospital_bills: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          discount: number | null
          gst_amount: number | null
          id: string
          insurance_claim_id: string | null
          insurance_covered: number | null
          insurance_status: string | null
          items: Json | null
          patient_id: string
          payment_method: string | null
          payment_status: string | null
          subtotal: number | null
          token_id: string | null
          total_amount: number | null
          visit_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          discount?: number | null
          gst_amount?: number | null
          id?: string
          insurance_claim_id?: string | null
          insurance_covered?: number | null
          insurance_status?: string | null
          items?: Json | null
          patient_id: string
          payment_method?: string | null
          payment_status?: string | null
          subtotal?: number | null
          token_id?: string | null
          total_amount?: number | null
          visit_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          discount?: number | null
          gst_amount?: number | null
          id?: string
          insurance_claim_id?: string | null
          insurance_covered?: number | null
          insurance_status?: string | null
          items?: Json | null
          patient_id?: string
          payment_method?: string | null
          payment_status?: string | null
          subtotal?: number | null
          token_id?: string | null
          total_amount?: number | null
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_bills_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_bills_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "hospital_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_bills_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "hospital_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_departments: {
        Row: {
          created_at: string | null
          description: string | null
          floor: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          floor?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          floor?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      hospital_doctors: {
        Row: {
          availability_status: string | null
          created_at: string | null
          department_id: string | null
          email: string | null
          experience_years: number | null
          id: string
          is_verified: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          qualification: string | null
          rating_avg: number | null
          rating_count: number | null
          room_number: string | null
          schedule: Json | null
          speciality: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          qualification?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          room_number?: string | null
          schedule?: Json | null
          speciality?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          qualification?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          room_number?: string | null
          schedule?: Json | null
          speciality?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_doctors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hospital_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_loyalty: {
        Row: {
          badge_name: string | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          patient_id: string
          points: number | null
        }
        Insert: {
          badge_name?: string | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          patient_id: string
          points?: number | null
        }
        Update: {
          badge_name?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          patient_id?: string
          points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_loyalty_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_notifications_log: {
        Row: {
          channel: string | null
          id: string
          is_read: boolean | null
          message: string
          patient_id: string | null
          sent_at: string | null
          stage: string
          token_id: string | null
        }
        Insert: {
          channel?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          patient_id?: string | null
          sent_at?: string | null
          stage: string
          token_id?: string | null
        }
        Update: {
          channel?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          patient_id?: string | null
          sent_at?: string | null
          stage?: string
          token_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_notifications_log_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_notifications_log_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "hospital_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_orders: {
        Row: {
          centre_name: string | null
          completed_at: string | null
          created_at: string | null
          floor_location: string | null
          id: string
          injection_details: string | null
          lab_tests: Json | null
          medicines: Json | null
          order_details: string | null
          order_type: string
          patient_id: string
          queue_position: number | null
          referring_doctor_id: string | null
          result_data: Json | null
          result_notes: string | null
          result_uploaded_at: string | null
          scan_type: string | null
          seen_at: string | null
          started_at: string | null
          status: string | null
          token_id: string
          updated_at: string | null
          visit_id: string
        }
        Insert: {
          centre_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          floor_location?: string | null
          id?: string
          injection_details?: string | null
          lab_tests?: Json | null
          medicines?: Json | null
          order_details?: string | null
          order_type: string
          patient_id: string
          queue_position?: number | null
          referring_doctor_id?: string | null
          result_data?: Json | null
          result_notes?: string | null
          result_uploaded_at?: string | null
          scan_type?: string | null
          seen_at?: string | null
          started_at?: string | null
          status?: string | null
          token_id: string
          updated_at?: string | null
          visit_id: string
        }
        Update: {
          centre_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          floor_location?: string | null
          id?: string
          injection_details?: string | null
          lab_tests?: Json | null
          medicines?: Json | null
          order_details?: string | null
          order_type?: string
          patient_id?: string
          queue_position?: number | null
          referring_doctor_id?: string | null
          result_data?: Json | null
          result_notes?: string | null
          result_uploaded_at?: string | null
          scan_type?: string | null
          seen_at?: string | null
          started_at?: string | null
          status?: string | null
          token_id?: string
          updated_at?: string | null
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_orders_referring_doctor_id_fkey"
            columns: ["referring_doctor_id"]
            isOneToOne: false
            referencedRelation: "hospital_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_orders_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "hospital_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_orders_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "hospital_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_patients: {
        Row: {
          aadhaar: string | null
          allergies: string | null
          blood_group: string | null
          chronic_diseases: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          family_head_id: string | null
          gender: string | null
          health_id: string
          id: string
          is_family_head: boolean | null
          language_preference: string | null
          last_visit_date: string | null
          last_visit_summary: string | null
          loyalty_points: number | null
          name: string
          phone: string | null
          photo_url: string | null
          total_visits: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aadhaar?: string | null
          allergies?: string | null
          blood_group?: string | null
          chronic_diseases?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          family_head_id?: string | null
          gender?: string | null
          health_id: string
          id?: string
          is_family_head?: boolean | null
          language_preference?: string | null
          last_visit_date?: string | null
          last_visit_summary?: string | null
          loyalty_points?: number | null
          name: string
          phone?: string | null
          photo_url?: string | null
          total_visits?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aadhaar?: string | null
          allergies?: string | null
          blood_group?: string | null
          chronic_diseases?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          family_head_id?: string | null
          gender?: string | null
          health_id?: string
          id?: string
          is_family_head?: boolean | null
          language_preference?: string | null
          last_visit_date?: string | null
          last_visit_summary?: string | null
          loyalty_points?: number | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          total_visits?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_patients_family_head_id_fkey"
            columns: ["family_head_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_queue_bookings: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          department: string
          estimated_wait: number | null
          hospital_name: string
          id: string
          notes: string | null
          queue_position: number | null
          status: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          department: string
          estimated_wait?: number | null
          hospital_name: string
          id?: string
          notes?: string | null
          queue_position?: number | null
          status?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          department?: string
          estimated_wait?: number | null
          hospital_name?: string
          id?: string
          notes?: string | null
          queue_position?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      hospital_slots: {
        Row: {
          booked_by: string | null
          created_at: string | null
          department_id: string | null
          doctor_id: string | null
          id: string
          is_booked: boolean | null
          slot_date: string
          slot_time: string
        }
        Insert: {
          booked_by?: string | null
          created_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          id?: string
          is_booked?: boolean | null
          slot_date: string
          slot_time: string
        }
        Update: {
          booked_by?: string | null
          created_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          id?: string
          is_booked?: boolean | null
          slot_date?: string
          slot_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_slots_booked_by_fkey"
            columns: ["booked_by"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_slots_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hospital_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "hospital_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_tokens: {
        Row: {
          ai_suggested_department: string | null
          created_at: string | null
          department_id: string | null
          doctor_id: string | null
          entry_type: string | null
          estimated_wait_minutes: number | null
          follow_up_from: string | null
          id: string
          is_emergency: boolean | null
          is_follow_up: boolean | null
          patient_id: string
          qr_code: string | null
          queue_position: number | null
          severity: string | null
          status: string | null
          symptoms: string | null
          token_date: string | null
          token_number: number
          updated_at: string | null
        }
        Insert: {
          ai_suggested_department?: string | null
          created_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          entry_type?: string | null
          estimated_wait_minutes?: number | null
          follow_up_from?: string | null
          id?: string
          is_emergency?: boolean | null
          is_follow_up?: boolean | null
          patient_id: string
          qr_code?: string | null
          queue_position?: number | null
          severity?: string | null
          status?: string | null
          symptoms?: string | null
          token_date?: string | null
          token_number: number
          updated_at?: string | null
        }
        Update: {
          ai_suggested_department?: string | null
          created_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          entry_type?: string | null
          estimated_wait_minutes?: number | null
          follow_up_from?: string | null
          id?: string
          is_emergency?: boolean | null
          is_follow_up?: boolean | null
          patient_id?: string
          qr_code?: string | null
          queue_position?: number | null
          severity?: string | null
          status?: string | null
          symptoms?: string | null
          token_date?: string | null
          token_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_tokens_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hospital_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_tokens_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "hospital_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_tokens_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_visits: {
        Row: {
          ai_suggestions: Json | null
          completed_at: string | null
          created_at: string | null
          diagnosis: string | null
          doctor_id: string | null
          drug_warnings: Json | null
          follow_up_date: string | null
          follow_up_days: number | null
          id: string
          next_steps: Json | null
          notes: string | null
          patient_feedback: string | null
          patient_id: string
          patient_rating: number | null
          prescription: Json | null
          started_at: string | null
          symptoms: string | null
          token_id: string
          updated_at: string | null
          visit_stage: string | null
        }
        Insert: {
          ai_suggestions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          drug_warnings?: Json | null
          follow_up_date?: string | null
          follow_up_days?: number | null
          id?: string
          next_steps?: Json | null
          notes?: string | null
          patient_feedback?: string | null
          patient_id: string
          patient_rating?: number | null
          prescription?: Json | null
          started_at?: string | null
          symptoms?: string | null
          token_id: string
          updated_at?: string | null
          visit_stage?: string | null
        }
        Update: {
          ai_suggestions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          drug_warnings?: Json | null
          follow_up_date?: string | null
          follow_up_days?: number | null
          id?: string
          next_steps?: Json | null
          notes?: string | null
          patient_feedback?: string | null
          patient_id?: string
          patient_rating?: number | null
          prescription?: Json | null
          started_at?: string | null
          symptoms?: string | null
          token_id?: string
          updated_at?: string | null
          visit_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_visits_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "hospital_doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hospital_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_visits_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "hospital_tokens"
            referencedColumns: ["id"]
          },
        ]
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
      notification_settings: {
        Row: {
          appointment_notifications: boolean
          created_at: string
          email_enabled: boolean
          health_alerts: boolean
          id: string
          prescription_notifications: boolean
          promotional: boolean
          push_enabled: boolean
          quiet_hours_enabled: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          reminder_notifications: boolean
          sms_enabled: boolean
          sms_phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_notifications?: boolean
          created_at?: string
          email_enabled?: boolean
          health_alerts?: boolean
          id?: string
          prescription_notifications?: boolean
          promotional?: boolean
          push_enabled?: boolean
          quiet_hours_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_notifications?: boolean
          sms_enabled?: boolean
          sms_phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_notifications?: boolean
          created_at?: string
          email_enabled?: boolean
          health_alerts?: boolean
          id?: string
          prescription_notifications?: boolean
          promotional?: boolean
          push_enabled?: boolean
          quiet_hours_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_notifications?: boolean
          sms_enabled?: boolean
          sms_phone_number?: string | null
          updated_at?: string
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
      get_user_patient_id: { Args: never; Returns: string }
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
