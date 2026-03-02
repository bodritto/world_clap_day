#!/usr/bin/env bash
# Создаёт базу (если в DATABASE_URL не postgres), накатывает миграции Prisma.
# Загружает .env из корня проекта. Запуск: ./scripts/setup-local-db.sh или npm run db:setup

set -e
cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  source .env
  set +a
elif [ -f .env.local ]; then
  set -a
  source .env.local
  set +a
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Ошибка: DATABASE_URL не задан. Заполните .env или .env.local." >&2
  exit 1
fi

# Имя БД из URL (последний сегмент пути до ?)
DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^/?]+)(\?.*)?$|\1|')

# Если БД не стандартная postgres — создаём (подключаемся к postgres и создаём целевую БД)
if [ "$DB_NAME" != "postgres" ]; then
  PSQL_SYS_URL=$(echo "$DATABASE_URL" | sed -E "s|/([^/?]+)(\?.*)?$|/postgres\2|")
  echo "Проверка базы: $DB_NAME"
  if ! psql "$PSQL_SYS_URL" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
    echo "Создаём базу: $DB_NAME"
    psql "$PSQL_SYS_URL" -c "CREATE DATABASE \"$DB_NAME\";"
  fi
fi

echo "Применяем миграции Prisma..."
# Если есть упавшая миграция — резолвим её (ошибка не страшна, если записи нет)
npx prisma migrate resolve --rolled-back 20250223180000_add_clapper_count_fixed 2>/dev/null || true
npx prisma migrate deploy

echo "Готово: база настроена, миграции применены."
