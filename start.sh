#!/usr/bin/env bash
set -e  # stop on the first error

echo "==> Checking for Docker..."
if ! command -v docker &> /dev/null; then
  echo "Docker isn't installed or not on your PATH. Install it first: https://docs.docker.com/get-docker/"
  exit 1
fi

echo "==> Starting Postgres via Docker Compose..."
docker compose up -d

echo "==> Installing dependencies..."
npm install

if [ ! -f .env ]; then
  echo "==> No .env found — creating one from .env.example"
  cp .env.example .env

  echo "==> Generating AUTH_SECRET..."
  SECRET=$(openssl rand -base64 32)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^AUTH_SECRET=.*|AUTH_SECRET=\"$SECRET\"|" .env
  else
    sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=\"$SECRET\"|" .env
  fi
  echo "    AUTH_SECRET set. DATABASE_URL already matches docker-compose.yml — no changes needed there."
else
  echo "==> .env already exists, leaving it as-is."
fi

echo "==> Waiting for Postgres to accept connections..."
until docker compose exec -T db pg_isready -U cardgame &> /dev/null; do
  echo "    ...still waiting"
  sleep 1
done

echo "==> Applying migrations..."
npx prisma migrate dev

echo "==> Generating Prisma Client..."
npx prisma generate

echo "==> Seeding the database..."
npx prisma db seed || echo "    (seed skipped — fine if the card list is still empty)"

echo "==> Starting the dev server..."
npm run dev
