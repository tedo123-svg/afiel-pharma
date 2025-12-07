terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "medrx-vpc"
    Environment = var.environment
    Compliance  = "HIPAA"
  }
}

# Private Subnets (for application servers)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "medrx-private-${count.index + 1}"
    Type = "Private"
  }
}

# RDS PostgreSQL (HIPAA-compliant)
resource "aws_db_instance" "main" {
  identifier             = "medrx-db"
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = "db.t3.medium"
  allocated_storage      = 100
  storage_encrypted      = true
  kms_key_id            = aws_kms_key.main.arn
  
  db_name  = "medplatform"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 35  # HIPAA requires 6 years, but RDS max is 35 days
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "medrx-final-snapshot"

  tags = {
    Name       = "medrx-database"
    Compliance = "HIPAA"
  }
}

# KMS Key for Encryption
resource "aws_kms_key" "main" {
  description             = "MedRx encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name       = "medrx-kms-key"
    Compliance = "HIPAA"
  }
}

# S3 Bucket for Prescriptions (Encrypted)
resource "aws_s3_bucket" "prescriptions" {
  bucket = "medrx-prescriptions-${var.environment}"

  tags = {
    Name       = "medrx-prescriptions"
    Compliance = "HIPAA"
  }
}

resource "aws_s3_bucket_encryption" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.main.arn
    }
  }
}

resource "aws_s3_bucket_versioning" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudWatch Log Group for Audit Logs
resource "aws_cloudwatch_log_group" "audit" {
  name              = "/medrx/audit-logs"
  retention_in_days = 2555  # 7 years for HIPAA compliance

  tags = {
    Name       = "medrx-audit-logs"
    Compliance = "HIPAA"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "medrx-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  tags = {
    Name = "medrx-rds-sg"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_db_subnet_group" "main" {
  name       = "medrx-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "medrx-db-subnet-group"
  }
}

# Variables
variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  default = "production"
}

variable "db_username" {
  sensitive = true
}

variable "db_password" {
  sensitive = true
}
