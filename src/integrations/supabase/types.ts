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
      ai_suggestions: {
        Row: {
          applied: boolean
          content: string
          created_at: string
          document_id: string
          id: string
          suggestion_type: string
        }
        Insert: {
          applied?: boolean
          content: string
          created_at?: string
          document_id: string
          id?: string
          suggestion_type: string
        }
        Update: {
          applied?: boolean
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          suggestion_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          document_id: string
          id: string
          resolved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          document_id: string
          id?: string
          resolved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          resolved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          content: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          change_summary: string | null
          content: Json
          created_at: string
          document_id: string
          id: string
          user_id: string | null
          version: number
        }
        Insert: {
          change_summary?: string | null
          content: Json
          created_at?: string
          document_id: string
          id?: string
          user_id?: string | null
          version: number
        }
        Update: {
          change_summary?: string | null
          content?: Json
          created_at?: string
          document_id?: string
          id?: string
          user_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          compliance_frameworks: string[] | null
          content: Json
          created_at: string
          evidence_ids: string[] | null
          id: string
          is_template: boolean
          mitre_attack_techniques: string[] | null
          sensitivity: string | null
          status: string
          tags: string[] | null
          team_id: string | null
          template_category: string | null
          title: string
          updated_at: string
          user_id: string | null
          version: number
        }
        Insert: {
          compliance_frameworks?: string[] | null
          content?: Json
          created_at?: string
          evidence_ids?: string[] | null
          id?: string
          is_template?: boolean
          mitre_attack_techniques?: string[] | null
          sensitivity?: string | null
          status?: string
          tags?: string[] | null
          team_id?: string | null
          template_category?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          version?: number
        }
        Update: {
          compliance_frameworks?: string[] | null
          content?: Json
          created_at?: string
          evidence_ids?: string[] | null
          id?: string
          is_template?: boolean
          mitre_attack_techniques?: string[] | null
          sensitivity?: string | null
          status?: string
          tags?: string[] | null
          team_id?: string | null
          template_category?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_connections: {
        Row: {
          connection_details: Json
          created_at: string
          id: string
          integration_type: string
          is_active: boolean
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_details?: Json
          created_at?: string
          id?: string
          integration_type: string
          is_active?: boolean
          team_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_details?: Json
          created_at?: string
          id?: string
          integration_type?: string
          is_active?: boolean
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_connections_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allow_marketing: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          expertise_areas: string[] | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          role: string | null
          subscription_plan: string | null
          subscription_tier: string | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          allow_marketing?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise_areas?: string[] | null
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          role?: string | null
          subscription_plan?: string | null
          subscription_tier?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          allow_marketing?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise_areas?: string[] | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          role?: string | null
          subscription_plan?: string | null
          subscription_tier?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_tickets: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          external_references: Json | null
          id: string
          labels: string[] | null
          priority: string
          reporter_id: string
          status: string
          team_id: string | null
          ticket_type: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          external_references?: Json | null
          id?: string
          labels?: string[] | null
          priority?: string
          reporter_id: string
          status?: string
          team_id?: string | null
          ticket_type: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          external_references?: Json | null
          id?: string
          labels?: string[] | null
          priority?: string
          reporter_id?: string
          status?: string
          team_id?: string | null
          ticket_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_tickets_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_features: {
        Row: {
          created_at: string
          feature_key: string
          id: string
          is_enabled: boolean
          max_usage: number | null
          subscription_tier: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          id?: string
          is_enabled?: boolean
          max_usage?: number | null
          subscription_tier: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          id?: string
          is_enabled?: boolean
          max_usage?: number | null
          subscription_tier?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string | null
          team_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          team_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          team_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          ticket_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          ticket_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          ticket_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "ticket_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "security_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_document_relations: {
        Row: {
          created_at: string
          created_by: string
          document_id: string
          id: string
          relation_type: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          document_id: string
          id?: string
          relation_type: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          document_id?: string
          id?: string
          relation_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_document_relations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_document_relations_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "security_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
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
      subscription_plan: "free" | "pro" | "team" | "enterprise"
      user_role:
        | "admin"
        | "editor"
        | "viewer"
        | "individual_basic"
        | "individual_professional"
        | "team_analyst"
        | "team_hunter"
        | "team_researcher"
        | "team_red"
        | "team_blue"
        | "team_lead"
        | "security_manager"
        | "ciso_director"
        | "platform_admin"
        | "knowledge_admin"
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
      subscription_plan: ["free", "pro", "team", "enterprise"],
      user_role: [
        "admin",
        "editor",
        "viewer",
        "individual_basic",
        "individual_professional",
        "team_analyst",
        "team_hunter",
        "team_researcher",
        "team_red",
        "team_blue",
        "team_lead",
        "security_manager",
        "ciso_director",
        "platform_admin",
        "knowledge_admin",
      ],
    },
  },
} as const
