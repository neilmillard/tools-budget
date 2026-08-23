# Newsletter — First Issue Template

Use this as the Brevo campaign template for the launch issue, and as the
shape for every issue after: one "ancient cure" framing line, one new
article, one tool nudge, one journey-stage pointer. Keep it short — the
article does the explaining, the email just gets the click.

---

**Subject:** Ancient wisdom. Modern tools. (and your first cure)

**Preview text:** The seven cures for a lean purse, applied to 2026.

---

Hello,

Thanks for subscribing to Helpful Money. Every week you'll get one new
article — grounded in principles that are centuries old, worked through
with modern calculators so the numbers are yours, not generic.

We write across four stages: **Paying Off Debt → Saving → Buying a Home →
Investing**. Most readers are somewhere on that path already — reply and
tell us where, and we'll point you at the most useful next article.

## This week

**[{{ARTICLE_TITLE}}]({{ARTICLE_URL}})**

{{ARTICLE_QUICK_ANSWER}}

[Read the full article →]({{ARTICLE_URL}})

## Try the tool

Most of our articles are backed by a free calculator so you can run your
own numbers instead of trusting someone else's:

- [Budget Planner](https://www.helpfulmoney.site/tools/budget/)
- [Mortgage Overpayment Calculator](https://www.helpfulmoney.site/tools/mortgage-overpayment-calculator/)
- [Pension Calculator](https://www.helpfulmoney.site/tools/pension/)

## Where you are on the journey

- [Paying Off Debt](https://www.helpfulmoney.site/journey/paying-debt/)
- [Saving](https://www.helpfulmoney.site/journey/saving/)
- [Buying a Home](https://www.helpfulmoney.site/journey/buying-a-home/)
- [Investing](https://www.helpfulmoney.site/journey/investing/)

Until next week —
The Helpful Money Team

---

*Notes for whoever fills this in each week (delete before send):*
- *`{{ARTICLE_TITLE}}` / `{{ARTICLE_URL}}` / `{{ARTICLE_QUICK_ANSWER}}` come
  from the post `scripts/send-newsletter.mjs` picks up — the "Quick answer"
  callout at the top of the article (see `docs/geo-content-guidelines.md`)
  is written to drop straight in here.*
- *Once this is confirmed, the campaign body in
  `scripts/send-newsletter.mjs` (`sendCampaign`) should be updated to use
  this template instead of the current placeholder HTML.*
