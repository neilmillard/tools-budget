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

  deployment_configs {
    production {
      kv_namespaces = {
        DOWNLOAD_LOG = cloudflare_workers_kv_namespace.downloads.id
      }
    }
  }
}

# Per-session download record for the paid guide (DEL-585), written by
# functions/api/download.ts. Lets a refund decision check whether a session
# actually downloaded the file, and how many times, via the Cloudflare
# dashboard's KV browser (Workers & Pages > KV > helpfulmoney-downloads).
resource "cloudflare_workers_kv_namespace" "downloads" {
  account_id = var.cloudflare_account_id
  title      = "helpfulmoney-downloads"
}

# Neil created this namespace and bound it to the Pages project by hand via
# the Cloudflare dashboard on 2026-10-10 (no shell access to run `tofu
# apply` for the DEL-585 download-tracking rollout). This import block
# adopts that namespace into state on the next `tofu apply`/`plan`, instead
# of Terraform trying to create a second one alongside it. The production
# `kv_namespaces` binding on cloudflare_pages_project.budget above already
# matches what's live, so no import is needed for that resource — applying
# it will just confirm the existing binding rather than change anything.
import {
  to = cloudflare_workers_kv_namespace.downloads
  id = "8f1b6bf33c4c994d864703b7c5e18594/f13260bae1134092bc00ca4e68a985fd"
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

# Cloudflare Pages serves HTML documents with `cache-control: max-age=0,
# must-revalidate` and no edge cache (cf-cache-status: DYNAMIC) by default —
# every request round-trips to Cloudflare Pages' network instead of being
# served from the nearest edge PoP. DEL-246 flagged inconsistent TTFB on
# specific blog posts; this rule makes the edge cache HTML regardless of the
# origin's max-age=0 (browser behaviour is left untouched, so repeat
# visitors still revalidate as before). Cloudflare Pages automatically
# purges the zone cache on every new production deployment, so this doesn't
# introduce a stale-content risk.
data "cloudflare_zone" "this" {
  name = var.domain_name
}

resource "cloudflare_ruleset" "cache_html" {
  zone_id     = data.cloudflare_zone.this.id
  name        = "Edge-cache static HTML"
  description = "Cache Pages HTML responses at the Cloudflare edge instead of treating them as DYNAMIC on every request."
  kind        = "zone"
  phase       = "http_request_cache_settings"

  rules {
    ref         = "cache_html_pages"
    description = "Cache HTML page responses (paths with no file extension, per next.config.ts trailingSlash export)"
    expression  = "(http.request.uri.path.extension eq \"\")"
    action      = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = 3600
      }
      browser_ttl {
        mode = "respect_origin"
      }
    }
  }
}
