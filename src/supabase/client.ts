
// src/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database.types';

const SUPABASE_URL = 'https://bdchftzcsugxttsbvavu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkY2hmdHpjc3VneHR0c2J2YXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzAyNzQsImV4cCI6MjA5MzgwNjI3NH0.ZVGqymLrSh1nFHqYqwuqvqT0d7Mihu4MjYGL2mNAk8I';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: -1,  // disables realtime connection
    },
  },
  global: {
    headers: {},
  },
  // Disable the realtime client from initializing entirely
  db: {
    schema: 'public',
  },
});

