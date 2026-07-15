# Cloudflare Pages project for the static site, replacing the S3/CloudFront
# origin. Requires the GitHub repo to already be authorised for Cloudflare's
# GitHub App in the target account (done once via the Cloudflare dashboard);
# Terraform manages the project config after that.
resource "cloudflare_pages_project" "budget" {
  account_id        = var.cloudflare_account_id
  name              = "helpfulmoney"
  production_branch = "main"

  source {
    type = "github"
    config {
      owner                         = "neilmillard"
      repo_name                     = "tools-budget"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
    }
  }

  build_config {
    build_command   = "npm run build"
    destination_dir = "out"
  }
}

resource "cloudflare_pages_domain" "root" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.budget.name
  domain       = var.domain_name
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.budget.name
  domain       = "www.${var.domain_name}"
}

# DNS cutover (pointing helpfulmoney.site / www at this Pages project instead
# of the existing CloudFront CNAMEs) is deliberately left out of this change
# and will land in a follow-up PR once the Pages project has been verified on
# its *.pages.dev subdomain.
