#!/bin/bash
# Test scripts/vercel-ignore.sh na umělých repozitářích (21. 11. 2026). Spuštění: bash scripts/vercel-ignore.test.sh
# Stáří produkce se podstrkuje přes IGNORE_URL (file://… se značkou build-time). Exit 0 = vše sedí.
set -u
SKRIPT="$(cd "$(dirname "$0")" && pwd)/vercel-ignore.sh"
T=$(mktemp -d); trap 'rm -r "$T"' EXIT
CHYB=0
web() { echo "<meta name=\"build-time\" content=\"$1\"/>" > "$T/web.html"; }
pred() { date -u -v-"$1"d '+%Y-%m-%dT%H:%M:%S.000Z' 2>/dev/null || date -u -d "$1 days ago" '+%Y-%m-%dT%H:%M:%S.000Z'; }
cekam() { # popis, očekávaný exit, adresář, P
  ( cd "$3" && VERCEL_GIT_PREVIOUS_SHA="$4" IGNORE_URL="file://$T/web.html" bash "$SKRIPT" ); local e=$?
  if [ "$e" = "$2" ]; then echo "ok   $1"; else echo "CHYBA $1: exit $e, čekáno $2"; CHYB=$((CHYB+1)); fi
}
git init -q "$T/o" && cd "$T/o" && git config user.email t@t && git config user.name t
mkdir -p src scripts && echo a > src/a.ts && echo b > scripts/b.mjs && echo c > README.md && git add -A && git commit -qm zaklad
NASAZENO=$(git rev-parse HEAD)
for i in 1 2 3; do echo "$i" >> README.md; echo "$i" >> scripts/b.mjs; git commit -qam "poznámky $i"; done
web "$(pred 2)"
cekam "naposledy nasazený commit v klonu, jen poznámky a skripty → přeskočit" 0 "$T/o" "$NASAZENO"
cekam "bez VERCEL_GIT_PREVIOUS_SHA → stavět" 1 "$T/o" ""
web "$(pred 7)"
cekam "produkce stará 7 dní → stavět (týdenní přestavba), i když se nic nezměnilo" 1 "$T/o" "$(git rev-parse HEAD)"
web "$(pred 2)"
for i in 4 5 6 7 8 9 10 11 12 13 14 15; do echo "$i" >> README.md; git commit -qam "poznámky $i"; done
git clone -q --depth=10 "file://$T/o" "$T/melky"
cekam "mělký klon bez nasazeného commitu, vidět jen poznámky → přeskočit (dřív stavěl)" 0 "$T/melky" "$NASAZENO"
web "$(pred 7)"
cekam "mělký klon bez nasazeného commitu, produkce stará 7 dní → stavět" 1 "$T/melky" "$NASAZENO"
web "$(pred 2)"
cd "$T/o" && echo x >> src/a.ts && git commit -qam "změna webu" && echo z >> README.md && git commit -qam "poznámky po změně"
git clone -q --depth=10 "file://$T/o" "$T/melky2"
cekam "mělký klon, mezi viditelnými commity změna webu → stavět" 1 "$T/melky2" "$NASAZENO"
cekam "plný klon, změna webu od nasazení → stavět" 1 "$T/o" "$NASAZENO"
rm "$T/web.html"
cekam "web neodpovídá, nasazený commit v klonu, změna webu → stavět" 1 "$T/o" "$NASAZENO"
cekam "web neodpovídá a nasazený commit v klonu není → stavět" 1 "$T/melky" "$NASAZENO"
cd "$T/o" && cekam "web neodpovídá, nasazený commit = HEAD (čerstvý), nic se nezměnilo → přeskočit" 0 "$T/o" "$(git rev-parse HEAD)"
[ "$CHYB" = 0 ] && echo "VŠE SEDÍ" || { echo "CHYB: $CHYB"; exit 1; }
