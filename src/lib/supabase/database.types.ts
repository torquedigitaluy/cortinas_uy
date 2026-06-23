// Tipos generados manualmente a partir de supabase/migrations/0001_init_schema.sql y
// 0002_rls_policies.sql (no hay Docker disponible en este entorno para correr
// `supabase gen types typescript` contra la base remota). Si el esquema cambia,
// actualizar este archivo a mano o regenerarlo con el CLI cuando haya Docker disponible:
// `npx supabase gen types typescript --db-url <url> --schema public`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          description: string | null;
          short_description: string | null;
          base_price: number | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name: string;
          description?: string | null;
          short_description?: string | null;
          base_price?: number | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          short_description?: string | null;
          base_price?: number | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          price: number;
          sku: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          price: number;
          sku?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          price?: number;
          sku?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      remax_agents: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          office: string | null;
          referral_code: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          office?: string | null;
          referral_code: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          office?: string | null;
          referral_code?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          id: string;
          service_type: "instalacion" | "reparacion" | "mantenimiento";
          full_name: string;
          phone: string;
          email: string | null;
          address: string | null;
          department: string | null;
          product_category_id: string | null;
          message: string | null;
          status: "nuevo" | "contactado" | "agendado" | "resuelto" | "descartado";
          is_remax_referral: boolean;
          remax_agent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_type: "instalacion" | "reparacion" | "mantenimiento";
          full_name: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          department?: string | null;
          product_category_id?: string | null;
          message?: string | null;
          status?: "nuevo" | "contactado" | "agendado" | "resuelto" | "descartado";
          is_remax_referral?: boolean;
          remax_agent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_type?: "instalacion" | "reparacion" | "mantenimiento";
          full_name?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          department?: string | null;
          product_category_id?: string | null;
          message?: string | null;
          status?: "nuevo" | "contactado" | "agendado" | "resuelto" | "descartado";
          is_remax_referral?: boolean;
          remax_agent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_requests_product_category_id_fkey";
            columns: ["product_category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_requests_remax_agent_id_fkey";
            columns: ["remax_agent_id"];
            isOneToOne: false;
            referencedRelation: "remax_agents";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          status: "pendiente" | "activa" | "vencida" | "cancelada";
          mercadopago_subscription_id: string | null;
          mercadopago_payer_id: string | null;
          start_date: string | null;
          next_billing_date: string | null;
          is_remax_client: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          status?: "pendiente" | "activa" | "vencida" | "cancelada";
          mercadopago_subscription_id?: string | null;
          mercadopago_payer_id?: string | null;
          start_date?: string | null;
          next_billing_date?: string | null;
          is_remax_client?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          status?: "pendiente" | "activa" | "vencida" | "cancelada";
          mercadopago_subscription_id?: string | null;
          mercadopago_payer_id?: string | null;
          start_date?: string | null;
          next_billing_date?: string | null;
          is_remax_client?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      membership_payments: {
        Row: {
          id: string;
          membership_id: string;
          mercadopago_payment_id: string;
          amount: number | null;
          status: string | null;
          paid_at: string | null;
          raw_payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          membership_id: string;
          mercadopago_payment_id: string;
          amount?: number | null;
          status?: string | null;
          paid_at?: string | null;
          raw_payload?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          membership_id?: string;
          mercadopago_payment_id?: string;
          amount?: number | null;
          status?: string | null;
          paid_at?: string | null;
          raw_payload?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "membership_payments_membership_id_fkey";
            columns: ["membership_id"];
            isOneToOne: false;
            referencedRelation: "memberships";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
