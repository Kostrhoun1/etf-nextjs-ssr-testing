#!/usr/bin/env python3
"""
Generátor dat pro backtest: měsíční CPI (ČSÚ) a měsíční bezriziková sazba (CZK / EUR / USD).

PROČ (audit nástrojů 22. 10. 2026, S18 + S10):
  - CPI před 2015 se dřív interpolovalo z ROČNÍCH průměrů, a ty byly navíc v letech 2000–2002 posunuté
    (2000: 2,4 % místo 3,9 %, 2002: 3,9 % místo 1,8 %). ČSÚ má přitom měsíční index od 1/1996 (CEN0101B).
  - Sharpe/Sortino počítaly s pevnou sazbou 2 % i pro USD a EUR a pro období, kdy byly sazby nulové.

ZDROJE (veřejná data, bez klíče):
  CPI  ČSÚ CEN0101B (1/1996–12/2017, COICOP 1999) a CEN0101E (od 1/2015, COICOP 2018), řádky
       „Bazický index (2015 = 100)“, Česko, Úhrn/Celkem, Domácnosti celkem. Před 2015 se bere B, od 2015 E.
       Kontrola: v překryvu 2015–2017 musí být B = E PŘESNĚ a roční průměry musí sedět na publikovanou
       míru inflace ČSÚ (tabulka MIRA_INFLACE níže, ±0,15 p. b.). Jinak skript skončí chybou a nic nezapíše.
  CZK  ČNB 2T repo sazba (historie změn) – průměr přes kalendářní dny měsíce.
  EUR  ECB EONIA měsíční průměr (do 9/2019), od 10/2019 €STR (denní, průměr pracovních dní měsíce).
  USD  Fed – efektivní sazba fed funds, měsíční průměr (FRED FEDFUNDS).

SPUŠTĚNÍ (z kořene repa):
  python3 scripts/backtest/generuj-cpi-a-sazby.py [--cache ADRESAR]
  Přepíše blok mezi značkami v src/lib/backtest/inflation.ts a celý soubor src/lib/backtest/bezrizikovaSazba.ts.
  CEN0101B má ~100 MB, CEN0101E ~67 MB – s --cache se stáhnou jen jednou.
"""
import csv, datetime as dt, io, json, os, re, sys, urllib.request

KOREN = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
INFLACE_TS = os.path.join(KOREN, 'src', 'lib', 'backtest', 'inflation.ts')
SAZBA_TS = os.path.join(KOREN, 'src', 'lib', 'backtest', 'bezrizikovaSazba.ts')

URL = {
    'CEN0101B': 'https://data.csu.gov.cz/opendata/sady/CEN0101B/distribuce/csv',
    'CEN0101E': 'https://data.csu.gov.cz/opendata/sady/CEN0101E/distribuce/csv',
    'repo': 'https://www.cnb.cz/cs/casto-kladene-dotazy/.galleries/vyvoj_repo_historie.txt',
    'eonia': 'https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.4F.MM.EONIA.HSTA?format=csvdata',
    'estr': 'https://data-api.ecb.europa.eu/service/data/EST/B.EU000A2X2A25.WT?format=csvdata',
    'fedfunds': 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=FEDFUNDS',
}
SOUBOR = {'CEN0101B': 'CEN0101B.csv', 'CEN0101E': 'CEN0101E.csv', 'repo': 'cnb_repo.txt', 'eonia': 'eonia_m.csv',
          'estr': 'estr_d.csv', 'fedfunds': 'fedfunds.csv'}

# Publikovaná průměrná roční míra inflace ČSÚ (https://csu.gov.cz/csu/czso/mira_inflace) – nezávislá kotva.
MIRA_INFLACE = {1997: 8.5, 1998: 10.7, 1999: 2.1, 2000: 3.9, 2001: 4.7, 2002: 1.8, 2003: 0.1, 2004: 2.8, 2005: 1.9,
                2006: 2.5, 2007: 2.8, 2008: 6.3, 2009: 1.0, 2010: 1.5, 2011: 1.9, 2012: 3.3, 2013: 1.4, 2014: 0.4,
                2015: 0.3, 2016: 0.7, 2017: 2.5, 2018: 2.1, 2019: 2.8, 2020: 3.2, 2021: 3.8, 2022: 15.1, 2023: 10.7,
                2024: 2.4, 2025: 2.5}


def nacti(klic, cache):
    if cache:
        p = os.path.join(cache, SOUBOR[klic])
        if os.path.exists(p):
            return open(p, encoding='utf-8-sig').read()
    req = urllib.request.Request(URL[klic], headers={'User-Agent': 'etfpruvodce.cz generator'})
    data = urllib.request.urlopen(req, timeout=300).read().decode('utf-8-sig')
    if cache:
        os.makedirs(cache, exist_ok=True)
        open(os.path.join(cache, SOUBOR[klic]), 'w', encoding='utf-8').write(data)
    return data


def cpi_z_csv(text, sloupec_oddil, uhrn):
    r = csv.reader(io.StringIO(text))
    h = next(r)
    out = {}
    for row in r:
        d = dict(zip(h, row))
        if (d.get('Typ indexu') == 'Bazický index (2015 = 100)' and d.get(sloupec_oddil) == uhrn
                and d.get('Skupiny domácností') == 'Domácnosti celkem' and d.get('Území') == 'Česko'
                and re.fullmatch(r'\d{4}-\d{2}', d.get('CASMKMQRM12', ''))):
            if any(v for k, v in d.items() if 'Skupina a třída' in k):
                continue
            out[d['CASMKMQRM12']] = float(d['Hodnota'])
    return out


def mesice(od, do):
    y, m = od
    while (y, m) <= do:
        yield f'{y}-{m:02d}'
        m += 1
        if m == 13:
            y, m = y + 1, 1


def prumer_kalendarni(zmeny, mesic):
    """Průměr sazby přes kalendářní dny měsíce; zmeny = seřazený seznam (datum, sazba) platných OD data."""
    y, m = map(int, mesic.split('-'))
    den = dt.date(y, m, 1)
    konec = dt.date(y + (m == 12), m % 12 + 1, 1)
    suma = n = 0
    while den < konec:
        s = None
        for d, v in zmeny:
            if d <= den:
                s = v
            else:
                break
        if s is None:
            return None
        suma += s; n += 1
        den += dt.timedelta(days=1)
    return suma / n


def main():
    cache = sys.argv[sys.argv.index('--cache') + 1] if '--cache' in sys.argv else None

    # ── CPI ──
    b = cpi_z_csv(nacti('CEN0101B', cache), 'CZ-COICOP-Oddíl', 'Celkem')
    e = cpi_z_csv(nacti('CEN0101E', cache), 'Klasifikace COICOP 2018-Oddíl', 'Úhrn')
    prekryv = [k for k in b if k in e]
    if len(prekryv) < 24 or any(b[k] != e[k] for k in prekryv):
        sys.exit(f'CPI: CEN0101B a CEN0101E se v překryvu neshodují ({[(k, b[k], e[k]) for k in prekryv if b[k] != e[k]][:5]})')
    cpi = {k: v for k, v in b.items() if k < '2015-01'}
    cpi.update(e)
    klice = sorted(cpi)
    chybi = [k for k in mesice((1996, 1), tuple(map(int, klice[-1].split('-')))) if k not in cpi]
    if klice[0] != '1996-01' or chybi:
        sys.exit(f'CPI: řada není souvislá od 1996-01 (chybí {chybi[:5]})')
    for rok, mira in MIRA_INFLACE.items():
        if f'{rok}-12' not in cpi:
            continue
        a = sum(cpi[f'{rok}-{m:02d}'] for m in range(1, 13)) / 12
        p = sum(cpi[f'{rok - 1}-{m:02d}'] for m in range(1, 13)) / 12
        if abs((a / p - 1) * 100 - mira) > 0.15:
            sys.exit(f'CPI: roční míra {rok} z řady {(a / p - 1) * 100:.2f} % ≠ ČSÚ {mira} %')

    radky = []
    for rok in range(1996, int(klice[-1][:4]) + 1):
        hodnoty = [f"'{k}': {cpi[k]}," for k in klice if k.startswith(f'{rok}-')]
        radky.append('  ' + ' '.join(hodnoty))
    blok = '\n'.join(radky)
    src = open(INFLACE_TS, encoding='utf-8').read()
    zac, kon = '  // <generovano-cpi>', '  // </generovano-cpi>'
    if zac not in src or kon not in src:
        sys.exit('inflation.ts: chybí značky <generovano-cpi>')
    pred, zbytek = src.split(zac, 1)
    _, po = zbytek.split(kon, 1)
    dnes = dt.date.today().isoformat()
    src = f'{pred}{zac} (scripts/backtest/generuj-cpi-a-sazby.py, staženo {dnes}; {klice[0]} … {klice[-1]})\n{blok}\n{kon}{po}'
    open(INFLACE_TS, 'w', encoding='utf-8').write(src)
    print(f'CPI: {klice[0]} … {klice[-1]} ({len(klice)} měsíců) → {INFLACE_TS}')

    # ── bezriziková sazba ──
    repo = []
    for line in nacti('repo', cache).splitlines()[1:]:
        p = line.strip().split('|')
        if len(p) == 2 and p[0].isdigit():
            repo.append((dt.datetime.strptime(p[0], '%Y%m%d').date(), float(p[1].replace(',', '.'))))
    repo.sort()
    eonia = {}
    for row in csv.DictReader(io.StringIO(nacti('eonia', cache))):
        eonia[row['TIME_PERIOD']] = float(row['OBS_VALUE'])
    estr_d = {}
    for row in csv.DictReader(io.StringIO(nacti('estr', cache))):
        estr_d.setdefault(row['TIME_PERIOD'][:7], []).append(float(row['OBS_VALUE']))
    estr = {k: sum(v) / len(v) for k, v in estr_d.items()}
    fed = {}
    for row in csv.DictReader(io.StringIO(nacti('fedfunds', cache))):
        if row['FEDFUNDS'] not in ('', '.'):
            fed[row['observation_date'][:7]] = float(row['FEDFUNDS'])

    dnes_m = dt.date.today().strftime('%Y-%m')
    # Měsíc se zapisuje jen UPLYNULÝ (průměr celého měsíce); běžící měsíc ne.
    czk = {m: prumer_kalendarni(repo, m) for m in mesice((1996, 1), (int(dnes_m[:4]), int(dnes_m[5:]))) if m < dnes_m}
    eur = {m: (eonia[m] if m < '2019-10' else estr.get(m)) for m in mesice((1999, 1), (int(dnes_m[:4]), int(dnes_m[5:]))) if m < dnes_m}
    usd = {m: v for m, v in fed.items() if '1990-01' <= m < dnes_m}
    rady = {'CZK': czk, 'EUR': eur, 'USD': usd}
    for mena, r in rady.items():
        vynech = [m for m, v in r.items() if v is None]
        for m in vynech:
            del r[m]
        ks = sorted(r)
        diry = [m for m in mesice(tuple(map(int, ks[0].split('-'))), tuple(map(int, ks[-1].split('-')))) if m not in r]
        if diry:
            sys.exit(f'Sazba {mena}: díry v řadě {diry[:5]}')
        print(f'Sazba {mena}: {ks[0]} … {ks[-1]} ({len(ks)} měsíců)')

    def blok_sazby(r):
        ks = sorted(r)
        out = []
        for rok in range(int(ks[0][:4]), int(ks[-1][:4]) + 1):
            h = [f"'{k}': {round(r[k], 4)}," for k in ks if k.startswith(f'{rok}-')]
            out.append('    ' + ' '.join(h))
        return '\n'.join(out)

    ts = f'''/**
 * Bezriziková sazba pro Sharpe a Sortino – MĚSÍČNÍ PRŮMĚR v % ročně, podle měny backtestu.
 *
 * !! GENEROVANÝ SOUBOR – needitovat ručně. Generátor: scripts/backtest/generuj-cpi-a-sazby.py (staženo {dnes}).
 *
 * PROČ (audit nástrojů 22. 10. 2026, S10): dřív pevná 2 % pro všechny měny i období – v USD/EUR i v letech
 * nulových sazeb (2013–2021) to Sharpe zkreslovalo. Standardní Sharpe počítá s výnosem nad sazbou TÉHOŽ měsíce.
 *
 * ZDROJE (krátkodobá sazba peněžního trhu / centrální banky v měně výpočtu):
 *  CZK – ČNB, 2T repo sazba (historie změn), průměr přes kalendářní dny měsíce.
 *  EUR – ECB, EONIA měsíční průměr do 9/2019, od 10/2019 €STR (průměr pracovních dní měsíce).
 *  USD – Federal Reserve, efektivní sazba fed funds, měsíční průměr (FRED FEDFUNDS).
 * Za posledním měsícem řady se drží poslední známá hodnota (sazby se mění skokově a zřídka); kontrola stáří
 * je v scripts/check-fund-data.mjs (audit backtest).
 */
export type MenaSazby = 'CZK' | 'EUR' | 'USD'

export const SAZBA_PA: Record<MenaSazby, Record<string, number>> = {{
  CZK: {{
{blok_sazby(czk)}
  }},
  EUR: {{
{blok_sazby(eur)}
  }},
  USD: {{
{blok_sazby(usd)}
  }},
}}

const KLICE: Record<MenaSazby, string[]> = {{
  CZK: Object.keys(SAZBA_PA.CZK).sort(),
  EUR: Object.keys(SAZBA_PA.EUR).sort(),
  USD: Object.keys(SAZBA_PA.USD).sort(),
}}

/** Poslední měsíc řady pro každou měnu (YYYY-MM). */
export const SAZBA_POSLEDNI_MESIC: Record<MenaSazby, string> = {{
  CZK: KLICE.CZK[KLICE.CZK.length - 1],
  EUR: KLICE.EUR[KLICE.EUR.length - 1],
  USD: KLICE.USD[KLICE.USD.length - 1],
}}

/**
 * Bezriziková sazba za MĚSÍC (desetinně, např. 0,0029 = 0,29 % za měsíc) k datu, pro danou měnu.
 * null = datum před začátkem řady (pak Sharpe/Sortino nepočítáme – radši „—“ než odhad).
 */
export function mesicniSazba(mena: MenaSazby, datum: Date): number | null {{
  const k = `${{datum.getUTCFullYear()}}-${{String(datum.getUTCMonth() + 1).padStart(2, '0')}}`
  const klice = KLICE[mena]
  if (k < klice[0]) return null
  const pa = SAZBA_PA[mena][k] ?? SAZBA_PA[mena][klice[klice.length - 1]]
  return Math.pow(1 + pa / 100, 1 / 12) - 1
}}
'''
    open(SAZBA_TS, 'w', encoding='utf-8').write(ts)
    print(f'Sazby → {SAZBA_TS}')


if __name__ == '__main__':
    main()
