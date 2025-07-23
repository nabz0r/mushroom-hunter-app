variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "api_min_capacity" {
  description = "Minimum number of API instances"
  type        = number
  default     = 2
}

variable "api_max_capacity" {
  description = "Maximum number of API instances"
  type        = number
  default     = 10
}