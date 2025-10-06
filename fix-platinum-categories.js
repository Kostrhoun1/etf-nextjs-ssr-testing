import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function fixPlatinumCategories() {
  try {
    console.log('🔧 Opravuji kategorie platinových ETC...');
    
    // Najdi všechny platinové ETC s kategorií Dluhopisy
    const { data: wrongCategories, error: findError } = await supabase
      .from('etf_funds')
      .select('isin, name, category, investment_focus')
      .ilike('name', '%Platinum%')
      .eq('category', 'Dluhopisy');

    if (findError) {
      console.log('❌ Chyba při hledání:', findError.message);
      return;
    }

    if (!wrongCategories || wrongCategories.length === 0) {
      console.log('✅ Žádné platinové ETC s kategorií Dluhopisy nenalezeny');
      return;
    }

    console.log('📋 Nalezené nesprávně kategorizované platinové ETC:');
    wrongCategories.forEach(etf => {
      console.log(`   ${etf.isin} - ${etf.name}`);
      console.log(`   Investment focus: ${etf.investment_focus}`);
    });

    // Oprav kategorie
    const { data: updated, error: updateError } = await supabase
      .from('etf_funds')
      .update({ category: 'Komodity' })
      .ilike('name', '%Platinum%')
      .eq('category', 'Dluhopisy')
      .select('isin, name');

    if (updateError) {
      console.log('❌ Chyba při aktualizaci:', updateError.message);
      return;
    }

    console.log(`✅ Úspěšně opraveno ${updated?.length || 0} platinových ETC na kategorii 'Komodity'`);
    updated?.forEach(etf => {
      console.log(`   ✓ ${etf.isin} - ${etf.name}`);
    });
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

fixPlatinumCategories();