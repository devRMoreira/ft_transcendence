#!/usr/bin/env bash
set -e

echo "==> Checking for Docker..."
if ! command -v docker &> /dev/null; then
  echo "Docker isn't installed or not on your PATH. Install it first: https://docs.docker.com/get-docker/"
  exit 1
fi

if [ ! -f .env ]; then
  echo "==> No .env found. Creating one from .env.example..."
  cp .env.example .env

  echo "==> Generating AUTH_SECRET..."
  SECRET=$(openssl rand -base64 32)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^AUTH_SECRET=.*|AUTH_SECRET=\"$SECRET\"|" .env
  else
    sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=\"$SECRET\"|" .env
  fi

  echo ""
  echo "=========================================================="
  echo " ⚠️ ACTION REQUIRED FOR OAUTH ⚠️"
  echo "=========================================================="
  echo " The .env file has been created and AUTH_SECRET generated."
  echo " Please open the .env file now and paste your actual"
  echo " GitHub and Google OAuth IDs and Secrets."
  echo "=========================================================="
  read -p "Press [Enter] ONLY AFTER you have saved the keys in .env..."
else
  echo "==> .env already exists. Proceeding with existing keys."
fi

echo "==> Building and deploying containers via Docker Compose..."
docker compose up --build -d

echo "==> Deployment initiated!"
echo "    The database will initialize, apply migrations, and seed automatically."
echo "    The app will be available at http://localhost:3000 in a few moments."