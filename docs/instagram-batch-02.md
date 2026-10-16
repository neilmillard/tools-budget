# Instagram batch 02 — Nan Pearl, weeks 5–8

For `nanpearluk`. It follows batch 01 (weeks 1–4, ending Fri 2026-11-06) and runs
**Mon 2026-11-09 to Fri 2026-12-04**: 11 slideshow Reels (R13–R23), 5 carousels
(C6–C10) and a posting calendar.

Asked for by Neil on DEL-644 (2026-10-16), after he shared a LinkedIn post on
"boring millionaire habits". The habits that are budgeting method (spend less
than you earn, don't upgrade your life with every pay rise, don't try to look
rich, buy second-hand, check where you stand, keep a buffer) are the spine of
weeks 5–6. The rest of that list (assets, "good debt", tax write-offs,
investing, multiple income streams) is investment and tax advice, so it's
**out of scope for Nan** and doesn't appear here. Weeks 6–8 lean seasonal:
Christmas planning and Black Friday (Fri 2026-11-27).

Same rules as batch 01, unchanged:
- Nan gives rules and explanations, never "this worked for me" or a
  before/after number. No fictional testimonials, and no fictional biography
  used as proof.
- No personalised advice, and no named bank, product or investment
  recommendations. No income claims.
- `#ad` opens the caption and the first on-screen text of every post that
  pushes the £7 guide. No two guide posts on consecutive days.
- Instagram's AI label (`is_ai_generated=true` on Reels) on every post.
- At least 3 in 4 posts are free. **This batch: 13 of 16 free (81%), 3 guide posts.**
- UK English, plain and warm, kitchen table rather than luxury.
- No links in captions. CTAs say "link in bio".

**Production notes (what's different from batch 01):**
- **No new image generation.** Higgsfield lapsed on 2026-10-14, so every frame
  reuses the batch-01 stills P0 and B1–B6, with text burned in at build time.
  The two seasonal frames (Christmas tin, shop window) also reuse B2 and B6;
  nothing needs a new character image.
- **Voiceover is optional and unconfirmed.** Nan's voice (Vera, then the
  agreed slow-down) was generated on Higgsfield. Without it, every Reel builds
  as **text-only with music**, the R8 style. The VO lines are still written
  below in case Neil re-subscribes, which is his decision. If VO is used,
  build it **highlights-only** (static text on frame 1, word highlights after,
  per DEL-633 `d7607cbd`).
- **Publishing** is the same as weeks 1–4: `nan-build/publish/ig.py` against a
  per-week runbook (`PUBLISH-WEEK5.md` …), and each week needs Neil's approval
  of the dates before anything is published.

---

## 1. The 11 slideshow Reels

### Week 5 — "boring is the point" (all free)

**R13 — "Boring is the point"**
- Hook: "The people who are good with money are usually a bit boring with it."
- Frames:
  1. B4, text: "People who are good with money are usually a bit boring with it."
  2. B2, text: "No big moves. No secret trick."
  3. B3, text: "Just the same small habits, every month, without fail."
  4. B6, text: "This month: one boring habit a week. Free 30-day challenge, link in bio."
- VO (optional, <30s): "People who are good with money are usually a bit boring with it. No big moves, no secret trick, just the same small habits every month. This month I'm sharing one boring habit a week. The free challenge is in my bio."
- Caption: "Being good with money is mostly boring: the same small habits, every month, without drama. One boring habit a week this month, starting now. Free 30-day challenge in bio."
- Hashtags: #budgetingtips #moneyhabits #zerobasedbudgeting
- CTA: free challenge. No `#ad`.

**R14 — "The pay rise has a job"**
- Hook: "Got a pay rise? Give it a job before your lifestyle does."
- Frames:
  1. B1, text: "Got a pay rise? Give it a job before your lifestyle does."
  2. B3, text: "Extra money with no job turns into a nicer everything, and then it's gone."
  3. B2, text: "Decide first: some to savings, some to a tin, some to enjoy."
  4. B6, text: "Enjoying some is fine. Deciding is the habit."
- VO (optional, <30s): "Got a pay rise? Give it a job before your lifestyle does. Extra money with no job just turns into a nicer everything, and then it's gone. Decide first: some to savings, some to a tin, some to enjoy. Enjoying some is fine. Deciding is the habit."
- Caption: "A pay rise with no plan quietly becomes a bigger life that costs exactly the same as your new pay. Give the extra a job the month it arrives, and keep some for enjoying. Free worksheet in bio."
- Hashtags: #lifestylecreep #budgetingtips #moneyhabits
- CTA: free worksheet. No `#ad`.

**R15 — Nan's rules, series #3: "Don't budget to look comfortable"**
- Hook: "Nan's rule: looking comfortable and being comfortable cost very different amounts."
- Frames:
  1. B4, text: "Nan's rule: looking comfortable costs more than being comfortable."
  2. B2, text: "Nobody sees your savings tin."
  3. B3, text: "So it's the first one to get raided for things people do see."
  4. B6, text: "Fill the tin nobody sees first."
- VO: skip (text-led one-liner format, like R5/R8).
- Caption: "Nan's rule: looking comfortable and being comfortable cost very different amounts. The savings tin is the one nobody sees, so it's the one that gets raided. Fill it first. Free worksheet in bio."
- Hashtags: #moneyrules #budgetingtips
- CTA: free worksheet. No `#ad`.

### Week 6 — Christmas planning starts (one guide CTA, Friday)

**R16 — "Christmas is on the 25th every year"**
- Hook: "Christmas is on the 25th every year. Budget for it like you know that."
- Frames:
  1. B6, text: "Christmas is on the 25th every year."
  2. B2, text: "So it's not a surprise. It's a tin you start filling now."
  3. B3, text: "Decide the total, divide by the weeks left, put that in each week."
  4. B4, text: "About five weeks left? A fifth of it each week. Free challenge, link in bio."
- VO (optional, <30s): "Christmas is on the twenty-fifth every year, so it isn't a surprise. It's a tin you start filling now. Decide the total, divide it by the weeks you've got left, and put that much in each week."
- Caption: "Christmas isn't a surprise expense, it's a dated one. Decide your total now, divide it by the weeks left, and fill a Christmas tin weekly instead of finding it all in December. Free challenge in bio."
- Hashtags: #christmasbudget #budgetingtips #moneysavingtips
- CTA: free challenge. No `#ad`.

**R17 — "When the tin's empty, Christmas shopping is done"**
- Hook: "The Christmas tin has one rule: when it's empty, you're finished."
- Frames:
  1. B2, text: "The Christmas tin has one rule."
  2. B2 (lid off), text: "When it's empty, the shopping's finished."
  3. B3, text: "Not 'just one more thing' on the card."
  4. B4, text: "January-you will be very grateful."
- VO: skip (text-led).
- Caption: "A Christmas budget only works if it has an end. When the tin is empty, the shopping is finished, not moved onto a card for January to pay. Free worksheet in bio has a tin ready for it."
- Hashtags: #christmasbudget #moneyrules
- CTA: free worksheet. No `#ad`.

**R18 — "Plan December before it plans you"** (guide CTA)
- Hook: "#ad — December spends money whether you plan it or not."
- Frames:
  1. B6, text: "#ad — December spends money whether you plan it or not."
  2. B3, text: "Every pound with a job, gifts and food and travel included."
  3. B2, text: "The full method, step by step, with a worked example."
  4. B1, text: "The Helpful Money guide — £7, one-off. Link in bio."
- VO (optional, <30s): "December spends money whether you plan it or not. The Helpful Money guide walks you through giving every pound a job, with a worked example. It's seven pounds, one-off. Link in my bio. Hashtag ad."
- Caption: "#ad December spends money whether you plan it or not. The 'Give Every Pound a Job' guide from Helpful Money has the full six-step method and a worked example, so you can plan the month before it starts. £7, one-off, link in bio."
- Hashtags: #zerobasedbudgeting #budgetingguide #christmasbudget
- CTA: £7 guide. **Starts with `#ad`.**

### Week 7 — Black Friday week (one guide CTA, Thursday)

**R19 — "A discount isn't a saving"** (Mon, the week of Black Friday)
- Hook: "Money off something you weren't going to buy isn't a saving."
- Frames:
  1. B1, text: "Money off something you weren't going to buy isn't a saving."
  2. B3, text: "It's spending, with a nicer label."
  3. B2, text: "A sale is only useful for things already in a tin."
  4. B6, text: "Write the list before the sales, not during them."
- VO (optional, <30s): "Money off something you weren't going to buy isn't a saving. It's spending with a nicer label. A sale's only useful for things already in a tin, so write your list before the sales, not during them."
- Caption: "Black Friday week. The only sale that saves you money is one on something that already had a job in your budget. Write the list first. Free worksheet in bio."
- Hashtags: #blackfriday #moneysavingtips #budgetingtips
- CTA: free worksheet. No `#ad`.

**R20 — "One evening, one plan"** (guide CTA)
- Hook: "#ad — One evening at the kitchen table, and the whole month has a plan."
- Frames:
  1. B1, text: "#ad — One evening, and the whole month has a plan."
  2. B3, text: "List the costs. Make the tins. Give every pound a job."
  3. B4, text: "The guide walks through it in about ten minutes of reading."
  4. B6, text: "Helpful Money guide — £7, one-off. Link in bio."
- VO (optional, <30s): "One evening at the kitchen table, and the whole month has a plan. List the costs, make the tins, give every pound a job. The Helpful Money guide walks you through it. Seven pounds, one-off, link in bio. Hashtag ad."
- Caption: "#ad One evening, one plan for the whole month. The 'Give Every Pound a Job' guide is about a ten-minute read, with the six steps and a worked example. £7, one-off, link in bio."
- Hashtags: #zerobasedbudgeting #budgetingguide
- CTA: £7 guide. **Starts with `#ad`.** (Thu, so it's not next to Friday's post, which is free.)

**R21 — Nan's rules, series #4: "The rainy-day tin"** (Fri, Black Friday itself, free)
- Hook: "Nan's rule: the rainy-day tin isn't for rain you can see coming."
- Frames:
  1. B4, text: "Nan's rule: the rainy-day tin isn't for rain you can see coming."
  2. B5, text: "Christmas, the car, birthdays: those get their own tins."
  3. B2, text: "The rainy-day tin is for the boiler, not the sales."
  4. B6, text: "Leave it alone today."
- VO: skip (text-led).
- Caption: "Nan's rule: the rainy-day tin is for things you can't see coming, like the boiler, not things you can, like Christmas or a sale. Anything you can see coming gets its own tin. Free worksheet in bio."
- Hashtags: #emergencyfund #moneyrules
- CTA: free worksheet. No `#ad`.

### Week 8 — check where you stand, and close the batch (one guide CTA, Friday)

**R22 — "Twice a year, write it all down"**
- Hook: "Twice a year, write down everything you have and everything you owe."
- Frames:
  1. B6, text: "Twice a year: write down what you have, and what you owe."
  2. B3, text: "Savings, the buffer, what's owed on cards and loans."
  3. B1, text: "One number. Is it going the right way?"
  4. B4, text: "Not to judge it. Just to know it."
- VO (optional, <30s): "Twice a year, write down everything you have and everything you owe. One number. Is it going the right way? Not to judge it, just to know it."
- Caption: "A six-monthly check: write down what you have and what you owe, and see which way the number is moving. It's not a score, it's a direction. Free challenge in bio."
- Hashtags: #moneyhabits #budgetingtips
- CTA: free challenge. No `#ad`.

**R23 — "Start January in December"** (guide CTA, closes the batch)
- Hook: "#ad — The best time to plan January is the first week of December."
- Frames:
  1. B1, text: "#ad — Plan January in the first week of December."
  2. B6, text: "Before the spending, before the January bills land."
  3. B3, text: "The full six steps and a worked example are in the guide."
  4. B2, text: "Helpful Money guide — £7, one-off. Link in bio."
- VO (optional, <30s): "The best time to plan January is the first week of December, before the spending and before the bills land. The full six steps and a worked example are in the Helpful Money guide. Seven pounds, one-off, link in bio. Hashtag ad."
- Caption: "#ad Plan January now, before December spends it. The 'Give Every Pound a Job' guide has the six steps and a worked example. £7, one-off, link in bio."
- Hashtags: #zerobasedbudgeting #budgetingguide
- CTA: £7 guide. **Starts with `#ad`.**

---

## 2. The 5 carousels

**C6 (week 5, free) — "6 boring money habits, the old-fashioned way"**
- Slide 1 (cover, B4): "6 boring money habits, the old-fashioned way."
- Slide 2 (B3): "1. Never spend more than comes in. Every pound gets a job first."
- Slide 3 (B1): "2. A pay rise gets a job before your lifestyle gets it."
- Slide 4 (B2): "3. Don't spend to look comfortable. Fill the tin nobody sees."
- Slide 5 (B5): "4. Buy second-hand where it's sensible. Cars lose value fastest new."
- Slide 6 (B6): "5. Check where you stand twice a year. 6. Keep a rainy-day tin, and leave it alone."
- Slide 7 (B4): "Which one's hardest for you? Tell me below. Free worksheet in bio."
- Caption: "Six habits, none of them exciting, all of them working quietly in the background. Which one's hardest for you? Free worksheet in bio to start with number one."
- Hashtags: #moneyhabits #budgetingtips #zerobasedbudgeting
- CTA: free worksheet. No `#ad`. Ends on a question, to test whether comments rise against C1–C5.

**C7 (week 6, free) — "A Christmas budget in 5 slides"**
- Slide 1 (cover, B6): "A Christmas budget in 5 slides."
- Slide 2 (B3): "1. List everyone and everything: gifts, food, travel, the extra electricity."
- Slide 3 (B2): "2. Set one total you can afford, not one per person first."
- Slide 4 (B3): "3. Divide it by the weeks left, and fill a Christmas tin weekly."
- Slide 5 (B4): "4. Split the total across the list. 5. When the tin's empty, you're done."
- Slide 6 (B6): "Free worksheet has a tin ready for it — link in bio."
- Caption: "Christmas, planned in five steps: list it, set one total, divide by the weeks left, split it, and stop when the tin's empty. Free worksheet in bio."
- Hashtags: #christmasbudget #budgetingtips
- CTA: free worksheet. No `#ad`.

**C8 (week 7, free) — "The 48-hour rule"**
- Slide 1 (cover, B4): "The 48-hour rule for anything you didn't plan to buy."
- Slide 2 (B3): "1. See it, want it, write it down. Don't buy it yet."
- Slide 3 (B6): "2. Wait 48 hours."
- Slide 4 (B2): "3. Still want it? Which tin is it coming out of?"
- Slide 5 (B1): "4. No tin, no purchase. It goes on next month's plan instead."
- Slide 6 (B5): "Most things don't survive the wait. Free challenge in bio."
- Caption: "Black Friday week's best tool is a pen: write it down, wait 48 hours, then find the tin it comes from. No tin, no purchase. Free challenge in bio."
- Hashtags: #blackfriday #moneysavingtips #moneyrules
- CTA: free challenge. No `#ad`.

**C9 (week 8, free) — "Your month-end review in 5 questions"**
- Slide 1 (cover, B6): "Your month-end review, in 5 questions."
- Slide 2 (B3): "1. Which tins ran over, and why?"
- Slide 3 (B2): "2. Which tins had money left? Roll it on, or move it?"
- Slide 4 (B3): "3. Was there a cost that wasn't in the plan? Give it a tin."
- Slide 5 (B4): "4. Did every pound have a job? 5. What's different next month?"
- Slide 6 (B1): "Twenty minutes, once a month. Free worksheet in bio."
- Caption: "Twenty minutes at the end of the month, five questions, and next month's budget gets better every time. Free worksheet in bio."
- Hashtags: #budgetingtips #zerobasedbudgeting
- CTA: free worksheet. No `#ad`.

**C10 (week 8, free) — "Buy it once, buy it used"**
- Slide 1 (cover, B5): "Buy it once. Buy it used where it's sensible."
- Slide 2 (B2): "New things lose value fastest in their first years."
- Slide 3 (B3): "Cars, furniture, children's things: second-hand is often the better buy."
- Slide 4 (B4): "Where it matters (safety, things you'll use daily), buy well, once."
- Slide 5 (B6): "Either way, it comes out of a tin you planned. Free challenge in bio."
- Caption: "Not everything needs to be new, and not everything should be cheap. Buy second-hand where it's sensible, buy well once where it matters, and plan it either way. Free challenge in bio."
- Hashtags: #moneysavingtips #frugalliving #budgetingtips
- CTA: free challenge. No `#ad`. (General guidance only; no shops, brands or sites named.)

---

## 3. Posting calendar (weeks 5–8)

UK times. BST ends Sun 2026-10-25, so all of this batch is GMT: **7pm UK =
19:00 UTC**. Same evening slot as batch 01. Adjust from Insights if weeks 1–4
show a better slot.

| Week | Date | Slot | Post | Target |
|---|---|---|---|---|
| 5 | Mon 11-09 | 19:00 | R13 — Boring is the point | Free challenge |
| 5 | Wed 11-11 | 19:00 | C6 — 6 boring money habits | Free worksheet |
| 5 | Thu 11-12 | 19:00 | R14 — The pay rise has a job | Free worksheet |
| 5 | Fri 11-13 | 19:00 | R15 — Nan's rule: looking comfortable | Free worksheet |
| 6 | Mon 11-16 | 19:00 | R16 — Christmas is on the 25th | Free challenge |
| 6 | Wed 11-18 | 19:00 | C7 — A Christmas budget in 5 slides | Free worksheet |
| 6 | Thu 11-19 | 19:00 | R17 — When the tin's empty | Free worksheet |
| 6 | Fri 11-20 | 19:00 | R18 — Plan December before it plans you | **Guide, #ad** |
| 7 | Mon 11-23 | 19:00 | R19 — A discount isn't a saving | Free worksheet |
| 7 | Wed 11-25 | 19:00 | C8 — The 48-hour rule | Free challenge |
| 7 | Thu 11-26 | 19:00 | R20 — One evening, one plan | **Guide, #ad** |
| 7 | Fri 11-27 | 19:00 | R21 — Nan's rule: the rainy-day tin (Black Friday) | Free worksheet |
| 8 | Mon 11-30 | 19:00 | R22 — Twice a year, write it all down | Free challenge |
| 8 | Wed 12-02 | 19:00 | C9 — Month-end review in 5 questions | Free worksheet |
| 8 | Thu 12-03 | 19:00 | C10 — Buy it once, buy it used | Free challenge |
| 8 | Fri 12-04 | 19:00 | R23 — Start January in December | **Guide, #ad** |

Guide posts: Fri 11-20, Thu 11-26, Fri 12-04. None on consecutive days, none
in week 5.

---

## 4. Self-check against the rules

- **Mostly free:** 13 of 16 (81%). ✅
- **Guide posts open with `#ad`** in the caption and on frame 1: R18, R20, R23. ✅
- **No consecutive guide days:** the closest pair is Fri 11-20 and Thu 11-26. ✅
- **AI label on every post.** ✅ (Set at publish; `ig.py` sends `is_ai_generated=true` on Reels.)
- **Method only:** no investments, no "good debt", no tax advice, no named
  products, banks, shops or sites. R22's "what you have and what you owe" is a
  record-keeping habit, not advice on what to do with it. C10 names categories
  (cars, furniture), not sellers. ✅
- **Rules, not results:** no first-person "this worked for me", no figures
  claimed as Nan's own. The "Nan's rule" posts (R15, R21) are phrased as rules. ✅
- **Source post:** the habit ideas are general and widely shared. None of the
  source post's wording is copied, and it isn't attributed or mentioned. ✅
- **No links in captions;** CTAs are "link in bio". ✅
- **CTA targets:** `/challenge/give-every-pound-a-job/`,
  `/download/budget-worksheet/`, `/guide/give-every-pound-a-job/`. Re-check that
  each returns 200 in the week's runbook before its first slot.

## 5. Open points for Neil

1. **Approve the batch, or edit it.** As with weeks 1–4, each week still gets
   its own runbook and date approval before anything is published.
2. **Voiceover:** text-only with music, unless you want to re-subscribe to
   Higgsfield for Nan's voice. My suggestion is text-only; the R7/R8
   comparison is the evidence to check first.
3. **C6's closing question** ("Which one's hardest for you?") is the first
   comment ask in the account. Worth keeping, to see whether it lifts comments
   compared with C1–C5.
