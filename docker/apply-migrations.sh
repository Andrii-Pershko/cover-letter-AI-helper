#!/bin/sh
set -eu

export PGHOST="${PGHOST:-db}"
export PGUSER="${PGUSER:-aicl}"
export PGPASSWORD="${PGPASSWORD:-aicl}"
export PGDATABASE="${PGDATABASE:-aicl}"

i=0
while [ "$i" -lt 30 ]; do
  pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1 && break
  i=$((i + 1))
  sleep 1
done
pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE"

psql -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);
SQL

for dir in /migrations/[0-9]*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  file="${dir}migration.sql"
  [ -f "$file" ] || continue

  applied=$(psql -tAc "SELECT 1 FROM _prisma_migrations WHERE migration_name = '${name}' AND finished_at IS NOT NULL LIMIT 1")
  if [ "$applied" = "1" ]; then
    echo "Already applied ${name}"
    continue
  fi

  echo "Applying ${name}"
  checksum=$(sha256sum "$file" | awk '{print $1}')
  id=$(cat /proc/sys/kernel/random/uuid)
  psql -v ON_ERROR_STOP=1 -f "$file"
  psql -v ON_ERROR_STOP=1 <<SQL
INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at, finished_at, applied_steps_count)
VALUES ('${id}', '${checksum}', '${name}', now(), now(), 1)
ON CONFLICT (id) DO NOTHING;
SQL
done

echo "Migrations done"
