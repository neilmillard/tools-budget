# setup

* install opentofu (1.8.8)

```bash
cd terraform
tofu init
tofu plan
tofu apply
```

## Cloudflare Pages migration

`cloudflare.tf` creates the Cloudflare Pages project connected to this
GitHub repo, plus a `cloudflare_pages_domain` custom domain association for
`www.helpfulmoney.site` only. The apex/root (`helpfulmoney.site`) is
deliberately left out for now — it isn't needed yet. No `cloudflare_record`
resources are created here, so DNS for `www.helpfulmoney.site` keeps
resolving to the existing CloudFront CNAME until that's applied — but
associating the custom domain is itself DNS-affecting on an
already-Cloudflare-hosted zone, so applying this still needs the same care
as a DNS change.

The old AWS S3/CloudFront/ACM resources (`s3.tf`, `cloudfront.tf`,
`acm.tf`) and `route53.tf` (hosted zone, CloudFront alias records, and the
mail-related records — MX, DKIM, site-verification TXT) have since been
removed — the migration to Cloudflare Pages is complete and verified, and
Cloudflare's own nameservers now answer all of those records (confirmed
live via `dig` against Cloudflare's NS before the zone was deleted).

Requires:

- `cloudflare_account_id` — non-secret, can go in `terraform.tfvars`.
- `cloudflare_api_token` — set via `TF_VAR_cloudflare_api_token`, never
  commit it. Needs `Zone > Cache Rules > Edit` and `Zone > Zone > Read` in
  addition to the Pages edit scope, for the `cloudflare_ruleset` /
  `cloudflare_zone` data source below.
- The Cloudflare GitHub App must already be authorised for this repo/account
  (one-time step done via the Cloudflare dashboard) before `cloudflare_pages_project`
  with a `github` source can be created.

Rollout:

1. `tofu apply` to create the Pages project and the `www` custom domain, then
   verify the site on the assigned `*.pages.dev` subdomain and on
   `www.helpfulmoney.site` once the custom domain is validated.
2. Apex/root custom domain and DNS cutover (pointing the `cloudflare_record`
   CNAME records at Pages instead of CloudFront, plus dropping the S3 sync /
   CloudFront invalidation steps from `.github/workflows/build.yml`) are
   handled in a separate follow-up PR once step 1 is verified in production.
3. Manually confirm the Cloudflare Registrar transfer has completed (nameservers
   were already pointed at Cloudflare ahead of this, but the registrar transfer
   itself needs separate verification).

## Edge caching for HTML (DEL-246)

Cloudflare Pages serves HTML documents `cache-control: max-age=0,
must-revalidate` with no edge cache (`cf-cache-status: DYNAMIC`) by
default — every request round-trips to Cloudflare Pages' network rather
than being served from the nearest edge PoP, which showed up as
inconsistent TTFB on specific pages during an Ahrefs crawl.

`cloudflare_ruleset.cache_html` adds a zone-level Cache Rule that caches
any response for a path with no file extension (i.e. every page in this
`trailingSlash: true` static export) at the edge for up to an hour,
overriding the origin's `max-age=0`. Browser caching is left untouched
(`browser_ttl.mode = "respect_origin"`), so repeat visitors still
revalidate as before — only edge-to-edge requests get faster. Cloudflare
Pages automatically purges the zone cache on every new production
deployment, so this doesn't risk serving stale content after a deploy.
