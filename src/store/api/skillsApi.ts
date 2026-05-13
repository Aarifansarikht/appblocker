// src/store/api/skillsApi.ts
import { baseApi } from './baseApi';
import { supabase } from '../../supabase/client';
import {
  Skill,
  SkillInsert,
  SkillUpdate,
  UserProgress,
  UserProgressUpdate,
} from '../../types/database.types';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface SkillsQueryParams extends PaginationParams {
  userId?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  isPublic?: boolean;
  search?: string;
}

export const skillsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── List Skills (paginated + filtered) ────────────────────────────────
    getSkills: builder.query<{ data: Skill[]; count: number }, SkillsQueryParams>({
      queryFn: async ({ userId, category, level, isPublic, search, page = 1, pageSize = 20 }) => {
        let query = supabase
          .from('skills')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (userId) query = query.eq('user_id', userId);
        if (category) query = query.eq('category', category);
        if (level) query = query.eq('level', level);
        if (isPublic !== undefined) query = query.eq('is_public', isPublic);
        if (search) query = query.ilike('title', `%${search}%`);

        const { data, error, count } = await query;
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: { data: data ?? [], count: count ?? 0 } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Skills' as const, id })),
              { type: 'Skills', id: 'LIST' },
            ]
          : [{ type: 'Skills', id: 'LIST' }],
    }),

    // ── Get Single Skill ──────────────────────────────────────────────────
    getSkillById: builder.query<Skill, string>({
      queryFn: async (skillId) => {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('id', skillId)
          .single();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data };
      },
      providesTags: (_result, _error, id) => [{ type: 'Skills', id }],
    }),

    // ── Create Skill ──────────────────────────────────────────────────────
    createSkill: builder.mutation<Skill, SkillInsert>({
      queryFn: async (payload:any) => {
        const { data, error } = await supabase
          .from('skills')
          .insert(payload)
          .select()
          .single();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data };
      },
      invalidatesTags: [{ type: 'Skills', id: 'LIST' }],
    }),

    // ── Update Skill ──────────────────────────────────────────────────────
    updateSkill: builder.mutation<Skill, { skillId: string; updates: SkillUpdate }>({
      queryFn: async ({ skillId, updates }) => {
        const { data, error } = await supabase
          .from('skills')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', skillId)
          .select()
          .single();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data };
      },
      invalidatesTags: (_result, _error, { skillId }) => [{ type: 'Skills', id: skillId }],
    }),

    // ── Delete Skill ──────────────────────────────────────────────────────
    deleteSkill: builder.mutation<void, string>({
      queryFn: async (skillId) => {
        const { error } = await supabase.from('skills').delete().eq('id', skillId);
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, skillId) => [
        { type: 'Skills', id: skillId },
        { type: 'Skills', id: 'LIST' },
      ],
    }),

    // ── Get User Progress ─────────────────────────────────────────────────
    getUserProgress: builder.query<UserProgress[], string>({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .order('last_accessed_at', { ascending: false });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: data ?? [] };
      },
      providesTags: (_result, _error, userId) => [{ type: 'UserProgress', id: userId }],
    }),

    // ── Upsert Progress ───────────────────────────────────────────────────
    upsertProgress: builder.mutation<
      UserProgress,
      { userId: string; skillId: string; updates: UserProgressUpdate }
    >({
      queryFn: async ({ userId, skillId, updates }) => {
        const { data, error } = await supabase
          .from('user_progress')
          .upsert(
            {
              user_id: userId,
              skill_id: skillId,
              ...updates,
              
              last_accessed_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,skill_id' }
          )
          .select()
          .single();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data };
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'UserProgress', id: userId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetUserProgressQuery,
  useUpsertProgressMutation,
} = skillsApi;