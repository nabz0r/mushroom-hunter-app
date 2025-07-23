# 🏗️ Terraform Configuration for Mushroom Hunter

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "mushroom-hunter-terraform-state"
    key    = "production/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "mushroom-hunter-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
  enable_dns_hostnames = true
  
  tags = {
    Environment = var.environment
    Project     = "mushroom-hunter"
  }
}

# RDS PostgreSQL with PostGIS
module "rds" {
  source = "terraform-aws-modules/rds/aws"
  
  identifier = "mushroom-hunter-db"
  
  engine               = "postgres"
  engine_version       = "14.7"
  family               = "postgres14"
  major_engine_version = "14"
  instance_class       = var.db_instance_class
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_encrypted     = true
  
  db_name  = "mushroom_hunter"
  username = "mushroom_admin"
  port     = 5432
  
  multi_az               = true
  subnet_ids             = module.vpc.database_subnets
  vpc_security_group_ids = [module.security_group.this_security_group_id]
  
  maintenance_window              = "Mon:00:00-Mon:03:00"
  backup_window                   = "03:00-06:00"
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  backup_retention_period = 30
  skip_final_snapshot     = false
  deletion_protection     = true
  
  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  create_monitoring_role                = true
  monitoring_interval                   = 60
  
  tags = {
    Environment = var.environment
  }
}

# ElastiCache Redis
module "elasticache" {
  source = "terraform-aws-modules/elasticache/aws"
  
  cluster_id           = "mushroom-hunter-cache"
  engine               = "redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = 2
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  subnet_ids = module.vpc.private_subnets
  security_group_ids = [module.security_group.this_security_group_id]
  
  tags = {
    Environment = var.environment
  }
}

# ECS Cluster for API
module "ecs" {
  source = "terraform-aws-modules/ecs/aws"
  
  cluster_name = "mushroom-hunter-cluster"
  
  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/aws/ecs/mushroom-hunter"
      }
    }
  }
  
  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 50
        base   = 20
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
  }
  
  tags = {
    Environment = var.environment
  }
}

# S3 Buckets
resource "aws_s3_bucket" "uploads" {
  bucket = "mushroom-hunter-uploads-${var.environment}"
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront CDN
module "cdn" {
  source = "terraform-aws-modules/cloudfront/aws"
  
  comment             = "Mushroom Hunter CDN"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = false
  
  origin = {
    s3_uploads = {
      domain_name = aws_s3_bucket.uploads.bucket_regional_domain_name
      s3_origin_config = {
        origin_access_identity = "s3_uploads"
      }
    }
  }
  
  default_cache_behavior = {
    target_origin_id       = "s3_uploads"
    viewer_protocol_policy = "redirect-to-https"
    
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = true
  }
  
  tags = {
    Environment = var.environment
  }
}

# Auto Scaling for ECS Services
resource "aws_appautoscaling_target" "api" {
  max_capacity       = var.api_max_capacity
  min_capacity       = var.api_min_capacity
  resource_id        = "service/${module.ecs.cluster_name}/mushroom-hunter-api"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "mushroom-hunter-api-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70
  }
}

# Outputs
output "rds_endpoint" {
  value = module.rds.this_db_instance_endpoint
}

output "redis_endpoint" {
  value = module.elasticache.primary_endpoint_address
}

output "cdn_domain" {
  value = module.cdn.cloudfront_distribution_domain_name
}