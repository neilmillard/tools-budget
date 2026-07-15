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


# Custom domain association (cloudflare_pages_domain) and DNS cutover
# (pointing helpfulmoney.site / www at this Pages project instead of the
# existing CloudFront CNAMEs) are deliberately left out of this change — on
# an already-Cloudflare-hosted zone, associating a custom domain is itself a
# DNS-affecting action. Both will land in a follow-up PR once the Pages
# project has been verified on its *.pages.dev subdomain.
