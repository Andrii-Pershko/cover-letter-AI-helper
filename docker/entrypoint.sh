#!/bin/sh
set -eu

APP_ENV="${APP_ENV:-production}"

if [ "$APP_ENV" = "dev" ] || [ "$APP_ENV" = "development" ]; then
  if [ ! -d node_modules/next ]; then
    echo "Installing npm dependencies..."
    npm ci
  fi
  echo "Generating Prisma client..."
  npx prisma generate
fi

echo "Running Prisma migrations..."
# Standalone image has no .bin on PATH; npx then fails with "prisma: not found".
if [ -f node_modules/prisma/build/index.js ]; then
  node node_modules/prisma/build/index.js migrate deploy
else
  npx prisma migrate deploy
fi

if [ "$APP_ENV" = "dev" ] || [ "$APP_ENV" = "development" ]; then
  echo "Starting Next.js (dev, live reload)..."
  exec npm run dev:docker
fi

echo "Starting Next.js..."
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-3401}"
if [ -f server.js ]; then
  exec node server.js
fi
exec npm start
