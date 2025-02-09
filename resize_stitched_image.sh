#!/bin/bash

# Input and output file
INPUT="stitched_cards.jpg"
OUTPUT="stitched_cards_resized.jpg"
MAX_SIZE_MB=8  # Maximum file size in MB
MAX_DIMENSION=4000  # Maximum width/height in pixels

# Check if ImageMagick's `magick` or `convert` is available
if command -v magick >/dev/null 2>&1; then
    CONVERT="magick convert"
elif command -v convert >/dev/null 2>&1; then
    CONVERT="convert"
else
    echo "❌ ImageMagick is not installed. Install it and try again."
    exit 1
fi

# Ensure input file exists
if [ ! -f "$INPUT" ]; then
    echo "❌ Input file '$INPUT' not found!"
    exit 1
fi

# Get initial dimensions
WIDTH=$(identify -format "%w" "$INPUT")
HEIGHT=$(identify -format "%h" "$INPUT")

# Resize if dimensions exceed the max allowed
if [ "$WIDTH" -gt "$MAX_DIMENSION" ] || [ "$HEIGHT" -gt "$MAX_DIMENSION" ]; then
    echo "🔄 Resizing image to fit within ${MAX_DIMENSION}x${MAX_DIMENSION}..."
    $CONVERT "$INPUT" -resize "${MAX_DIMENSION}x${MAX_DIMENSION}" "$OUTPUT"
else
    cp "$INPUT" "$OUTPUT"  # If resizing isn't needed, just copy the input
fi

# Reduce file size while maintaining quality
QUALITY=85
while :; do
    # Compress the image
    $CONVERT "$OUTPUT" -quality $QUALITY "$OUTPUT"

    # Get new file size in MB
    FILE_SIZE_MB=$(du -m "$OUTPUT" | cut -f1)

    # Stop if file is within the size limit
    if [ "$FILE_SIZE_MB" -le "$MAX_SIZE_MB" ]; then
        echo "✅ Final image saved as $OUTPUT (Size: ${FILE_SIZE_MB}MB)"
        break
    fi

    # Reduce quality incrementally
    QUALITY=$((QUALITY - 5))
    if [ "$QUALITY" -lt 50 ]; then
        echo "⚠️ Unable to reach 8MB without extreme quality loss."
        break
    fi

    echo "⚠️ File still too large (${FILE_SIZE_MB}MB), reducing quality to $QUALITY..."
done
