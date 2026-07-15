# setup

* install opentofu (1.8.8)

```bash
cd terraform
tofu init
tofu plan
tofu apply
```

## Cloudflare Pages migration

`cloudflare.tf` creates only the Cloudflare Pages project connected to this
GitHub repo. It does **not** touch DNS or custom domains — no
`cloudflare_pages_domain` or `cloudflare_record` resources are created here,
so `helpfulmoney.site` / `www.helpfulmoney.site` keep resolving to the
existing CloudFront CNAMEs, untouched. The AWS S3/CloudFront/Route53
resources (`s3.tf`, `cloudfront.tf`, `route53.tf`, `acm.tf`) are also left in
place and untouched by this change.

Requires:

- `cloudflare_account_id` — non-secret, can go in `terraform.tfvars`.
- `cloudflare_api_token` — set via `TF_VAR_cloudflare_api_token`, never
  commit it.
- The Cloudflare GitHub App must already be authorised for this repo/account
  (one-time step done via the Cloudflare dashboard) before `cloudflare_pages_project`
  with a `github` source can be created.

Rollout:

1. `tofu apply` to create the Pages project, then verify the site on the
   assigned `*.pages.dev` subdomain.
2. Custom domain association (`cloudflare_pages_domain`) and DNS cutover
   (pointing the CNAME records at Pages instead of CloudFront, plus dropping
   the S3 sync / CloudFront invalidation steps from
   `.github/workflows/build.yml`) are handled in a separate follow-up PR once
   step 1 is verified in production — on an already-Cloudflare-hosted zone,
   associating a custom domain is itself a DNS-affecting action, so it's kept
   out of this PR.
3. Manually confirm the Cloudflare Registrar transfer has completed (nameservers
   were already pointed at Cloudflare ahead of this, but the registrar transfer
   itself needs separate verification).
