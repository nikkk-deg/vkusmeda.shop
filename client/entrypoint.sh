#!/bin/sh

BACKEND_URL="http://backend:3000/api"

echo "Waiting for backend to be available at $BACKEND_URL..."
until curl -s --head --fail "$BACKEND_URL"; do
  echo "Backend not available yet. Retrying in 5 seconds..."
  sleep 5
done

echo "Backend is up! Running Angular build..."
ng build || { echo "Angular build failed"; exit 1; }

echo "Copying static product files to shared volume..."
cp -r /app/dist/client2/browser/product /app/dist

echo "Starting Angular..."
exec node dist/client2/server/server.mjs
