#!/bin/bash

# Set image dimensions (Width x Height in pixels)
IMAGE_WIDTH=1920   # Change this to your desired width
IMAGE_HEIGHT=1080  # Change this to your desired height
OUTPUT_FILE="starry_sky.png"

# Number of stars to generate (adjust for density)
STAR_COUNT=400  
BRIGHT_STAR_COUNT=10  # Number of extra-bright stars

# Create a black background
magick -size ${IMAGE_WIDTH}x${IMAGE_HEIGHT} xc:black "$OUTPUT_FILE"

# Generate random star positions and brightness in one command
DRAW_COMMANDS=""

# Normal Stars
for ((i=0; i<STAR_COUNT; i++)); do
    X_POS=$((RANDOM % IMAGE_WIDTH))
    Y_POS=$((RANDOM % IMAGE_HEIGHT))
    
    # Random brightness for normal stars (100-255)
    BRIGHTNESS=$((RANDOM % 155 + 100))
    
    # Add drawing commands for normal stars
    DRAW_COMMANDS+=" fill rgb($BRIGHTNESS,$BRIGHTNESS,$BRIGHTNESS) point $X_POS,$Y_POS"
done

# Extra Bright Stars
for ((i=0; i<BRIGHT_STAR_COUNT; i++)); do
    X_POS=$((RANDOM % IMAGE_WIDTH))
    Y_POS=$((RANDOM % IMAGE_HEIGHT))
    
    # Extra bright stars (255,255,255) or near full white
    BRIGHTNESS=$((RANDOM % 50 + 205))  # Between 205 and 255 for extra brightness
    
    # Slightly larger effect for bright stars
    DRAW_COMMANDS+=" fill rgb($BRIGHTNESS,$BRIGHTNESS,$BRIGHTNESS) circle $X_POS,$Y_POS $((X_POS + 2)),$((Y_POS + 2))"
done

# Apply all stars in one ImageMagick operation
magick "$OUTPUT_FILE" -draw "$DRAW_COMMANDS" "$OUTPUT_FILE"

echo "Starry sky generated: $OUTPUT_FILE"
