#!/bin/bash

# 📸 Backup User Uploads to Glacier

set -e

S3_BUCKET="mushroom-hunter-uploads"
GLACIER_VAULT="mushroom-hunter-archive"
LOG_FILE="/var/log/backup-uploads-$(date +%Y%m%d).log"

echo "📸 Starting uploads backup to Glacier..."

# Function to log
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "Backup started"

# Get files older than 90 days
OLD_FILES=$(aws s3api list-objects-v2 \
    --bucket $S3_BUCKET \
    --query "Contents[?LastModified<'$(date -d '90 days ago' --iso-8601)'].Key" \
    --output text)

if [ -z "$OLD_FILES" ]; then
    log "No files older than 90 days to archive"
    exit 0
fi

# Count files
FILE_COUNT=$(echo "$OLD_FILES" | wc -w)
log "Found $FILE_COUNT files to archive"

# Create archive
ARCHIVE_NAME="mushroom-uploads-$(date +%Y%m%d-%H%M%S).tar"
TEMP_DIR="/tmp/mushroom-backup-$$"
mkdir -p $TEMP_DIR

log "Downloading files to temporary directory..."

# Download files
for FILE in $OLD_FILES; do
    aws s3 cp "s3://$S3_BUCKET/$FILE" "$TEMP_DIR/$FILE" --quiet
done

# Create tar archive
log "Creating archive..."
tar -cf "$TEMP_DIR/$ARCHIVE_NAME" -C $TEMP_DIR .

# Calculate size
ARCHIVE_SIZE=$(du -h "$TEMP_DIR/$ARCHIVE_NAME" | cut -f1)
log "Archive size: $ARCHIVE_SIZE"

# Upload to Glacier
log "Uploading to Glacier..."
ARCHIVE_ID=$(aws glacier upload-archive \
    --vault-name $GLACIER_VAULT \
    --body "$TEMP_DIR/$ARCHIVE_NAME" \
    --archive-description "Mushroom uploads backup $(date +%Y-%m-%d)" \
    --query 'archiveId' \
    --output text)

log "Archive uploaded with ID: $ARCHIVE_ID"

# Store archive metadata
aws dynamodb put-item \
    --table-name mushroom-backup-metadata \
    --item "{
        \"archive_id\": {\"S\": \"$ARCHIVE_ID\"},
        \"created_at\": {\"S\": \"$(date --iso-8601)\"},
        \"file_count\": {\"N\": \"$FILE_COUNT\"},
        \"size\": {\"S\": \"$ARCHIVE_SIZE\"},
        \"files\": {\"S\": \"$OLD_FILES\"}
    }"

# Transition S3 files to Glacier storage class
log "Transitioning S3 files to Glacier storage class..."
for FILE in $OLD_FILES; do
    aws s3 cp "s3://$S3_BUCKET/$FILE" "s3://$S3_BUCKET/$FILE" \
        --storage-class GLACIER \
        --metadata-directive COPY \
        --quiet
done

# Clean up
rm -rf $TEMP_DIR

log "✅ Backup completed successfully"
log "Archive ID: $ARCHIVE_ID"
log "Files archived: $FILE_COUNT"

# Send notification
if [ -n "$SNS_TOPIC_ARN" ]; then
    aws sns publish \
        --topic-arn $SNS_TOPIC_ARN \
        --subject "Mushroom Hunter Backup Completed" \
        --message "Backup completed successfully.
Archive ID: $ARCHIVE_ID
Files: $FILE_COUNT
Size: $ARCHIVE_SIZE"
fi