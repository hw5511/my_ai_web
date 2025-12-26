import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ufjdbatzdhqhvsszxosg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmamRiYXR6ZGhxaHZzc3p4b3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTgwODEsImV4cCI6MjA4MTY5NDA4MX0.E3BHkRoIY5BQWfzWxVTRxzrwCjbGAyUm01g0zQGvn8g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
