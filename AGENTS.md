# Agent Guide

This repository contains the source code for the "Helpful Money" website. This guide provides pointers to the main documentation and data structures for AI agents.

## Key Documentation
- [README.md](README.md): Main project overview, setup, and development instructions.
- [docs/article-publish-dates.md](docs/article-publish-dates.md): **Crucial Reference.** Contains the mapping of blog article titles to their intended publish dates. This is the source of truth for article scheduling.

## Content and Data
- [src/data/blog-posts/](src/data/blog-posts/): Contains the Markdown files for all blog articles. Each file corresponds to a post.
- [docs/content-plan.md](docs/content-plan.md): Future content roadmap and article ideas.

## Infrastructure
- [terraform/](terraform/): Infrastructure as Code using Terraform for AWS deployment. See the [README.md](terraform/README.md) within that directory for details.

## Blog share images
- Every post needs a share image (og:image) at `public/images/blog/<id>.png`. After adding a post, run `node scripts/generate-blog-og-images.mjs`. A test fails if a post has no image.
- Illustrations (jar, envelopes, house, chart, fees, coins, scales) are drawn in `scripts/blog-image-themes.mjs` and picked from the post id. Override one with `image: <motif>` in the frontmatter.

## Images ship in two PRs (rule from Neil, DEL-656)
- If a change adds images, use **two PRs**: first a PR that only uploads the image files, then, once that is merged and deployed, a second PR that adds the references (`og:image` metadata, `<img>`/markdown links).
- This keeps the link checker green: it resolves absolute image URLs against the live site, so references to images that aren't deployed yet fail.
