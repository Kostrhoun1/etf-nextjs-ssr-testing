#!/bin/bash
# Vercel „Ignored Build Step“ (vercel.json ignoreCommand). Exit 0 = build PŘESKOČIT, 1 = STAVĚT.
#
# - Změna jen scripts/, .github/ a *.md → přeskočit (opravy kontrol jdou do main bez nasazení webu).
# - Produkce starší než 6 dní → stavět vždy. Týdenní přestavba (deploy hook z workflow
#   .github/workflows/tydenni-prestavba.yml, sobota) nic v kódu nemění; bez tohohle by ji diff přeskočil a předgenerované
#   detaily fondů (platnost 30 dní, vyprší všechny najednou) by jednou vypršely naráz – 8. 11. 2026.
#
# 21. 11. 2026 – ODOLNOST PROTI MĚLKÉMU KLONU. Vercel klonuje jen několik posledních commitů (--depth). Dřív: když
# naposledy nasazený commit ($VERCEL_GIT_PREVIOUS_SHA) v klonu nebyl, skript stavěl („raději zbytečný build“). Při
# nasazování jednou týdně a 2–3 commitech denní kontroly denně by tak po pár dnech KAŽDÁ změna poznámek spustila ostré
# nasazení – a každé nasazení maže cache CDN (čtení ISR cache a přenos z originu, limity free tieru). Teď:
#  1) Stáří produkce se bere z živého webu (<meta name="build-time">), ne z času commitu → nezávisí na hloubce klonu.
#     Když web neodpoví, z času naposledy nasazeného commitu; když není ani ten, stavět.
#  2) Když naposledy nasazený commit v klonu není, posoudí se commity, které v klonu JSOU: žádná změna mimo
#     scripts/.github/*.md → přeskočit. Starší commity se posoudily při svém vlastním pushi (změna webu by tehdy stavěla).
# Test: scripts/vercel-ignore.test.sh (umělé repozitáře, mělký klon). STRANKA lze pro test přepsat proměnnou IGNORE_URL.
P="$VERCEL_GIT_PREVIOUS_SHA"
[ -z "$P" ] && exit 1
STRANKA="${IGNORE_URL:-https://etfpruvodce.cz/}"
MIMO=(':(exclude)scripts' ':(exclude).github' ':(exclude)*.md')
MA_P=0
git cat-file -e "$P^{commit}" 2>/dev/null && MA_P=1

# 1) Stáří produkce v sekundách.
KDY=""
BT=$(curl -fsS -m 20 "$STRANKA" 2>/dev/null | grep -o 'name="build-time" content="[^"]*"' | head -1 | sed 's/.*content="//; s/"$//')
if [ -n "$BT" ]; then
  KDY=$(date -u -d "$BT" +%s 2>/dev/null || date -u -j -f '%Y-%m-%dT%H:%M:%S' "${BT%%.*}" +%s 2>/dev/null)
fi
if [ -z "$KDY" ] && [ "$MA_P" = 1 ]; then KDY=$(git show -s --format=%ct "$P" 2>/dev/null); fi
[ -z "$KDY" ] && exit 1
[ $(( $(date +%s) - KDY )) -gt 518400 ] && exit 1

# 2) Změnilo se něco, co se nasazuje?
if [ "$MA_P" = 1 ]; then
  git diff --quiet "$P" HEAD -- . "${MIMO[@]}" 2>/dev/null && exit 0
  exit 1
fi
NEJSTARSI=$(git rev-list --max-parents=0 HEAD 2>/dev/null | tail -1)
[ -z "$NEJSTARSI" ] && exit 1
git diff --quiet "$NEJSTARSI" HEAD -- . "${MIMO[@]}" 2>/dev/null && exit 0
exit 1
