#!/bin/sh

BACKEND_URL="http://vkusmeda.shop/api"

echo "Waiting for backend to be available at $BACKEND_URL..."
until curl -s --head --fail "$BACKEND_URL"; do
  echo "Backend not available yet. Retrying in 5 seconds..."
  sleep 5
done

echo "Backend is up! Starting Angular..."
exec node dist/client2/server/server.mjs
