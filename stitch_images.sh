#!/bin/bash

# Output file
OUTPUT="stitched_cards.jpg"
MAX_SIZE_MB=8  # Target file size in MB

# Find all images inside the "cards" folder
mapfile -t IMAGES < <(find cards/ -type f \( -iname "*.png" -o -iname "*.jpg" \) | sort)

# Count images
TOTAL_IMAGES=${#IMAGES[@]}
if [ $TOTAL_IMAGES -eq 0 ]; then
    echo "No images found in 'cards/' folder!"
    exit 1
fi

# Calculate square-like grid size WITHOUT using bc
COLUMNS=$(awk "BEGIN {print int(sqrt($TOTAL_IMAGES))}")  # Square root using awk
if [ $((COLUMNS * COLUMNS)) -lt $TOTAL_IMAGES ]; then
    ((COLUMNS++))
fi
ROWS=$(( (TOTAL_IMAGES + COLUMNS - 1) / COLUMNS ))

echo "🛠 Arranging images in a $COLUMNS x $ROWS grid..."

# Ensure we pass only the correct number of images
IMAGE_LIST=("${IMAGES[@]:0:$TOTAL_IMAGES}")

# Create the stitched image in one step, preventing duplicate rows
montage "${IMAGE_LIST[@]}" -tile "${COLUMNS}x${ROWS}" -geometry +2+2 "$OUTPUT"

# Reduce file size with resizing & compression
convert "$OUTPUT" -resize 50% -quality 80 "$OUTPUT"

# Check final file size
FILE_SIZE_MB=$(du -m "$OUTPUT" | cut -f1)

if [ "$FILE_SIZE_MB" -le "$MAX_SIZE_MB" ]; then
    echo "✅ Stitched image saved as $OUTPUT (Size: ${FILE_SIZE_MB}MB)"
else
    echo "⚠️ File is still too large (${FILE_SIZE_MB}MB), resizing further..."
    
    # Try a second compression pass to ensure it fits
    convert "$OUTPUT" -resize 50% -quality 70 "$OUTPUT"

    # Check size again
    FILE_SIZE_MB=$(du -m "$OUTPUT" | cut -f1)
    if [ "$FILE_SIZE_MB" -le "$MAX_SIZE_MB" ]; then
        echo "✅ Resized successfully under 35MB (Final size: ${FILE_SIZE_MB}MB)"
    else
        echo "⚠️ Final file is still ${FILE_SIZE_MB}MB. Consider manually resizing further."
    fi
fi
