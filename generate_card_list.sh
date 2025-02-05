#!/bin/bash
# Ensure the script runs in its own directory
cd "$(dirname "$0")"

# Generate a JSON list of PNG filenames manually
echo "[" > cards.json
ls *.png | awk '{ print "  \"" $0 "\"," }' >> cards.json
sed -i '$ s/,$//' cards.json  # Remove the trailing comma on the last line
echo "]" >> cards.json

echo "Updated cards.json with PNG files!"
