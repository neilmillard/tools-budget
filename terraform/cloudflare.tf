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

  # Cloudflare's own GitHub integration runs this build independently of
  # .github/workflows/build.yml, so the NEXT_PUBLIC_* vars that workflow
  # injects via SpicyPizza/create-envfile need to be supplied here too, or
  # the Pages build will fail the same way without them.
  deployment_configs {
    production {
      secrets = {
        NEXT_PUBLIC_ADSENSE_PUB_ID = var.next_public_adsense_pub_id
        NEXT_PUBLIC_GTM_ID         = var.next_public_gtm_id
        NEXT_PUBLIC_FMP_API_KEY    = var.next_public_fmp_api_key
      }
    }
  }
}


# www custom domain only — the apex/root (var.domain_name) is left out for
# now since it isn't needed yet. Associating this domain is itself a
# DNS-affecting action on an already-Cloudflare-hosted zone: applying it
# points www.helpfulmoney.site at this Pages project instead of the existing
# CloudFront CNAME.
resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.budget.name
  domain       = "www.${var.domain_name}"
}
