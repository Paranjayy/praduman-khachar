#!/bin/bash
cd "/Users/paranjay/Developer/Praduman Khachar"

echo "=== Starting deploy ==="
echo "$(date)"

# Step 1: Pre-build
echo "--- Running pre-build scripts ---"
node scripts/gen-stats.mjs 2>&1
node scripts/gen-rss.mjs 2>&1

# Step 2: Vite build
echo "--- Running vite build ---"
npx vite build 2>&1 | tail -10
BUILD_EXIT=$?
echo "Build exit code: $BUILD_EXIT"

if [ $BUILD_EXIT -ne 0 ]; then
  echo "BUILD FAILED"
  exit 1
fi

# Step 3: Vercel deploy
echo "--- Deploying to Vercel ---"
vercel deploy --prod --yes 2>&1 | tail -20
DEPLOY_EXIT=$?
echo "Deploy exit code: $DEPLOY_EXIT"

echo "$(date)"
echo "=== Done ==="
