#!/bin/bash
# Ensure the script runs in its own directory
cd "$(dirname "$0")"

# Define log file
LOG_FILE="update_cards.log"

# Start logging
echo "========== Update Started: $(date) ==========" | tee -a "$LOG_FILE"

# Step 1: Generate updated cards.json
echo "Running generate_card_list.sh..." | tee -a "$LOG_FILE"
./generate_card_list.sh 2>&1 | tee -a "$LOG_FILE"

# Step 2: Add changes to Git
echo "Staging changes..." | tee -a "$LOG_FILE"
git add -A 2>&1 | tee -a "$LOG_FILE"

# Step 3: Commit changes with timestamp
COMMIT_MESSAGE="Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"
#COMMIT_MESSAGE="Changed to magic-style"
echo "Committing changes: $COMMIT_MESSAGE" | tee -a "$LOG_FILE"
git commit -m "$COMMIT_MESSAGE" 2>&1 | tee -a "$LOG_FILE"

# Step 4: Push changes to GitHub
echo "Pushing to GitHub..." | tee -a "$LOG_FILE"
git push origin main 2>&1 | tee -a "$LOG_FILE"

# Completion message
echo "========== Update Completed: $(date) ==========" | tee -a "$LOG_FILE"
echo "Update process finished. Check $LOG_FILE for details."

