#!/usr/bin/env python3
"""Prodlouzeni faktorovych rad us_momentum a us_quality k roku 2000.

Zdroj: Kenneth R. French Data Library (denni value-weighted portfolia).
Metodika a validace: viz scripts/backtest/data/README.md. Vystupem je
scripts/backtest/data/factor_extensions.csv (index_code,date,close_price),
ktery se nacita do index_historical_data jednorazovym SQL pres http extension.

Kotevni ceny (prvni den ETF v DB) se predavaji jako konstanty nize - pri
regeneraci je overit dotazem:
  SELECT index_code, MIN(date), (SELECT close_price ... ORDER BY date LIMIT 1)
  FROM index_historical_data WHERE index_code IN ('us_momentum','us_quality') ...
"""
import urllib.request, zipfile, io, json, datetime

UA = {"User-Agent": "Mozilla/5.0"}
BASE = "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/"
START = "19991231"  # FX kurzy v DB zacinaji 1999-12-30 -> drive nema v Kc smysl

ANCHORS = {
    # index_code: (french_zip, sloupec, kotevni datum = prvni den ETF v DB, kotevni cena, kalibracni ticker|None)
    "us_momentum": ("6_Portfolios_ME_Prior_12_2_Daily_CSV.zip", "BIG HiPRIOR", "2013-04-18", 43.593906, None),
    "us_quality": ("Portfolios_Formed_on_OP_Daily_CSV.zip", "Hi 30", "2013-07-18", 41.594921, "QUAL"),
}


def fetch_zip(name: str) -> str:
    r = urllib.request.urlopen(urllib.request.Request(BASE + name, headers=UA), timeout=120)
    z = zipfile.ZipFile(io.BytesIO(r.read()))
    return z.read(z.namelist()[0]).decode("latin1")


def parse_block(txt: str, col: str) -> dict:
    lines = txt.splitlines()
    start = next(i for i, l in enumerate(lines) if col in l)
    hdr = [h.strip() for h in lines[start].split(",")]
    idx = hdr.index(col)
    rows = {}
    for l in lines[start + 1:]:
        p = l.split(",")
        d = p[0].strip()
        if len(d) != 8 or not d.isdigit():
            break
        try:
            v = float(p[idx])
            if v > -99:  # -99.99 = chybejici hodnota
                rows[d] = v
        except ValueError:
            pass
    return rows


def yahoo_daily(tk: str, y0: int, y1: int) -> dict:
    p1 = int(datetime.datetime(y0, 1, 1).timestamp())
    p2 = int(datetime.datetime(y1, 1, 1).timestamp())
    u = f"https://query1.finance.yahoo.com/v8/finance/chart/{tk}?period1={p1}&period2={p2}&interval=1d"
    d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60))["chart"]["result"][0]
    return {
        datetime.datetime.utcfromtimestamp(t).strftime("%Y%m%d"): a
        for t, a in zip(d["timestamp"], d["indicators"]["adjclose"][0]["adjclose"])
        if a is not None
    }


def calibration(fr: dict, ticker: str) -> float:
    """Denni faktor c, aby CAGR French rady v prekryvu s ETF sedela na ETF."""
    etf = {}
    for y in [(2011, 2016), (2016, 2021), (2021, 2027)]:
        etf.update(yahoo_daily(ticker, *y))
    md = sorted(etf)
    ret = {md[i]: etf[md[i]] / etf[md[i - 1]] - 1 for i in range(1, len(md))}
    common = sorted(d for d in ret if d in fr)
    cf = cm = 1.0
    for d in common:
        cf *= 1 + fr[d] / 100
        cm *= 1 + ret[d]
    c = (cm / cf) ** (1 / len(common))
    print(f"  kalibrace {ticker}: c={c:.7f} ({((c ** 252) - 1) * 100:+.2f} %/rok, prekryv {len(common)} dni)")
    return c


def build(code: str) -> list:
    zip_name, col, anchor_date, anchor_price, calib = ANCHORS[code]
    fr = parse_block(fetch_zip(zip_name), col)
    c = calibration(fr, calib) if calib else 1.0
    a = anchor_date.replace("-", "")
    dates = sorted(d for d in fr if START <= d <= a)
    prices = {a: anchor_price}
    for i in range(len(dates) - 1, 0, -1):
        d, prev = dates[i], dates[i - 1]
        r = (1 + fr[d] / 100) * c - 1
        prices[prev] = prices[d] / (1 + r)
    out = [(f"{d[:4]}-{d[4:6]}-{d[6:]}", round(prices[d], 6)) for d in dates if d < a]
    print(f"  {code}: {len(out)} radku, {out[0][0]} -> {out[-1][0]}")
    return out


if __name__ == "__main__":
    with open("scripts/backtest/data/factor_extensions.csv", "w") as f:
        f.write("index_code,date,close_price\n")
        for code in ANCHORS:
            print(code + ":")
            for d, p in build(code):
                f.write(f"{code},{d},{p}\n")
    print("hotovo -> scripts/backtest/data/factor_extensions.csv")
