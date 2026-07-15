variable "domain_name" {
  type        = string
  description = "The domain name for the website."
}

variable "bucket_name" {
  type        = string
  description = "The name of the bucket without the www. prefix. Normally domain_name."
}

variable "common_tags" {
  description = "Common tags you want applied to all components."
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID that owns the Pages project."
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token with Pages edit scope. Supply via TF_VAR_cloudflare_api_token, not tfvars."
  sensitive   = true
}
