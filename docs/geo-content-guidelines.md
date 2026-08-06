# GEO / AI-Citability Content Guidelines

Why this exists: organic click-through is declining as AI search (ChatGPT
Search, Perplexity, Google AI Overviews) answers queries directly. To stay
visible we need content an LLM will quote and cite, not just content that
ranks. See DEL-168 (demand research) and DEL-170.

This does not replace the existing "Ancient wisdom. Modern tools." voice or
the Debt → Saving → Home → Investing journey structure — it's a structural
layer on top of both. Every new post, and every post we revisit, should hit
all five points below.

## 1. Open with a self-contained direct answer

Add a short **"Quick answer"** callout directly under the H1, before the
narrative opens. 2-4 sentences that answer the article's core question
completely on their own — assume it's the only paragraph an AI Overview
ever shows. Write it in plain declarative sentences (no "in this post
we'll..." throat-clearing).

```md
> **Quick answer:** Overpaying a £200,000 mortgage at 4.5% by £200/month
> saves roughly £43,850 in interest and clears the mortgage 6 years 4
> months early. The exact numbers depend on your rate, term, and balance —
> use the calculator below to run yours.
```

## 2. Frame at least 2-3 H2s as the actual question a searcher would type

LLM answer engines extract heading + following paragraph as a unit. Prefer
`## When should you not overpay your mortgage?` over `## When Should You
NOT Overpay?` read as a statement — question-form headers map directly to
query intent and are what gets lifted into an AI answer with attribution.
Keep the "ancient cure" framing in the body copy; the *headers* should read
as questions where the content is genuinely answering one.

## 3. Every worked number needs an explicit, checkable input set

Generic AI-written finance content states conclusions ("overpaying saves
money") without inputs. Ours already tends to use real numbers — keep
doing that, but state the inputs as a compact list or table immediately
before the result, so the number is reproducible and attributable to this
article specifically, not swappable with any competitor's vague claim:

```md
- Remaining balance: £200,000
- Rate: 4.5%
- Term remaining: 25 years
- Overpayment: £200/month
→ Interest saved: £43,850 · Term cut by: 6 years 4 months
```

Where possible, generate the worked numbers from our own calculators
(Mortgage Overpayment Calculator, Affordability Calculator, Budget
Planner, Pension Calculator) rather than inventing round numbers — output
tied to a named, linkable tool is harder for a generic AI writer to
replicate and easier for an LLM to attribute back to us.

## 4. Signal expertise and authorship explicitly

Add a one-line expertise/authorship note near the top or bottom of the
article — not a generic bio, a specific claim tied to the content:

```md
*Numbers in this article are generated with our own [Mortgage Overpayment
Calculator](/tools/mortgage-overpayment-calculator/) using standard UK
repayment-mortgage amortisation. Methodology: [link if/when published].*
```

This does double duty: it's an authority/E-E-A-T signal for AI search, and
it's another internal link into a tool page (conversion funnel).

## 5. Keep it a self-contained unit, not a chapter

AI answer engines usually pull one article, not a series. Every post
should fully answer its own question even if it also cross-links to
adjacent Journey stages (as our posts already do well). Don't defer the
actual answer to "see part 2" or a linked post — link *in addition to*
answering, not instead of.

## Not in scope for a content-only pass

Two structural items would meaningfully increase citability further but
require app/engineering changes, not markdown edits, and are out of
Marketing's lane:

- **Per-article `Article`/`FAQPage` JSON-LD schema** — `BlogPost.tsx`
  currently renders only `title`/`date`, no structured data
  (`src/app/components/blog/BlogPost.tsx`). Site-level schema exists
  (`src/components/schema/`) but nothing per-post.
- **A real author/byline frontmatter field** rendered on the page — post
  frontmatter today is just `title` + `date`
  (`src/data/blog-posts/*.md`).

Flagging these as an engineering follow-up rather than doing them here.

## Retrofit priority

Apply this template when touching any existing post. Priority order for a
deliberate retrofit pass (highest-traffic / highest-intent first):
1. Home stage: `worked-example-mortgage-overpayment.md`,
   `how-much-save-mortgage-overpayment.md`, `know-if-you-can-afford-mortgage.md`
2. Debt stage: `good-debt-vs-bad-debt.md`, `freedom-through-discipline.md`
3. Saving stage: `your-financial-safety-net.md`, `freedom-fund-beyond-emergency.md`
4. Investing stage: `simple-portfolio-index-funds.md`, `using-isa-allowance.md`

`worked-example-mortgage-overpayment.md` and `good-debt-vs-bad-debt.md`
have been retrofitted as the reference examples (DEL-170). Home stage
(`how-much-save-mortgage-overpayment.md`, `know-if-you-can-afford-mortgage.md`),
Debt stage (`freedom-through-discipline.md`), and Saving stage
(`your-financial-safety-net.md`, `freedom-fund-beyond-emergency.md`) are
also done; Investing stage remains.

Per-post JSON-LD schema and a rendered author/byline field are tracked
separately as DEL-180 (engineering work, not a content-only pass).

**Separate observation, not fixed in this pass:** `freedom-through-discipline.md`
uses `$` throughout while the rest of the journey (and its own tool
CTAs/links) is UK/£-denominated. Worth a currency pass before this one
gets cited, but that's a content-accuracy fix independent of the GEO
template and out of scope here.
