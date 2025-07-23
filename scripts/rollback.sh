#!/bin/bash

# 🔄 Rollback Script for Mushroom Hunter

set -e

# Check arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 v1.2.3"
    exit 1
fi

VERSION=$1
ENVIRONMENT=${2:-production}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔄 ROLLBACK TO VERSION $VERSION${NC}"
echo "Environment: $ENVIRONMENT"
echo ""

# Confirmation
read -p "Are you sure you want to rollback to $VERSION? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Rollback cancelled."
    exit 0
fi

# Create rollback log
LOG_FILE="/var/log/rollback_$(date +%Y%m%d_%H%M%S).log"
echo "📝 Logging to: $LOG_FILE"

# Function to log
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "Starting rollback to version $VERSION"

# Step 1: Update API
log "Rolling back API..."
if [ "$ENVIRONMENT" = "production" ]; then
    # Update ECS task definition
    aws ecs update-service \
        --cluster mushroom-hunter-cluster \
        --service mushroom-hunter-api \
        --task-definition mushroom-hunter-api:$VERSION \
        --force-new-deployment
    
    # Wait for stability
    log "Waiting for API deployment..."
    aws ecs wait services-stable \
        --cluster mushroom-hunter-cluster \
        --services mushroom-hunter-api
else
    # For staging, use kubectl
    kubectl set image deployment/mushroom-hunter-api \
        api=mushroom-hunter/api:$VERSION \
        -n $ENVIRONMENT
    
    kubectl rollout status deployment/mushroom-hunter-api -n $ENVIRONMENT
fi

log "✅ API rolled back successfully"

# Step 2: Verify Health
log "Verifying service health..."
./scripts/health-check.sh $ENVIRONMENT

if [ $? -eq 0 ]; then
    log "✅ Health check passed"
else
    log "❌ Health check failed!"
    echo -e "${RED}Rollback may have issues. Please investigate immediately!${NC}"
fi

# Step 3: Clear Caches
log "Clearing caches..."
if [ "$ENVIRONMENT" = "production" ]; then
    # Clear Redis
    redis-cli -h mushroom-hunter-cache.abc123.cache.amazonaws.com FLUSHDB
    
    # Invalidate CloudFront
    aws cloudfront create-invalidation \
        --distribution-id E1234567890ABC \
        --paths "/*"
fi

log "✅ Caches cleared"

# Step 4: Update Mobile Apps (if needed)
if [[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.0$ ]]; then
    log "Major version change detected. Mobile app update may be required."
    echo -e "${YELLOW}⚠️  Don't forget to update mobile app versions if needed${NC}"
fi

# Step 5: Notify Team
log "Notifying team..."

# Slack notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🔄 Rollback completed\\nEnvironment: $ENVIRONMENT\\nVersion: $VERSION\\nInitiated by: $(whoami)\"}" \
        $SLACK_WEBHOOK_URL
fi

# Update status page
curl -X POST https://api.statuspage.io/v1/incidents \
    -H "Authorization: OAuth $STATUSPAGE_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "incident": {
            "name": "Service rolled back to '"$VERSION"'",
            "status": "resolved",
            "impact": "minor",
            "body": "Service has been rolled back to a previous stable version."
        }
    }'

log "✅ Team notified"

# Summary
echo ""
echo "=============================="
echo -e "${GREEN}✅ Rollback completed successfully!${NC}"
echo "Version: $VERSION"
echo "Log file: $LOG_FILE"
echo ""
echo "Next steps:"
echo "1. Monitor error rates and performance"
echo "2. Investigate the issue that caused the rollback"
echo "3. Prepare a fix for the next deployment"