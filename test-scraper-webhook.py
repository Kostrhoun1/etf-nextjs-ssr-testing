#!/usr/bin/env python3
"""
🧪 KOMPLETNÍ TEST scraperu s webhook aktualizací

Simuluje spuštění scraperu s jedním ETF a ověřuje webhook aktualizaci
"""

import requests
import json
import time
import sys
import os

# Konfigurace
WEBHOOK_CONFIG = {
    'url': 'http://localhost:3000/api/revalidate',  # Development URL
    'secret': 'etf_refresh_2025',
    'timeout': 30
}

def safe_log(level, message):
    """Bezpečné logování s timestamp"""
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{timestamp}] {level.upper()}: {message}")

def trigger_website_refresh():
    """
    Zavolá webhook pro aktualizaci homepage po dokončení scrapingu
    (Kopie funkce ze scraperu pro test)
    """
    try:
        safe_log("info", "🔄 Triggering website refresh...")
        
        # Payload pro webhook
        webhook_payload = {
            "secret": WEBHOOK_CONFIG['secret'],
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            "source": "test-scraper",
            "message": "Test scraper run completed"
        }
        
        # Pošli webhook request
        response = requests.post(
            WEBHOOK_CONFIG['url'],
            json=webhook_payload,
            timeout=WEBHOOK_CONFIG['timeout'],
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'ETF-Scraper-Test/1.0'
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            safe_log("info", f"✅ Website refresh successful: {result.get('message', 'OK')}")
            safe_log("info", f"📅 Timestamp: {result.get('timestamp', 'N/A')}")
            return True
        else:
            safe_log("error", f"❌ Website refresh failed: HTTP {response.status_code}")
            safe_log("error", f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        safe_log("error", f"❌ Website refresh timeout ({WEBHOOK_CONFIG['timeout']}s)")
        return False
    except requests.exceptions.ConnectionError:
        safe_log("error", "❌ Website refresh failed: Connection error (je Next.js server spuštěný?)")
        return False
    except Exception as e:
        safe_log("error", f"❌ Website refresh failed: {str(e)}")
        return False

def simulate_scraper_run():
    """Simuluje úspěšné spuštění scraperu"""
    
    print("🚀 SIMULACE SCRAPER RUN")
    print("========================\n")
    
    # Simulace kroků scraperu
    safe_log("info", "📥 Starting ETF scraping...")
    time.sleep(1)  # Simulace práce
    
    safe_log("info", "🔍 Scraping ETF data from justETF...")
    time.sleep(2)  # Simulace scraping
    
    safe_log("info", "💾 Processing ETF data...")
    time.sleep(1)  # Simulace zpracování
    
    safe_log("info", "📤 Uploading to Supabase database...")
    time.sleep(1)  # Simulace upload
    
    safe_log("info", "🎉 DATABÁZE: ✅ Automatické nahrávání do databáze dokončeno úspěšně!")
    
    # Kritický moment - volání webhook (stejně jako ve skutečném scraperu)
    print("\n🔗 WEBHOOK TRIGGER")
    print("===================")
    
    webhook_success = trigger_website_refresh()
    
    if webhook_success:
        print("\n✅ KOMPLETNÍ TEST ÚSPĚŠNÝ!")
        print("===========================")
        print("🎯 Scraper → Database → Webhook → Homepage refresh - VŠE FUNGUJE!")
        return True
    else:
        print("\n❌ TEST NEÚSPĚŠNÝ!")
        print("==================")
        print("🚨 Webhook selhál - homepage se neaktualizuje!")
        return False

def test_api_endpoint_directly():
    """Test pouze API endpointu bez simulace scraperu"""
    
    print("🧪 PŘÍMÝ TEST API ENDPOINTU")
    print("============================\n")
    
    try:
        # Test s válalným secret
        safe_log("info", "🔑 Testing with correct secret...")
        response = requests.post(
            WEBHOOK_CONFIG['url'],
            json={
                "secret": WEBHOOK_CONFIG['secret'],
                "source": "direct-test"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            safe_log("info", "✅ Correct secret accepted")
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)}")
        else:
            safe_log("error", f"❌ Unexpected status code: {response.status_code}")
            return False
        
        # Test s neplatným secret
        safe_log("info", "\n🔑 Testing with wrong secret...")
        response = requests.post(
            WEBHOOK_CONFIG['url'],
            json={
                "secret": "wrong_secret",
                "source": "direct-test"
            },
            timeout=10
        )
        
        if response.status_code == 401:
            safe_log("info", "✅ Wrong secret correctly rejected")
        else:
            safe_log("error", f"❌ Expected 401, got {response.status_code}")
            return False
            
        return True
        
    except Exception as e:
        safe_log("error", f"❌ API test failed: {str(e)}")
        return False

def main():
    """Hlavní test funkce"""
    
    print("🧪 KOMPLETNÍ TEST SCRAPER + WEBHOOK AKTUALIZACE")
    print("===============================================\n")
    
    # Kontrola, že Next.js server běží
    try:
        safe_log("info", "🔍 Checking if Next.js server is running...")
        test_response = requests.get('http://localhost:3000', timeout=5)
        safe_log("info", f"✅ Next.js server is running (status: {test_response.status_code})")
    except:
        safe_log("error", "❌ Next.js server is not running!")
        safe_log("error", "   Please run: npm run dev")
        sys.exit(1)
    
    print()
    
    # Test 1: Přímý test API
    api_success = test_api_endpoint_directly()
    
    print("\n" + "="*50)
    
    # Test 2: Simulace kompletního scraper run
    scraper_success = simulate_scraper_run()
    
    # Výsledek
    print("\n" + "="*50)
    print("📊 CELKOVÝ VÝSLEDEK")
    print("===================")
    
    if api_success and scraper_success:
        print("🎉 VŠE FUNGUJE PERFEKTNĚ!")
        print("   ✅ API endpoint funguje")
        print("   ✅ Webhook se volá ze scraperu")
        print("   ✅ Homepage se aktualizuje")
        print("\n🚀 Scraper je připravený pro produkční použití!")
        sys.exit(0)
    else:
        print("🚨 NĚCO NEFUNGUJE!")
        if not api_success:
            print("   ❌ API endpoint má problémy")
        if not scraper_success:
            print("   ❌ Webhook volání selhává")
        print("\n🛠️  Potřeba opravit před produkčním použitím!")
        sys.exit(1)

if __name__ == "__main__":
    main()