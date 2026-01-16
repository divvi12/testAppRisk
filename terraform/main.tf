# VULNERABLE TERRAFORM CONFIGURATION
# WARNING: Contains intentional security issues for testing

provider "aws" {
  region = "us-east-1"
}

# VULNERABILITY: S3 bucket with public access
resource "aws_s3_bucket" "vulnerable_bucket" {
  bucket = "my-vulnerable-bucket"
  acl    = "public-read"

  versioning {
    enabled = false
  }

  # VULNERABILITY: No encryption
  # VULNERABILITY: No logging enabled
}

# VULNERABILITY: S3 bucket policy allowing public access
resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.vulnerable_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.vulnerable_bucket.arn}/*"
      }
    ]
  })
}

# VULNERABILITY: Security group with open ingress
resource "aws_security_group" "vulnerable_sg" {
  name        = "vulnerable-sg"
  description = "Security group with overly permissive rules"

  # VULNERABILITY: SSH open to the world
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # VULNERABILITY: All ports open to the world
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # VULNERABILITY: All egress allowed
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# VULNERABILITY: RDS without encryption
resource "aws_db_instance" "vulnerable_db" {
  identifier           = "vulnerable-database"
  engine               = "mysql"
  engine_version       = "5.6"
  instance_class       = "db.t2.micro"
  allocated_storage    = 20
  username             = "admin"
  password             = "password123"  # VULNERABILITY: Hardcoded password
  publicly_accessible  = true           # VULNERABILITY: Publicly accessible
  skip_final_snapshot  = true
  storage_encrypted    = false          # VULNERABILITY: No encryption

  # VULNERABILITY: No backup retention
  backup_retention_period = 0
}

# VULNERABILITY: EC2 instance with public IP and no IMDSv2
resource "aws_instance" "vulnerable_instance" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"

  associate_public_ip_address = true

  # VULNERABILITY: No encryption for root volume
  root_block_device {
    encrypted = false
  }

  # VULNERABILITY: User data with secrets
  user_data = <<-EOF
    #!/bin/bash
    export AWS_SECRET_KEY="FAKE_aws_secret_key_for_testing"
    export DB_PASSWORD="FAKE_db_password_for_testing"
  EOF

  tags = {
    Name = "vulnerable-instance"
  }
}

# VULNERABILITY: IAM role with admin access
resource "aws_iam_role" "admin_role" {
  name = "vulnerable-admin-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# VULNERABILITY: Overly permissive IAM policy
resource "aws_iam_role_policy" "admin_policy" {
  name = "admin-policy"
  role = aws_iam_role.admin_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "*"
        Resource = "*"
      }
    ]
  })
}
