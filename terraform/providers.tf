terraform {
  required_version = "~> 1.8.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.65"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "neilmillard-state"
    key    = "helpfulmoney/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}

# Reads the API token from the CLOUDFLARE_API_TOKEN env var (or
# TF_VAR_cloudflare_api_token) — never commit it to terraform.tfvars.
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}