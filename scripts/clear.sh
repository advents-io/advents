#!/bin/bash

# Remove root node_modules
if [ -d "./node_modules" ]; then
  echo "Removing root node_modules..."
  rm -rf ./node_modules
fi

# Remove node_modules and .next from apps
echo "Removing node_modules and .next from apps..."
find ./apps -type d \( -name "node_modules" -o -name ".next" \) -prune -exec rm -rf {} +

# Remove node_modules from packages
echo "Removing node_modules from packages..."
find ./packages -name "node_modules" -type d -prune -exec rm -rf {} +

echo "✅ Project cleaned 🧹"
