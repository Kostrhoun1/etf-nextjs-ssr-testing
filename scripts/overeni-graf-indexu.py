#!/usr/bin/env python3
"""
NEZÁVISLÉ OVĚŘENÍ grafu „Vývoj indexu … v Kč“ na detailu fondu (PLAN-LISTOPAD-2026.md, bod 3.3; pravidlo č. 1, bod 3).

Graf (src/app/etf/[isin]/GrafIndexuKc.tsx) nese v atributu data-kontrola tři své body (začátek, střed, konec) jako
„YYYY-MM-DD:hodnota v Kč“. Tenhle skript je spočítá z HOLÝCH dat, bez jediného řádku kódu webu a bez naší databáze:
  - cena:  Yahoo Finance v8 chart, adj. close zdrojového fondu (dividendy reinvestované, po poplatku fondu), den podle
           gmtoffset burzy,
  - kurz:  ČNB denní kurz (rok.txt) USD/CZK nebo EUR/CZK, den bez kurzu = poslední předchozí kurz
           (web převádí kurzem ECB – jiný zdroj, rozdíl řádově 0,1 %).
Zdrojový fond indexu je tu zapsaný ZVLÁŠŤ (ne načtený z manifestu webu): podle tickerů v manifestu, ověřených 15. 7. 2026.
Tolerance 0,5 %. Yahoo adj. close se po každé nové výplatě zpětně přepočítává (starší body klesnou o výnos výplaty) –
proto se porovnává i POMĚR konec/začátek, který na zpětném přepočtu nezávisí.

SPUŠTĚNÍ: python3 -I scripts/overeni-graf-indexu.py [base-url] [ISIN …]
          (výchozí http://localhost:3009, fondy SXR8, iShares USD Treasury 7-10yr, iShares € Govt Bond 1-3yr, SGLN)
"""
import json, os, re, sys, tempfile, urllib.request, datetime as dt

CACHE = os.environ.get('OVERENI_CACHE') or os.path.join(tempfile.gettempdir(), 'etf-overeni-cache')
os.makedirs(CACHE, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0'}
DNES = dt.date.today().isoformat()
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3009'
ISINY = sys.argv[2:] or ['IE00B5BMR087', 'IE00B3VWN518', 'IE00B14X4Q57', 'IE00B4ND3602']
# index_code → (Yahoo ticker zdrojového fondu, měna). Nezávisle na src/lib/backtest/indexes.ts.
ZDROJ = {
    'sp500': ('SPY', 'USD'), 'us_small_cap': ('IWM', 'USD'), 'us_value': ('IWD', 'USD'), 'us_growth': ('IWF', 'USD'),
    'msci_em': ('EEM', 'USD'), 'gold': ('GLD', 'USD'), 'us_treasury_1_3y': ('SHY', 'USD'), 'us_treasury_7_10y': ('IEF', 'USD'),
    'us_treasury_20y': ('TLT', 'USD'), 'us_corp_bond_ig': ('LQD', 'USD'), 'ftse_all_world': ('VT', 'USD'),
    'eur_govt_bond_1_3y': ('IBGS.AS', 'EUR'), 'eur_govt_bond_3_7y': ('IBGX.AS', 'EUR'), 'eur_govt_bond_15_30y': ('IBGL.AS', 'EUR'),
    'eur_corp_bond': ('IEAC.L', 'EUR'),
}
TOLERANCE = 0.005


def stahni(url, soubor, cache=True):
    cesta = os.path.join(CACHE, soubor)
    if not cache or not os.path.exists(cesta):
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r, open(cesta, 'wb') as f:
            f.write(r.read())
    return cesta


def yahoo(sym):
    p1 = int(dt.datetime(1999, 11, 1).timestamp()); p2 = int(dt.datetime.now().timestamp())
    j = json.load(open(stahni(f'https://query1.finance.yahoo.com/v8/finance/chart/{sym}?period1={p1}&period2={p2}&interval=1d&events=div%7Csplit', f'y_{sym}_{DNES}.json')))
    r = j['chart']['result'][0]; off = r['meta']['gmtoffset']
    return {dt.datetime.fromtimestamp(t + off, dt.timezone.utc).date().isoformat(): a
            for t, a in zip(r['timestamp'], r['indicators']['adjclose'][0]['adjclose']) if a is not None}


def cnb():
    out = {'USD': {}, 'EUR': {}}
    for rok in range(1999, dt.date.today().year + 1):
        txt = open(stahni(f'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/rok.txt?rok={rok}', f'cnb_{rok}_{DNES}.txt'), encoding='utf-8').read()
        hlava = None
        for radek in txt.splitlines():
            if radek.startswith('Datum'):
                hlava = radek.split('|'); continue
            if hlava and radek.strip():
                c = radek.split('|'); d, m, y = c[0].split('.')
                for mena in out:
                    if f'1 {mena}' in hlava:
                        out[mena][f'{y}-{m}-{d}'] = float(c[hlava.index(f'1 {mena}')].replace(',', '.'))
    return out


def kurz(kurzy, den):
    kandidati = [d for d in kurzy if d <= den]
    return kurzy[max(kandidati)] if kandidati else None


def main():
    kurzy = cnb()
    chyb = 0
    print(f'{"fond":<14} {"index":<20} {"den":<11} {"web Kč":>11} {"Yahoo×ČNB":>11} {"rozdíl":>8}')
    for isin in ISINY:
        html = urllib.request.urlopen(urllib.request.Request(f'{BASE}/etf/{isin}', headers=UA), timeout=120).read().decode('utf-8')
        m = re.search(r'data-graf-indexu="([^"]+)"[^>]*data-kontrola="([^"]+)"', html)
        if not m:
            print(f'{isin:<14} BEZ GRAFU'); chyb += 1; continue
        kod, kontrola = m.group(1), m.group(2)
        sym, mena = ZDROJ[kod]
        ceny = yahoo(sym)
        body = [(d, float(v)) for d, v in (x.split(':') for x in kontrola.split('|'))]
        nez = []
        for d, web in body:
            if d not in ceny:
                print(f'{isin:<14} {kod:<20} {d:<11} {web:>11.2f} {"—":>11}  Yahoo bod chybí'); chyb += 1; nez.append(None); continue
            k = kurz(kurzy[mena], d)
            n = ceny[d] * k
            nez.append(n)
            r = web / n - 1
            ok = abs(r) <= TOLERANCE
            chyb += 0 if ok else 1
            print(f'{isin:<14} {kod:<20} {d:<11} {web:>11.2f} {n:>11.2f} {r * 100:>+7.2f} %{"" if ok else "  ← MIMO TOLERANCI"}')
        if nez[0] and nez[-1]:
            rw, rn = body[-1][1] / body[0][1], nez[-1] / nez[0]
            ok = abs(rw / rn - 1) <= TOLERANCE
            chyb += 0 if ok else 1
            print(f'{"":<14} {"poměr konec/začátek":<20} {"":<11} {rw:>11.4f} {rn:>11.4f} {(rw / rn - 1) * 100:>+7.2f} %{"" if ok else "  ← MIMO TOLERANCI"}')
    print('\nVÝSLEDEK:', 'OK – vše do 0,5 %' if chyb == 0 else f'{chyb} nesedí')
    sys.exit(1 if chyb else 0)


if __name__ == '__main__':
    main()
