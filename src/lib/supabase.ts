import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';

// Jen veřejný klíč – proč, viz src/lib/supabase-config.ts.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Název „Admin“ je historický (dřív service role). Je to tentýž klient s veřejným klíčem;
// ponechán, ať se nemusí přepisovat desítky importů.
export const supabaseAdmin = supabase;

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