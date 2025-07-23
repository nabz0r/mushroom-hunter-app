#!/bin/bash

# 🏥 Health Check Script for Mushroom Hunter Services

set -e

ENVIRONMENT=${1:-staging}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 Running health checks for $ENVIRONMENT environment..."
echo ""

# API Health Check
echo "🔍 Checking API..."
API_URL="https://api${ENVIRONMENT == 'staging' ? '-staging' : ''}.mushroomhunter.app"
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)

if [ $API_RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✅ API is healthy${NC}"
    
    # Check response time
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" $API_URL/health)
    echo "   Response time: ${RESPONSE_TIME}s"
else
    echo -e "${RED}❌ API is unhealthy (HTTP $API_RESPONSE)${NC}"
    exit 1
fi

# Database Health Check
echo ""
echo "🔍 Checking Database..."
DB_CHECK=$(curl -s $API_URL/health/db | jq -r '.status')

if [ "$DB_CHECK" = "ok" ]; then
    echo -e "${GREEN}✅ Database is healthy${NC}"
    
    # Check connection count
    CONNECTIONS=$(curl -s $API_URL/health/db | jq -r '.connections')
    echo "   Active connections: $CONNECTIONS"
else
    echo -e "${RED}❌ Database is unhealthy${NC}"
    exit 1
fi

# Redis Health Check
echo ""
echo "🔍 Checking Redis..."
REDIS_CHECK=$(curl -s $API_URL/health/redis | jq -r '.status')

if [ "$REDIS_CHECK" = "ok" ]; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
    
    # Check memory usage
    MEMORY=$(curl -s $API_URL/health/redis | jq -r '.memory_usage')
    echo "   Memory usage: $MEMORY"
else
    echo -e "${RED}❌ Redis is unhealthy${NC}"
    exit 1
fi

# AI Service Health Check
echo ""
echo "🔍 Checking AI Service..."
AI_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health/ai)

if [ $AI_RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✅ AI Service is healthy${NC}"
    
    # Test inference
    echo "   Testing inference..."
    INFERENCE_TIME=$(curl -s $API_URL/health/ai/inference | jq -r '.inference_time_ms')
    echo "   Inference time: ${INFERENCE_TIME}ms"
else
    echo -e "${YELLOW}⚠️  AI Service is degraded${NC}"
fi

# S3/CDN Health Check
echo ""
echo "🔍 Checking CDN..."
CDN_URL="https://cdn${ENVIRONMENT == 'staging' ? '-staging' : ''}.mushroomhunter.app"
CDN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $CDN_URL/health.txt)

if [ $CDN_RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✅ CDN is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  CDN is degraded${NC}"
fi

# Mobile App Status
echo ""
echo "🔍 Checking Mobile App Status..."
APP_STATUS=$(curl -s $API_URL/status/mobile | jq -r '.ios.status')

if [ "$APP_STATUS" = "operational" ]; then
    echo -e "${GREEN}✅ Mobile apps are operational${NC}"
    
    # Check versions
    IOS_VERSION=$(curl -s $API_URL/status/mobile | jq -r '.ios.latest_version')
    ANDROID_VERSION=$(curl -s $API_URL/status/mobile | jq -r '.android.latest_version')
    echo "   iOS: v$IOS_VERSION"
    echo "   Android: v$ANDROID_VERSION"
else
    echo -e "${YELLOW}⚠️  Mobile apps have issues${NC}"
fi

# Overall Status
echo ""
echo "=============================="
if [ $API_RESPONSE -eq 200 ] && [ "$DB_CHECK" = "ok" ] && [ "$REDIS_CHECK" = "ok" ]; then
    echo -e "${GREEN}✅ All critical services are healthy!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some services are unhealthy!${NC}"
    exit 1
fi