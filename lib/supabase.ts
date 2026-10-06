import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseKey = typeof window !== 'undefined' 
  ? supabaseAnonKey 
  : (process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);

// Cria um cliente proxy se estiver no build ou faltando chave, que lança erro compreensível ao tentar usar.
export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
}) : new Proxy({} as any, {
  get: function(target, prop) {
    if (prop === 'then') return undefined; // Avoid promise resolution issues
    throw new Error(`Tentativa de acesso ao Supabase (propriedade '${String(prop)}') sem as chaves de ambiente configuradas.`);
  }
});
