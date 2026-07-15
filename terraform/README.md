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
as a DNS change. The AWS S3/CloudFront/Route53 resources (`s3.tf`,
`cloudfront.tf`, `route53.tf`, `acm.tf`) are left in place and untouched by
this change.

Requires:

- `cloudflare_account_id` — non-secret, can go in `terraform.tfvars`.
- `cloudflare_api_token` — set via `TF_VAR_cloudflare_api_token`, never
  commit it.
- `next_public_adsense_pub_id`, `next_public_gtm_id`, `next_public_fmp_api_key`
  — set via `TF_VAR_next_public_*`, never commit them. Cloudflare Pages runs
  its own build via the GitHub integration (independent of
  `.github/workflows/build.yml`), so these are wired into the Pages
  project's production `deployment_configs` — the same `NEXT_PUBLIC_*`
  values already stored as GitHub Actions secrets for the `build.yml` job.
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
