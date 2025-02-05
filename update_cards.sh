#!/bin/bash
# Navigate to the script's directory
cd "$(dirname "$0")"

echo "Updating card gallery..."

# Regenerate `cards.json`
./generate_card_list.sh

# Add all changes (including deleted files)
git add -A

# Commit the changes with a timestamp
git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"

# Push the changes to GitHub
git push origin main

echo "Gallery updated! Check your GitHub Pages site in a minute."