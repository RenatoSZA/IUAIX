import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseKey = typeof window !== 'undefined' 
  ? supabaseAnonKey 
  : (process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);

// Cria um cliente "dummy" se estiver no build ou faltando chave, evitando crash na hidratação
export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
}) : {} as any;
