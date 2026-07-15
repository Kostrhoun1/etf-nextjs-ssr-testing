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


def series_dates(code):
    out, off = [], 0
    while True:
        r = (sb.table('index_historical_data').select('date')
             .eq('index_code', code).order('date').range(off, off + 999).execute())
        if not r.data:
            break
        out.extend(date.fromisoformat(x['date']) for x in r.data)
        off += 1000
    return out


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
        d = series_dates(code)
        if not d:
            problems.append(f"{code}: ZADNA DATA")
            continue
        counts[code] = len(d)
        last, stale = d[-1], (today - d[-1]).days
        flags = []
        if stale > MAX_STALE_DAYS:
            flags.append(f"OCAS {stale} dni stary")
        gap = max(((d[i] - d[i - 1]).days, d[i]) for i in range(1, len(d))) if len(d) > 1 else (0, None)
        if gap[0] > MAX_GAP_DAYS:
            flags.append(f"DIRA {gap[0]} dni pred {gap[1]}")
        was = prev.get(code)
        if was and len(d) < was:
            flags.append(f"UBYLO {was - len(d)} radku (bylo {was})")
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
    print(f"VSE OK – {len(counts)} indexu, zadna dira ani utnuty ocas.")


if __name__ == '__main__':
    main()
