#!/usr/bin/env python3
"""
Fetch monthly historical data for indexes from Yahoo Finance
and store them in Supabase.

Usage:
    python3 fetch_index_data.py
"""

import yfinance as yf
from supabase import create_client
from datetime import datetime
import pandas as pd

# Supabase config
SUPABASE_URL = 'https://nbhwnatadyubiuadfakx.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'

# Index definitions
INDEXES = {
    'msci_world': {
        'ticker': '^990100-USD-STRD',
        'name': 'MSCI World',
        'is_total_return': False
    },
    'sp500': {
        'ticker': '^SP500TR',
        'name': 'S&P 500 Total Return',
        'is_total_return': True
    },
    'msci_europe': {
        'ticker': 'IEUR',  # iShares MSCI Europe ETF as proxy
        'name': 'MSCI Europe',
        'is_total_return': False
    },
    'stoxx600': {
        'ticker': '^STOXX',
        'name': 'STOXX Europe 600',
        'is_total_return': False
    },
    'msci_em': {
        'ticker': 'EEM',  # iShares MSCI Emerging Markets ETF as proxy
        'name': 'MSCI Emerging Markets',
        'is_total_return': False
    }
}


def fetch_monthly_data(ticker: str) -> pd.DataFrame:
    """Fetch historical data and resample to monthly."""
    print(f"  Fetching data for {ticker}...")

    try:
        data = yf.Ticker(ticker)
        hist = data.history(period='max')

        if hist.empty:
            print(f"  WARNING: No data for {ticker}")
            return pd.DataFrame()

        # Resample to monthly (last day of month)
        monthly = hist['Close'].resample('ME').last()

        # Remove NaN values
        monthly = monthly.dropna()

        print(f"  Got {len(monthly)} monthly data points ({monthly.index[0].strftime('%Y-%m')} to {monthly.index[-1].strftime('%Y-%m')})")

        return monthly

    except Exception as e:
        print(f"  ERROR fetching {ticker}: {e}")
        return pd.DataFrame()


def store_to_supabase(supabase, index_code: str, monthly_data: pd.Series):
    """Store monthly data to Supabase."""
    if monthly_data.empty:
        return 0

    print(f"  Storing {len(monthly_data)} records to Supabase...")

    # Prepare records
    records = []
    for date, price in monthly_data.items():
        records.append({
            'index_code': index_code,
            'date': date.strftime('%Y-%m-%d'),
            'close_price': round(float(price), 6)
        })

    # Insert in batches of 500
    batch_size = 500
    inserted = 0

    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        try:
            result = supabase.table('index_historical_data').upsert(
                batch,
                on_conflict='index_code,date'
            ).execute()
            inserted += len(batch)
        except Exception as e:
            print(f"  ERROR inserting batch: {e}")

    print(f"  Inserted/updated {inserted} records")
    return inserted


def main():
    print("=" * 60)
    print("BACKTEST DATA FETCHER")
    print("=" * 60)
    print()

    # Connect to Supabase
    print("Connecting to Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Connected!\n")

    total_records = 0

    for index_code, config in INDEXES.items():
        print(f"\n[{index_code.upper()}] {config['name']}")
        print("-" * 40)

        # Fetch data
        monthly_data = fetch_monthly_data(config['ticker'])

        if not monthly_data.empty:
            # Store to Supabase
            inserted = store_to_supabase(supabase, index_code, monthly_data)
            total_records += inserted

    print("\n" + "=" * 60)
    print(f"DONE! Total records: {total_records}")
    print("=" * 60)

    # Summary
    print("\nVerifying data in database...")
    for index_code in INDEXES.keys():
        result = supabase.table('index_historical_data')\
            .select('date')\
            .eq('index_code', index_code)\
            .order('date')\
            .execute()

        if result.data:
            dates = [r['date'] for r in result.data]
            print(f"  {index_code}: {len(dates)} records ({dates[0]} to {dates[-1]})")
        else:
            print(f"  {index_code}: NO DATA")


if __name__ == '__main__':
    main()
