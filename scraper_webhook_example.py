# Příklad kódu pro přidání na konec final_scraper.py

import requests
import logging
import os

def trigger_website_refresh():
    """
    Zavolá webhook pro aktualizaci homepage po dokončení scrapingu
    """
    try:
        # URL webhook endpointu
        webhook_url = "https://etfpruvodce.cz/api/revalidate"
        
        # Secret key pro zabezpečení
        secret_key = os.getenv('WEBSITE_REFRESH_SECRET', 'etf_refresh_2025')
        
        # Payload
        payload = {
            "secret": secret_key,
            "source": "scraper",
            "timestamp": datetime.now().isoformat()
        }
        
        print("🔄 Triggering website refresh...")
        
        # Zavolej webhook
        response = requests.post(
            webhook_url, 
            json=payload,
            timeout=30,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Website refresh successful: {result.get('message')}")
            print(f"📅 Timestamp: {result.get('timestamp')}")
        else:
            print(f"❌ Website refresh failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during website refresh: {e}")
    except Exception as e:
        print(f"❌ Unexpected error during website refresh: {e}")

# PŘIDAT NA KONEC final_scraper.py:
"""
def main():
    # ... existující scraper logika ...
    
    # Po úspěšném uploadu do Supabase:
    print("✅ All ETF data successfully uploaded to Supabase")
    
    # Zavolej refresh homepage
    trigger_website_refresh()
    
    print("🎉 Scraping process completed!")

if __name__ == "__main__":
    main()
"""

# Environment variable pro secret:
# export WEBSITE_REFRESH_SECRET="etf_refresh_2025"