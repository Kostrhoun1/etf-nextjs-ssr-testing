#!/usr/bin/env bash
# Úklid kopií repa po agentech (.claude/worktrees) – zavedeno 11. 11. 2026 (disk Macu plný: 46 kopií = 17 GB).
#
# Odstraní JEN kopii, která je čistá (git status --porcelain prázdný) A jejíž větev je celá v origin/main.
# Maže přes `git worktree remove` (nikdy rm), pak `git worktree prune` a sloučené větve `git branch -d`
# (-d odmítne nesloučenou větev). Kopii s prací jen vypíše – rozhodne člověk.
#
# Použití:  bash scripts/uklid-worktree.sh          (jen výpis, nic nemaže)
#           bash scripts/uklid-worktree.sh --smazat (opravdu odstraní)
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
SMAZAT=0; [ "${1:-}" = "--smazat" ] && SMAZAT=1
git fetch -q origin 2>/dev/null
HLAVNI="$(pwd)"
smazano=0; praci=0
while IFS=$'\t' read -r p b; do
  [ "$p" = "$HLAVNI" ] && continue
  if [ ! -d "$p" ]; then continue; fi
  dirty=$(git -C "$p" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  ahead=$( [ -n "$b" ] && git rev-list --count "origin/main..$b" 2>/dev/null || echo "?")
  vel=$(du -sh "$p" 2>/dev/null | cut -f1)
  if [ "$dirty" = 0 ] && [ "$ahead" = 0 ]; then
    if [ $SMAZAT = 1 ]; then
      git worktree unlock "$p" 2>/dev/null
      if git worktree remove "$p"; then echo "SMAZÁNO  $vel  $p"; smazano=$((smazano+1)); fi
    else echo "LZE SMAZAT  $vel  $p [$b]"; fi
  else
    echo "OBSAHUJE PRÁCI  $vel  $p [$b] necommitnuto=$dirty nesloučených commitů=$ahead"; praci=$((praci+1))
  fi
done < <(git worktree list --porcelain | awk '/^worktree /{p=substr($0,10)} /^branch /{b=$2; sub("refs/heads/","",b); print p"\t"b; p=""; b=""} /^detached/{print p"\t"}')
git worktree prune
if [ $SMAZAT = 1 ]; then
  git branch --format='%(refname:short)' | grep -E '^worktree-agent-' | while read -r b; do
    git worktree list --porcelain | grep -q "refs/heads/$b$" && continue
    git branch -d "$b" >/dev/null 2>&1 && echo "větev smazána: $b"
  done
fi
echo "Hotovo: smazáno $smazano, s prací $praci (ty zkontrolovat ručně)."
