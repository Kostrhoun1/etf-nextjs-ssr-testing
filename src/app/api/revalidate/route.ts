import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ověř secret key pro zabezpečení
    const secret = body.secret;
    const expectedSecret = process.env.REVALIDATE_SECRET || 'etf_refresh_2025';
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' }, 
        { status: 401 }
      );
    }

    console.log('🔄 Revalidating homepage after scraper update...');
    
    // Přegeneruj homepage s novými daty
    revalidatePath('/');
    
    // Přegeneruj i další kritické stránky
    revalidatePath('/srovnani-etf');
    revalidatePath('/nejlepsi-etf');
    
    console.log('✅ Homepage successfully revalidated');
    
    return NextResponse.json({
      success: true,
      message: 'Homepage revalidated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}