#!/usr/bin/env python3
"""
FÁZE 2 – prodloužení backtestu k ~1996 (chytne dot-com krach 2000).

Přidá dlouhé TOTAL-RETURN řady, které v DB chybí (globální akcie jdou dnes jen od 2008):
  - us_market      <- VTSMX (Vanguard Total Stock Market, US, data od 1992)
  - world_ex_us    <- VGTSX (Vanguard Total International, rozvinuté+EM mimo USA, od 1996)

Total return = auto-adjusted close (reinvestované dividendy), aby to bylo ferove srovnatelne
s ostatnimi indexy v DB. Kombinaci us_market + world_ex_us lze slozit "svetove akcie" az k 1996.
(Pozn.: CZK vznikla 1993 = absolutni strop korunoveho backtestu. Zlato/dluhopisy/komodity
zustavaji ~2002-2006, driv jejich ETF neexistovaly.)

Prihlasovaci udaje z ENV (klic se NIKAM nezapisuje natvrdo):
    pip install yfinance supabase pandas
    export SUPABASE_URL="https://nbhwnatadyubiuadfakx.supabase.co"
    export SUPABASE_KEY="<service_role klic>"
    python3 scripts/backtest/load_long_history.py
"""
import os
import sys
import yfinance as yf
from supabase import create_client

# index_code -> (Yahoo ticker, popis)
INDEXES = {
    "us_market":   ("VTSMX", "US Total Stock Market (Vanguard)"),
    "world_ex_us": ("VGTSX", "Total International ex-US (Vanguard)"),
}

def main():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("CHYBA: nastav SUPABASE_URL a SUPABASE_KEY (viz hlavicka skriptu).")
        sys.exit(1)
    sb = create_client(url, key)

    for code, (ticker, desc) in INDEXES.items():
        print(f"\n[{code}] {desc} <- {ticker}")
        hist = yf.Ticker(ticker).history(period="max", auto_adjust=True)
        if hist.empty:
            print("  VAROVANI: Yahoo nevratil zadna data, preskakuji.")
            continue
        monthly = hist["Close"].resample("ME").last().dropna()
        print(f"  {len(monthly)} mesicu: {monthly.index[0]:%Y-%m} -> {monthly.index[-1]:%Y-%m}")
        records = [
            {"index_code": code, "date": d.strftime("%Y-%m-%d"), "close_price": round(float(p), 6)}
            for d, p in monthly.items()
        ]
        for i in range(0, len(records), 500):
            sb.table("index_historical_data").upsert(
                records[i:i + 500], on_conflict="index_code,date"
            ).execute()
        print(f"  Nahrano {len(records)} radku.")

    print("\nOvereni v DB:")
    for code in INDEXES:
        res = sb.table("index_historical_data").select("date").eq("index_code", code).order("date").execute()
        ds = [r["date"] for r in res.data]
        print(f"  {code}: {len(ds)} radku, {ds[0] if ds else '-'} -> {ds[-1] if ds else '-'}")

if __name__ == "__main__":
    main()
