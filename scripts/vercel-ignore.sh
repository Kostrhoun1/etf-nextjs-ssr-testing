#!/bin/bash
# Vercel „Ignored Build Step“ (vercel.json ignoreCommand). Exit 0 = build PŘESKOČIT, 1 = STAVĚT.
#
# - Změna jen scripts/, .github/ a *.md → přeskočit (opravy kontrol jdou do main bez nasazení webu).
# - Poslední nasazený commit starší než 6 dní → stavět vždy. Týdenní přestavba (deploy hook z workflow
#   .github/workflows/tydenni-prestavba.yml, sobota) nic v kódu nemění; bez tohohle by ji diff přeskočil a předgenerované
#   detaily fondů (platnost 30 dní, vyprší všechny najednou) by jednou vypršely naráz – 8. 11. 2026.
# - Jakákoli chyba gitu (předchozí commit mimo mělký klon…) → stavět. Raději zbytečný build než žádný.
P="$VERCEL_GIT_PREVIOUS_SHA"
[ -z "$P" ] && exit 1
git cat-file -e "$P^{commit}" 2>/dev/null || exit 1
STARI=$(( $(date +%s) - $(git show -s --format=%ct "$P" 2>/dev/null || echo 0) ))
[ "$STARI" -gt 518400 ] && exit 1
git diff --quiet "$P" HEAD -- . ':(exclude)scripts' ':(exclude).github' ':(exclude)*.md' 2>/dev/null && exit 0
exit 1
