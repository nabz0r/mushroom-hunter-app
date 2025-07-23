#!/bin/bash

# 📊 Setup Monitoring and Alerts

set -e

echo "📊 Setting up monitoring for Mushroom Hunter..."

# CloudWatch Alarms
echo "Creating CloudWatch alarms..."

# API High Error Rate
aws cloudwatch put-metric-alarm \
    --alarm-name "mushroom-hunter-api-error-rate" \
    --alarm-description "API error rate too high" \
    --metric-name "4XXError" \
    --namespace "AWS/ApiGateway" \
    --statistic "Average" \
    --period 300 \
    --threshold 5 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2

# Database CPU
aws cloudwatch put-metric-alarm \
    --alarm-name "mushroom-hunter-db-cpu" \
    --alarm-description "Database CPU usage high" \
    --metric-name "CPUUtilization" \
    --namespace "AWS/RDS" \
    --statistic "Average" \
    --period 300 \
    --threshold 80 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2

# ECS Service Health
aws cloudwatch put-metric-alarm \
    --alarm-name "mushroom-hunter-ecs-health" \
    --alarm-description "ECS service unhealthy" \
    --metric-name "HealthyHostCount" \
    --namespace "AWS/ApplicationELB" \
    --statistic "Average" \
    --period 60 \
    --threshold 2 \
    --comparison-operator "LessThanThreshold" \
    --evaluation-periods 3

# Custom Metrics
echo "Setting up custom metrics..."

# Create log groups
aws logs create-log-group --log-group-name "/aws/mushroom-hunter/api"
aws logs create-log-group --log-group-name "/aws/mushroom-hunter/errors"
aws logs create-log-group --log-group-name "/aws/mushroom-hunter/performance"

# Create metric filters
aws logs put-metric-filter \
    --log-group-name "/aws/mushroom-hunter/api" \
    --filter-name "MushroomIdentificationTime" \
    --filter-pattern '[timestamp, request_id, latency > 2000, ...]' \
    --metric-transformations \
        metricName=MushroomIdentificationTime,\
        metricNamespace=MushroomHunter,\
        metricValue='$latency'

aws logs put-metric-filter \
    --log-group-name "/aws/mushroom-hunter/api" \
    --filter-name "UserSignups" \
    --filter-pattern '[timestamp, request_id, event_type=USER_SIGNUP, ...]' \
    --metric-transformations \
        metricName=UserSignups,\
        metricNamespace=MushroomHunter,\
        metricValue=1

# Synthetics Canary
echo "Creating synthetic monitoring..."

cat > /tmp/canary.js << 'EOF'
const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const apiCanary = async function () {
    // Test API health
    let response = await synthetics.executeHttpStep(
        'API Health Check',
        'https://api.mushroomhunter.app/health'
    );
    
    // Test mushroom identification
    response = await synthetics.executeHttpStep(
        'Test Identification',
        'https://api.mushroomhunter.app/mushrooms/identify',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({
                image: 'base64-test-image',
                location: { latitude: 48.8566, longitude: 2.3522 }
            })
        }
    );
};

exports.handler = async () => {
    return await synthetics.runCanary(apiCanary);
};
EOF

zip /tmp/canary.zip /tmp/canary.js

aws synthetics create-canary \
    --name "mushroom-hunter-api-canary" \
    --artifact-s3-location "s3://mushroom-hunter-canaries/" \
    --execution-role-arn "arn:aws:iam::123456789012:role/CloudWatchSyntheticsRole" \
    --runtime-version "syn-nodejs-puppeteer-3.5" \
    --schedule-expression "rate(5 minutes)" \
    --code-zip-file "fileb:///tmp/canary.zip"

# Dashboard
echo "Creating CloudWatch dashboard..."

aws cloudwatch put-dashboard \
    --dashboard-name "MushroomHunterProduction" \
    --dashboard-body file://monitoring/dashboard.json

echo "✅ Monitoring setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure SNS topic for alarm notifications"
echo "2. Set up PagerDuty integration"
echo "3. Install Datadog agent on ECS tasks"
echo "4. Configure log retention policies"