#!/bin/bash

echo "🧪 RYCHLÝ TEST WEBHOOK"
echo "======================"
echo

# Kontrola, že Next.js server běží
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Next.js server neběží!"
    echo "   Spusť: npm run dev"
    exit 1
fi

echo "✅ Next.js server běží"
echo

# Webhook test
echo "🔄 Testuju webhook..."
response=$(curl -s -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"etf_refresh_2025","source":"quick-test"}' \
  -w "HTTP_CODE:%{http_code}")

# Parse response
http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
json_response=$(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$http_code" = "200" ]; then
    echo "✅ Webhook test ÚSPĚŠNÝ!"
    echo "📄 Response: $json_response"
    echo
    echo "🎉 Scraper webhook funkce je připravená!"
else
    echo "❌ Webhook test NEÚSPĚŠNÝ!"
    echo "📄 HTTP Code: $http_code"
    echo "📄 Response: $json_response"
    exit 1
fi