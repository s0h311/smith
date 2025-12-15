#!/bin/sh

node /app/scripts/migrate.ts;

HOST=0.0.0.0 PORT=3001 node /app/.output/server/index.mjs;