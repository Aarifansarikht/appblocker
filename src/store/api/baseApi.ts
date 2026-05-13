// src/store/api/baseApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query base with fakeBaseQuery — all endpoints use Supabase directly
 * instead of a REST/GraphQL HTTP layer.
 *
 * Tag types drive cache invalidation across all injected API slices.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'Auth',
    'Profile',
    'Skills',
    'UserProgress',
    'StorageFile',
  ],
  endpoints: () => ({}),
});