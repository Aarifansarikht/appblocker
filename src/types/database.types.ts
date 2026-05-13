// src/types/database.types.ts
// Auto-generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          phone: string | null;
          is_guest: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          phone?: string | null;
          is_guest?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          phone?: string | null;
          is_guest?: boolean;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          level?: 'beginner' | 'intermediate' | 'advanced';
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: string;
          level?: 'beginner' | 'intermediate' | 'advanced';
          is_public?: boolean;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          progress_percentage: number;
          completed: boolean;
          last_accessed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          progress_percentage?: number;
          completed?: boolean;
          last_accessed_at?: string;
          created_at?: string;
        };
        Update: {
          progress_percentage?: number;
          completed?: boolean;
          last_accessed_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      skill_level: 'beginner' | 'intermediate' | 'advanced';
    };
  };
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];
export type SkillUpdate = Database['public']['Tables']['skills']['Update'];

export type UserProgress = Database['public']['Tables']['user_progress']['Row'];
export type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
export type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update'];