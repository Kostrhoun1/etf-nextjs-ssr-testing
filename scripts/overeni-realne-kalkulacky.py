#!/usr/bin/env python3
"""
NEZÁVISLÉ OVĚŘENÍ nových čísel z 11. 11. 2026 (PLAN-LISTOPAD-2026.md, body 3.2 a 3.7) – pravidlo č. 1, bod 3.

Počítá z HOLÝCH dat, bez jediného řádku kódu webu:
  - ceny:    Yahoo Finance v8 chart, adj. close (dividendy reinvestované, po poplatku fondu), datum podle gmtoffset burzy,
  - kurz:    ČNB denní kurz USD/CZK (rok.txt), den bez kurzu = poslední předchozí kurz,
  - inflace: ČSÚ open data CEN0101B (1/1996–12/2014) a CEN0101E (od 1/2015), bazický index 2015 = 100, Česko, úhrn,
             domácnosti celkem (web používá stejné oficiální hodnoty; kontrolně i báze 2005/2025 zřetězené přes
             meziměsíční index ledna 2015 – jiné zaokrouhlení, rozdíl < 0,1 %).
Kotvy: roční průměry z měsíčního indexu vs. publikovaná průměrná míra inflace ČSÚ 2010–2025 (max. odchylka 0,06 p. b.);
ceny Yahoo × ČNB jsou jiný zdroj než data webu (vlastní DB, kurzy ECB).

1) Stroj času „V dnešních korunách“ (/stroj-casu?…&ceny=dnesni): 5 000 Kč na začátku každého měsíce od 1/2010,
   nákup za cenu konce předchozího měsíce, konec = poslední měsíc indexu ČSÚ, vše v jeho cenách:
     hodnota = podíly × cena[konec],  vklady v dnešních cenách = Σ 5 000 × CPI[konec] / CPI[měsíc vkladu].
   11. 11. 2026 (konec 9/2026): S&P 500 4 068 570 Kč (web 4 068 373), celý svět (VT) 2 933 239 Kč (web 2 933 088),
   vklady 1 428 958 Kč (web 1 428 958); 100 000 Kč naráz do S&P 500 od 1/2000: 496 911 Kč (web 497 519).
   → zlaté případy investicni-43/44 (scripts/data/zlate-pripady.json).
2) Úvod /investicni-kalkulacka: 100 000 Kč první obchodní den 11/2006 + 5 000 Kč první obchodní den každého dalšího
   měsíce do S&P 500 (SPY), hodnota k poslednímu dni dat. 11. 11. 2026 (data k 10. 11.): 6 717 347 Kč (web 6 717 215),
   vloženo 1 300 000 Kč, max. propad −52,8 % (6/2007 → 3/2009).

SPUŠTĚNÍ: python3 -I scripts/overeni-realne-kalkulacky.py [konec-dat YYYY-MM-DD] [poslední měsíc CPI YYYY-MM]
          (stahuje ~170 MB CSV ČSÚ do dočasné složky, jednou; adresář lze určit proměnnou OVERENI_CACHE)
"""
import csv, json, os, sys, tempfile, urllib.request, datetime as dt

CACHE = os.environ.get('OVERENI_CACHE') or os.path.join(tempfile.gettempdir(), 'etf-overeni-cache')
os.makedirs(CACHE, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0'}
KONEC_DAT = sys.argv[1] if len(sys.argv) > 1 else dt.date.today().isoformat()


def stahni(url, soubor):
    cesta = os.path.join(CACHE, soubor)
    if not os.path.exists(cesta):
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r, open(cesta, 'wb') as f:
            f.write(r.read())
    return cesta


def cpi(sada, filtr):
    out = {}
    with open(stahni(f'https://data.csu.gov.cz/opendata/sady/{sada}/distribuce/csv', f'{sada}.csv'), encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if filtr(row) and len(row['CASMKMQRM12']) == 7 and row['CASMKMQRM12'][5:].isdigit():
                out.setdefault(row['Typ indexu'], {})[row['CASMKMQRM12']] = float(row['Hodnota'])
    return out


def yahoo(sym):
    p1 = int(dt.datetime(1999, 11, 1).timestamp()); p2 = int(dt.datetime.now().timestamp())
    j = json.load(open(stahni(f'https://query1.finance.yahoo.com/v8/finance/chart/{sym}?period1={p1}&period2={p2}&interval=1d&events=div%7Csplit', f'y_{sym}_{KONEC_DAT}.json')))
    r = j['chart']['result'][0]; off = r['meta']['gmtoffset']
    return {dt.datetime.fromtimestamp(t + off, dt.timezone.utc).date().isoformat(): a
            for t, a in zip(r['timestamp'], r['indicators']['adjclose'][0]['adjclose']) if a is not None}


def cnb_usd():
    out = {}
    for rok in range(1999, dt.date.today().year + 1):
        txt = open(stahni(f'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/rok.txt?rok={rok}', f'cnb_{rok}_{KONEC_DAT}.txt'), encoding='utf-8').read()
        hlava = None
        for radek in txt.splitlines():
            if radek.startswith('Datum'):
                hlava = radek.split('|'); continue
            if hlava and radek.strip():
                c = radek.split('|'); d, m, y = c[0].split('.')
                out[f'{y}-{m}-{d}'] = float(c[hlava.index('1 USD')].replace(',', '.'))
    return out


def czk(ceny, kurzy):
    kd = sorted(kurzy); out = {}; j = 0
    for d in sorted(ceny):
        while j + 1 < len(kd) and kd[j + 1] <= d:
            j += 1
        if kd[j] <= d:
            out[d] = ceny[d] * kurzy[kd[j]]
    return out


def pridej(ym, n):
    y, m = map(int, ym.split('-')); k = y * 12 + (m - 1) + n
    return f'{k // 12}-{k % 12 + 1:02d}'


def main():
    b = cpi('CEN0101B', lambda r: r['Území'] == 'Česko' and r['CZ-COICOP-Oddíl'] == 'Celkem' and r['Skupiny domácností'] == 'Domácnosti celkem' and r['CZ-COICOP-Skupina a třída'] == '')
    e = cpi('CEN0101E', lambda r: r['Území'] == 'Česko' and r['Klasifikace COICOP 2018-Oddíl'] == 'Úhrn' and r['Skupiny domácností'] == 'Domácnosti celkem' and r['Klasifikace COICOP 2018-Skupina a třída'] == '')
    c15 = {k: v for k, v in b['Bazický index (2015 = 100)'].items() if k < '2015-01'}
    c15.update(e['Bazický index (2015 = 100)'])
    konec_cpi = sys.argv[2] if len(sys.argv) > 2 else max(c15)
    prum = lambda y: sum(c15[f'{y}-{m:02d}'] for m in range(1, 13)) / 12
    MIRA = {2010: 1.5, 2011: 1.9, 2012: 3.3, 2013: 1.4, 2014: 0.4, 2015: 0.3, 2016: 0.7, 2017: 2.5, 2018: 2.1, 2019: 2.8,
            2020: 3.2, 2021: 3.8, 2022: 15.1, 2023: 10.7, 2024: 2.4, 2025: 2.5}
    print(f'CPI: poslední měsíc ČSÚ {max(c15)}, počítám do {konec_cpi}; max. odchylka ročních průměrů od míry inflace ČSÚ 2010–2025: '
          f'{max(abs((prum(y) / prum(y - 1) - 1) * 100 - v) for y, v in MIRA.items()):.2f} p. b.')
    kurzy = cnb_usd()
    rady = {s: czk({d: v for d, v in yahoo(s).items() if d <= KONEC_DAT}, kurzy) for s in ('SPY', 'VT')}
    mes = {s: {} for s in rady}
    for s, r in rady.items():
        for d in sorted(r):
            mes[s][d[:7]] = r[d]
    # 1) stroj času v dnešních korunách
    for nazev, s, od, mesicne, naraz in [('S&P 500 5 000 Kč/měs od 2010', 'SPY', '2010-01', 5000, 0), ('Celý svět (VT) 5 000 Kč/měs od 2010', 'VT', '2010-01', 5000, 0),
                                         ('S&P 500 100 000 Kč naráz od 2000', 'SPY', '2000-01', 0, 100000)]:
        podily = vr = 0.0; m = od
        while m <= konec_cpi:
            vklad = mesicne + (naraz if m == od else 0)
            podily += vklad / mes[s][pridej(m, -1)]; vr += vklad * c15[konec_cpi] / c15[m]; m = pridej(m, 1)
        print(f'stroj času v cenách {konec_cpi}: {nazev}: hodnota {podily * mes[s][konec_cpi]:,.0f} Kč, vklady v dnešních cenách {vr:,.0f} Kč'.replace(',', ' '))
    # 2) úvod investiční kalkulačky (20 let zpět od měsíce konce dat)
    y, m = map(int, KONEC_DAT[:7].split('-')); start = f'{y - 20}-{m:02d}-01'
    spy = rady['SPY']; dny = [d for d in sorted(spy) if start <= d <= KONEC_DAT]
    podily = vl = 0.0; posl = None
    for d in dny:
        if d[:7] != posl:
            v = 100000 if posl is None else 5000; podily += v / spy[d]; vl += v; posl = d[:7]
    vrchol = spy[dny[0]]; vd = dny[0]; nej = (0, None, None)
    for d in dny:
        if spy[d] > vrchol: vrchol, vd = spy[d], d
        if spy[d] / vrchol - 1 < nej[0]: nej = (spy[d] / vrchol - 1, vd, d)
    print(f'úvod investiční kalkulačky (od {start[:7]}, data k {dny[-1]}): hodnota {podily * spy[dny[-1]]:,.0f} Kč, vloženo {vl:,.0f} Kč, '
          f'max. propad {nej[0] * 100:.1f} % ({nej[1]} → {nej[2]})'.replace(',', ' '))


if __name__ == '__main__':
    main()
