import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\s+/g, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/\s+/g, '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');

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