import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from('etf_funds')
      .select('isin, name, primary_ticker')
      .limit(5);

    if (testError) {
      return NextResponse.json({
        success: false,
        error: testError.message,
        env_check: {
          supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
          has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      });
    }

    // Check specific ISINs
    const targetISINs = ['IE00BK5BQT80', 'IE00B5BMR087', 'IE00B4L5Y983'];
    const checks = [];
    
    for (const isin of targetISINs) {
      const { data, error } = await supabaseAdmin
        .from('etf_funds')
        .select('isin, name, primary_ticker')
        .eq('isin', isin)
        .single();
        
      checks.push({
        isin,
        exists: !!data,
        error: error?.message || null,
        data: data || null
      });
    }

    return NextResponse.json({
      success: true,
      sample_data: testData,
      total_sample_count: testData?.length || 0,
      target_etf_checks: checks,
      env_info: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        node_env: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      env_info: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        node_env: process.env.NODE_ENV
      }
    });
  }
}