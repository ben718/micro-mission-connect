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
      badges: {
        Row: {
          created_at: string
          description: string | null
          image_url: string | null
          id: string
          name: string
          requirements: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          image_url?: string | null
          id?: string
          name: string
          requirements?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          image_url?: string | null
          id?: string
          name?: string
          requirements?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organization_sectors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      mission_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          city: string | null
          created_at: string
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          postal_code: string | null
          profile_picture_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          postal_code?: string | null
          profile_picture_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          postal_code?: string | null
          profile_picture_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_profiles: {
        Row: {
          address: string | null
          created_at: string
          creation_date: string | null
          description: string | null
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          organization_name: string
          sector_id: string | null
          siret_number: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          creation_date?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          organization_name: string
          sector_id?: string | null
          siret_number?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          creation_date?: string | null
          description?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          organization_name?: string
          sector_id?: string | null
          siret_number?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_profiles_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "organization_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      missions: {
        Row: {
          available_spots: number
          created_at: string
          description: string
          desired_impact: string | null
          difficulty_level: string | null
          duration_minutes: number
          end_date: string | null
          engagement_level: string | null
          format: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          mission_type_id: string | null
          organization_id: string
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          available_spots?: number
          created_at?: string
          description: string
          desired_impact?: string | null
          difficulty_level?: string | null
          duration_minutes: number
          end_date?: string | null
          engagement_level?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          mission_type_id?: string | null
          organization_id: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          available_spots?: number
          created_at?: string
          description?: string
          desired_impact?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          end_date?: string | null
          engagement_level?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          mission_type_id?: string | null
          organization_id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_mission_type_id_fkey"
            columns: ["mission_type_id"]
            isOneToOne: false
            referencedRelation: "mission_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      mission_skills: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          mission_id: string
          required_level: string | null
          skill_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          mission_id: string
          required_level?: string | null
          skill_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          mission_id?: string
          required_level?: string | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_skills_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          }
        ]
      }
      mission_registrations: {
        Row: {
          confirmation_date: string | null
          created_at: string
          id: string
          mission_id: string
          organization_feedback: string | null
          organization_rating: number | null
          registration_date: string
          status: string
          updated_at: string
          user_id: string
          volunteer_feedback: string | null
          volunteer_rating: number | null
        }
        Insert: {
          confirmation_date?: string | null
          created_at?: string
          id?: string
          mission_id: string
          organization_feedback?: string | null
          organization_rating?: number | null
          registration_date?: string
          status?: string
          updated_at?: string
          user_id: string
          volunteer_feedback?: string | null
          volunteer_rating?: number | null
        }
        Update: {
          confirmation_date?: string | null
          created_at?: string
          id?: string
          mission_id?: string
          organization_feedback?: string | null
          organization_rating?: number | null
          registration_date?: string
          status?: string
          updated_at?: string
          user_id?: string
          volunteer_feedback?: string | null
          volunteer_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_registrations_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          level: string | null
          skill_id: string
          updated_at: string
          user_id: string
          validation_date: string | null
          validator_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string | null
          skill_id: string
          updated_at?: string
          user_id: string
          validation_date?: string | null
          validator_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string | null
          skill_id?: string
          updated_at?: string
          user_id?: string
          validation_date?: string | null
          validator_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_validator_id_fkey"
            columns: ["validator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_badges: {
        Row: {
          acquisition_date: string
          badge_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          acquisition_date?: string
          badge_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          acquisition_date?: string
          badge_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          is_visible: boolean
          job_title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_visible?: boolean
          job_title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          job_title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          link_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          link_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      available_missions_details: {
        Row: {
          available_spots: number | null
          description: string | null
          desired_impact: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          engagement_level: string | null
          format: string | null
          image_url: string | null
          latitude: number | null
          location: string | null
          logo_url: string | null
          longitude: number | null
          mission_id: string | null
          mission_type_name: string | null
          organization_name: string | null
          required_skills: string[] | null
          sector_name: string | null
          start_date: string | null
          title: string | null
        }
        Relationships: []
      }
      missions_by_location: {
        Row: {
          location: string | null
          mission_count: number | null
        }
        Relationships: []
      }
      popular_skills: {
        Row: {
          id: string | null
          mission_count: number | null
          name: string | null
        }
        Relationships: []
      }
      active_volunteers: {
        Row: {
          completed_missions: number | null
          first_name: string | null
          id: string | null
          last_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      nearby_missions: {
        Args: {
          user_uuid: string
          max_distance_km?: number
        }
        Returns: {
          mission_id: string
          title: string
          organization_name: string
          start_date: string
          duration_minutes: number
          distance_km: number
          mission_type_name: string
          sector_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
