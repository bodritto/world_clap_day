#!/usr/bin/env bash
# Убирает захардкоженные Stripe-ключи из истории git.
# Копирует текущие (уже исправленные) файлы во все коммиты начиная с указанного.
# Запуск: ./scripts/remove-secret-from-history.sh [коммит_с_секретом]
# Пример: ./scripts/remove-secret-from-history.sh 3d0d8fd
# После скрипта: git push --force-with-lease

set -e
cd "$(dirname "$0")/.."

BAD_COMMIT="${1:-3d0d8fd}"
BACKUP_DIR="/tmp/wcd-stripe-fix-$$"
mkdir -p "$BACKUP_DIR"

echo "→ Копирую текущие src/lib/stripe.ts и src/lib/stripe-keys.ts в $BACKUP_DIR"
cp src/lib/stripe.ts "$BACKUP_DIR/stripe.ts"
cp src/lib/stripe-keys.ts "$BACKUP_DIR/stripe-keys.ts"

STASHED=
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo "→ Временно откладываю незакоммиченные изменения (git stash)"
  git stash push -m "wcd remove-secret"
  STASHED=1
fi

RANGE="${BAD_COMMIT}^..HEAD"
echo "→ Перезаписываю историю: в коммитах $RANGE подставляю чистые файлы (без секретов)"
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --tree-filter "
  cp '$BACKUP_DIR/stripe.ts' src/lib/stripe.ts 2>/dev/null || true
  cp '$BACKUP_DIR/stripe-keys.ts' src/lib/stripe-keys.ts 2>/dev/null || true
" "$RANGE"

if [ -n "$STASHED" ]; then
  echo "→ Восстанавливаю незакоммиченные изменения (git stash pop)"
  git stash pop
fi

echo ""
echo "Готово. Резервная копия: $BACKUP_DIR"
echo "Запушьте изменения: git push --force-with-lease"
