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
repo and registers `helpfulmoney.site` / `www.helpfulmoney.site` as custom
domains on it. It does **not** touch live DNS — the existing CloudFront
CNAMEs keep serving production traffic until a follow-up change flips them
over. The AWS S3/CloudFront/Route53 resources (`s3.tf`, `cloudfront.tf`,
`route53.tf`, `acm.tf`) are left in place and untouched by this change.

Requires:

- `cloudflare_account_id`, `cloudflare_zone_id` — non-secret, can go in
  `terraform.tfvars`.
- `cloudflare_api_token` — set via `TF_VAR_cloudflare_api_token`, never
  commit it.
- The Cloudflare GitHub App must already be authorised for this repo/account
  (one-time step done via the Cloudflare dashboard) before `cloudflare_pages_project`
  with a `github` source can be created.

Rollout:

1. `tofu apply` to create the Pages project and its custom domains, then
   verify the site on the assigned `*.pages.dev` subdomain.
2. DNS cutover (pointing the CNAME records at Pages instead of CloudFront,
   and dropping the S3 sync / CloudFront invalidation steps from
   `.github/workflows/build.yml`) is handled in a separate follow-up PR once
   step 1 is verified in production.
3. Manually confirm the Cloudflare Registrar transfer has completed (nameservers
   were already pointed at Cloudflare ahead of this, but the registrar transfer
   itself needs separate verification).
