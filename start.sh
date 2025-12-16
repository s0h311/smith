#!/bin/sh

node /app/scripts/migrate.ts;

HOST=0.0.0.0 node /app/.output/server/index.mjs;