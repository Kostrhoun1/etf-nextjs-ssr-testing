/**
 * Supabase – JEDINÉ místo s adresou a klíčem (dřív natvrdo v 6 souborech, 17. 10. 2026).
 *
 * Web používá VÝHRADNĚ veřejný (publishable) klíč. Čte jen veřejná data (etf_funds, index_*,
 * exchange_rates_historical) a jediný zápis (tabulka client_errors) povoluje RLS politika
 * „anon smí jen INSERT“. Tajný klíč web nepotřebuje – a kdyby ho měl, každá budoucí chyba
 * nebo injection by obešla RLS (technický audit 17. 10. 2026). Proměnné prostředí se záměrně
 * NEčtou: produkční SUPABASE_SERVICE_ROLE_KEY je starý legacy JWT (zakázán 26. 4. 2026)
 * a NEXT_PUBLIC_SUPABASE_ANON_KEY rovněž – kvůli tomu nefungovalo /etf/ticker/<TICKER>.
 *
 * Publishable klíč není tajemství (je určený do prohlížeče); oprávnění hlídá RLS v databázi.
 */
export const SUPABASE_URL = 'https://nbhwnatadyubiuadfakx.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_IrdFtruv53Z2RbXNRRWCcw_K0TD4_ml';
