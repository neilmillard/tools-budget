# setup

* install opentofu (1.8.8)

```bash
cd terraform
tofu init
tofu plan
tofu apply
```

## Cloudflare Pages migration

`cloudflare.tf` creates a Cloudflare Pages project connected to this GitHub
repo and moves DNS for `helpfulmoney.site` / `www.helpfulmoney.site` from the
existing CloudFront CNAMEs onto it. The AWS S3/CloudFront/Route53 resources
(`s3.tf`, `cloudfront.tf`, `route53.tf`, `acm.tf`) are left in place — they
are not managed as part of this change and should only be torn down once the
Cloudflare cutover has been verified in production.

Requires:

- `cloudflare_account_id`, `cloudflare_zone_id` — non-secret, can go in
  `terraform.tfvars`.
- `cloudflare_api_token` — set via `TF_VAR_cloudflare_api_token`, never
  commit it.
- The Cloudflare GitHub App must already be authorised for this repo/account
  (one-time step done via the Cloudflare dashboard) before `cloudflare_pages_project`
  with a `github` source can be created.

Recommended rollout order:

1. `tofu apply -target=cloudflare_pages_project.budget -target=cloudflare_pages_domain.root -target=cloudflare_pages_domain.www`
   and verify the site on the assigned `*.pages.dev` subdomain.
2. Once verified, `tofu apply` (no targets) to flip `cloudflare_record.root` /
   `cloudflare_record.www` from CloudFront to the Pages project — this is the
   live DNS cutover for real visitors.
3. Manually confirm the Cloudflare Registrar transfer has completed (nameservers
   were already pointed at Cloudflare ahead of this, but the registrar transfer
   itself needs separate verification).
