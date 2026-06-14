import { createClient } from '@supabase/supabase-js';

// Moderní publishable klíč (read-only veřejná data). Slouží jako fallback,
// když env klíče chybí nebo jsou ve starém legacy formátu (eyJ...), který
// Supabase zakázal 2026-04-26. Bez tohoto fallbacku renderoval web prázdná data.
const SUPABASE_URL_FALLBACK = 'https://nbhwnatadyubiuadfakx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_IrdFtruv53Z2RbXNRRWCcw_K0TD4_ml';
// Použij env klíč jen pokud je v novém formátu (sb_...), jinak publishable.
const sbKey = (k?: string) => {
  const v = k?.replace(/\s+/g, '');
  return v && v.startsWith('sb_') ? v : SUPABASE_PUBLISHABLE_KEY;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\s+/g, '') || SUPABASE_URL_FALLBACK;
const supabaseAnonKey = sbKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseServiceKey = sbKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

// Debug logging for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase environment variables:', {
    url: supabaseUrl ? 'SET' : 'MISSING',
    anonKey: supabaseAnonKey ? 'SET' : 'MISSING',
    serviceKey: supabaseServiceKey ? 'SET' : 'MISSING'
  });
}

if (!supabaseUrl) {
  throw new Error(`Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Current value: ${supabaseUrl}`);
}

if (!supabaseAnonKey) {
  throw new Error(`Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Current value: ${supabaseAnonKey}`);
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (with service role for data fetching)
export const supabaseAdmin = (supabaseServiceKey && supabaseServiceKey.length > 50) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase; // Fallback to regular client if service key is invalid

// ETF Fund type (based on your database)
export interface ETFFund {
  isin: string;
  name: string;
  fund_provider: string;
  domicile: string;
  currency: string;
  distribution_policy: string;
  replication: string;
  total_expense_ratio: number;
  fund_size: number;
  inception_date: string;
  benchmark: string;
  exchange: string;
  ticker: string;
  updated_at: string;
  created_at: string;
}