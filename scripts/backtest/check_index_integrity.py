#!/usr/bin/env python3
"""
KONTROLA INTEGRITY indexových dat (`index_historical_data`).

Vznikla po incidentu 14.7.2026, kdy z `sp500` zmizelo 419 řádků (celý ocas od
2024-11-06) a produkční backtest kvůli tomu ukazoval 611 812 Kč místo 738 487 Kč.
Nikdo si toho nevšiml – odhalilo se to náhodou při dotazu čtenáře z Facebooku.

CO KONTROLUJE:
  1. OCAS  – každý index musí mít data max. N dní stará (default 5; víkendy/svátky).
  2. DÍRY  – žádná podezřele velká mezera mezi obchodními dny uvnitř řady.
  3. POČTY – nečekaný propad počtu řádků oproti minulému běhu (uloženo do historie).
  4. SKOK  – denní pohyb > 25 % kdekoli v řadě (11. 11. 2026). Skutečný největší denní pohyb v datech
     je ~−17 % (XLF 1. 12. 2008); nad 25 % byly jen umělé zlomy škály – split MTUM/QUAL 4:1 přepsal
     ETF část, akademická zůstala → −75 % (us_momentum 2013-04-18, us_quality 2013-07-18).
  5. SPLICE – výnos v kotevní den prodloužené řady (data/splice-kotvy.json) se musí rovnat výnosu
     akademické řady (kotevní cena / poslední akademická cena v CSV). Chytí i malý zlom po dividendě.

Návratový kód 1 = něco je špatně (vhodné pro cron / CI, ať to křičí).

SPUŠTĚNÍ:
    set -a && . ./.secrets/supabase.env && set +a
    python3 scripts/backtest/check_index_integrity.py
"""

import json
import os
import sys
from datetime import date, datetime, timedelta

from supabase import create_client

URL = os.environ.get('SUPABASE_URL', 'https://nbhwnatadyubiuadfakx.supabase.co')
KEY = os.environ.get('SUPABASE_KEY')
if not KEY:
    raise SystemExit('Nastav SUPABASE_KEY (viz .secrets/supabase.env).')

HIST = '.secrets/index-integrity-history.json'
MAX_STALE_DAYS = 5      # ocas starší než tohle = poplach
MAX_GAP_DAYS = 10       # díra uvnitř řady delší než tohle = poplach
MAX_SKOK = 0.25         # |denní pohyb| větší než tohle = poplach (zlom škály, ne trh)
MAX_SPLICE_ODCHYLKA = 0.002  # výnos v kotevní den vs. akademický výnos (absolutně)

_DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
KOTVY = {k: v for k, v in json.load(open(os.path.join(_DATA, 'splice-kotvy.json'))).items() if not k.startswith('_')}
POSLEDNI_AKADEMICKY = {}  # code -> (date, price) posledního řádku akademické části v CSV
for _r in open(os.path.join(_DATA, 'factor_extensions.csv')).read().strip().split('\n')[1:]:
    _c, _d, _p = _r.split(',')
    POSLEDNI_AKADEMICKY[_c] = (date.fromisoformat(_d), float(_p))

# Měsíční indexy (v manifestu `monthly: true`) mají data jen v měsíční frekvenci — Yahoo pro ně nemá
# čistou denní historii. Rozestupy ~30 dní a ocas až měsíc starý jsou u nich NORMÁLNÍ, takže denní
# prahy (5/10 dní) by je vždy shodily. Dostávají volnější limity — ne úplnou výjimku: když se zdroj
# zastaví na víc než ~měsíc, i tak to poznáme. Kontrola ÚBYTEK řádků platí pro všechny stejně přísně.
# 17. 10. 2026: EUR dluhopisy jsou DENNÍ (měsíční byly jen kvůli range=max, viz sync-indexes.mjs zásada 8).
MONTHLY_INDEXES = set()
MONTHLY_STALE_DAYS = 40   # měsíční ocas bývá až ~měsíc starý + rezerva
MONTHLY_GAP_DAYS = 40     # ~30denní rozestupy jsou u měsíčních dat v pořádku

sb = create_client(URL, KEY)


def all_codes():
    codes, off = set(), 0
    while True:
        r = sb.table('index_historical_data').select('index_code').range(off, off + 999).execute()
        if not r.data:
            break
        codes.update(x['index_code'] for x in r.data)
        off += 1000
        if off > 400000:
            break
    return sorted(codes)


def series_rows(code):
    """[(date, close_price)] seřazené podle data."""
    out, off = [], 0
    while True:
        r = (sb.table('index_historical_data').select('date,close_price')
             .eq('index_code', code).order('date').range(off, off + 999).execute())
        if not r.data:
            break
        out.extend((date.fromisoformat(x['date']), float(x['close_price'])) for x in r.data)
        off += 1000
    return out


def kontrola_splice(code, rows):
    """Zásada 10 loaderu: výnos v kotevní den = akademický výnos. Vrací text problému nebo None."""
    k = KOTVY.get(code)
    if not k:
        return None
    pd, pp = POSLEDNI_AKADEMICKY[code]
    ceny = dict(rows)
    kd = date.fromisoformat(k['den'])
    if pd not in ceny or kd not in ceny:
        return f"SPLICE chybi {pd} nebo {kd}"
    ocekavano = k['cena'] / pp - 1
    skutecne = ceny[kd] / ceny[pd] - 1
    if abs(skutecne - ocekavano) > MAX_SPLICE_ODCHYLKA:
        return f"SPLICE {kd}: vynos {skutecne:+.2%}, akademicky {ocekavano:+.2%} (zlom skaly – sync-indexes zasada 10)"
    return None


def main():
    today = date.today()
    prev = {}
    if os.path.exists(HIST):
        prev = json.load(open(HIST)).get('counts', {})

    problems, counts = [], {}
    print(f"KONTROLA INTEGRITY – {today}\n" + "=" * 72)
    print(f"{'index_code':32} {'radku':>7} {'posledni':>12}  stav")
    print("-" * 72)

    for code in all_codes():
        rows = series_rows(code)
        d = [r[0] for r in rows]
        if not d:
            problems.append(f"{code}: ZADNA DATA")
            continue
        counts[code] = len(d)
        last, stale = d[-1], (today - d[-1]).days
        is_monthly = code in MONTHLY_INDEXES
        stale_limit = MONTHLY_STALE_DAYS if is_monthly else MAX_STALE_DAYS
        gap_limit = MONTHLY_GAP_DAYS if is_monthly else MAX_GAP_DAYS
        flags = []
        if stale > stale_limit:
            flags.append(f"OCAS {stale} dni stary")
        gap = max(((d[i] - d[i - 1]).days, d[i]) for i in range(1, len(d))) if len(d) > 1 else (0, None)
        if gap[0] > gap_limit:
            flags.append(f"DIRA {gap[0]} dni pred {gap[1]}")
        was = prev.get(code)
        # Úklid vmíchaných měsíčních bodů (sync --uklid) úbytek řádků ZÁMĚRNĚ způsobí → jen pro ten běh.
        if was and len(d) < was and os.environ.get('POVOLIT_UBYTEK') != '1':
            flags.append(f"UBYLO {was - len(d)} radku (bylo {was})")
        skoky = [(rows[i][0], rows[i][1] / rows[i - 1][1] - 1) for i in range(1, len(rows))
                 if rows[i - 1][1] and abs(rows[i][1] / rows[i - 1][1] - 1) > MAX_SKOK]
        if skoky:
            flags.append("SKOK " + ", ".join(f"{s[0]} {s[1]:+.0%}" for s in skoky[:5]))
        sp = kontrola_splice(code, rows)
        if sp:
            flags.append(sp)
        if flags:
            problems.append(f"{code}: " + "; ".join(flags))
        print(f"{code:32} {len(d):7} {last!s:>12}  {'!! ' + '; '.join(flags) if flags else 'OK'}")

    os.makedirs(os.path.dirname(HIST), exist_ok=True)
    json.dump({'checked_at': datetime.now().isoformat(), 'counts': counts}, open(HIST, 'w'), indent=1)

    print("=" * 72)
    if problems:
        print(f"!! NALEZENO {len(problems)} PROBLEMU:")
        for p in problems:
            print("   -", p)
        sys.exit(1)
    print(f"VSE OK – {len(counts)} indexu, zadna dira, utnuty ocas, skok ani zlom splice.")


if __name__ == '__main__':
    main()
