#!/bin/bash

OUTPUT_FILE="card_grid.png"

# Card and grid dimensions (in pixels at 300 DPI)
CARD_WIDTH_PX=900     # 2.5 inches * 300 DPI
CARD_HEIGHT_PX=1200   # 3.5 inches * 300 DPI
COLUMNS=6
ROWS=3
IMAGE_WIDTH_PX=$((CARD_WIDTH_PX * COLUMNS))
IMAGE_HEIGHT_PX=$((CARD_HEIGHT_PX * ROWS))

# Generate the list of drawing commands for all grid lines
DRAW_COMMANDS=""

# Horizontal lines
for row in $(seq 0 $ROWS); do
    Y_POS=$((row * CARD_HEIGHT_PX))
    DRAW_COMMANDS+=" line 0,$Y_POS $IMAGE_WIDTH_PX,$Y_POS"
done

# Vertical lines
for col in $(seq 0 $COLUMNS); do
    X_POS=$((col * CARD_WIDTH_PX))
    DRAW_COMMANDS+=" line $X_POS,0 $X_POS,$IMAGE_HEIGHT_PX"
done

# Create the grid in one command to prevent file overwriting issues
magick -size ${IMAGE_WIDTH_PX}x${IMAGE_HEIGHT_PX} xc:none -stroke white -strokewidth 8 -draw "$DRAW_COMMANDS" "$OUTPUT_FILE"

echo "Grid generated: $OUTPUT_FILE"
