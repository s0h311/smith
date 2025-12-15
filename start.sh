#!/bin/sh

node /app/scripts/migrate.ts;

node /app/.output/server/index.mjs;