# The 30-Day Give-Every-Pound-A-Job Challenge

**Ancient wisdom. Modern tools.**

A free, 30-day companion challenge for helpfulmoney.site's budgeting guide. Same method — zero-based / envelope budgeting — delivered as daily actions instead of a manual. Built as a lead-gen / email-capture funnel piece (see "Funnel role" below), not a paid product.

---

## How it works

One short action a day, each building on the last. By day 30 you've built a working zero-based budget from scratch and lived on it for most of a month. No spreadsheet literacy assumed — the guide's template is introduced on Day 3 and referenced throughout, so the challenge and the guide reinforce each other rather than duplicating content.

Four weekly milestones carry the method:

- **Week 1 — See it.** Get honest about where money actually goes today.
- **Week 2 — Name it.** Give every pound a job, zero-based, before the month starts.
- **Week 3 — Live it.** Run the plan against real spending and adjust without guilt.
- **Week 4 — Keep it.** Build the habit that survives past day 30 (rollover, buffer, review rhythm).

---

## Day-by-day

### Week 1 — See it (Days 1–7)
1. Write down every pound you spent yesterday. No judgment, just the list.
2. Pull your last 30 days of transactions. Circle the three you'd forgotten about.
3. Download the free budget worksheet (`/download/Give Every Pound a Job - Budget Worksheet.xlsx`). Open it, don't fill it in yet.
4. Name your top 5 spending categories from Day 2's list.
5. Find one "ghost subscription" — something you're paying for and not using.
6. Write your current bank balance at the top of a page. That's your starting line, not a judgment.
7. **Milestone check-in:** You now know where last month's money actually went.

### Week 2 — Name it (Days 8–14)
8. List every pound of income you expect this month.
9. List your fixed bills (rent, phone, subscriptions you're keeping) and their amounts.
10. Give your first "envelope" a job: groceries. Set a number.
11. Give every remaining pound a job until income minus jobs equals zero. Check the worksheet's zero-check row — it should read £0. This is the core move — don't skip it.
12. Re-read your plan out loud. Cut anything that's a guess, not a number.
13. Pick one category you're most likely to overspend. Add a small buffer envelope just for that.
14. **Milestone check-in:** Every pound has a job. You have a zero-based budget for this month. *(Want the full method plus worked examples? The "Give Every Pound a Job" guide — `/guide/give-every-pound-a-job/` — goes deeper than this challenge can.)*

### Week 3 — Live it (Days 15–21)
15. Log every purchase today against its envelope.
16. Find your first envelope that's running low. Move money from a lower-priority envelope to cover it — don't panic, don't quit.
17. Skip one small non-essential purchase today and move that pound to savings.
18. Review the week: which envelope was too tight? Which was too generous?
19. Adjust next week's envelope amounts based on Day 18 — budgets are living documents, not contracts.
20. Tell one person (partner, friend, group chat) one thing you've learned this week.
21. **Milestone check-in:** You've run a real week on a real budget and adjusted it without starting over.

### Week 4 — Keep it (Days 22–30)
22. Set up a "true expense" envelope for something irregular (car MOT, Christmas, birthdays) — saving a little monthly instead of getting hit all at once.
23. Decide your rollover rule: unspent envelope money carries to next month, not back to "available to spend."
24. Build your one-month emergency buffer envelope — even £1 a day counts as the start.
25. Review your three biggest envelopes. Are they funding what you actually value?
26. Automate one thing: a standing order into savings, a recurring transfer — remove one decision from future-you.
27. Write next month's budget before this month ends — don't wait for payday to plan.
28. Share your win so far — even "I didn't quit" counts.
29. Plan your Day 31 review: same time, same place, recurring calendar slot.
30. **Final milestone:** You've built, lived on, and adjusted a zero-based budget for a full month. That's the whole method — repeat it monthly from here. *(Ready to make it stick with the full guide and worked examples? Get "Give Every Pound a Job" — `/guide/give-every-pound-a-job/` — £7.)*

---

## Funnel role — recommendation

**Free lead-gen / email-capture piece, feeding Brevo. Not bundled with the paid guide.**

Why:
- The challenge is the *habit*; the guide is the *reference*. Giving the challenge away removes the risk of "pay first, then find out if the method suits you" — it builds trust and proof the method works before asking for money.
- It's a natural daily-touch email sequence: Day 1 signup → 30 daily (or weekly-digest) emails → guide upsell lands on Day 14 (when the budget is built and "give every pound a job" has already landed experientially) and again at Day 30 (habit is proven, buy the full guide + template for next month onward).
- It gives Brevo a clean, repeatable list-building asset independent of any single blog post, and a natural reason to re-engage anyone who drops off mid-challenge with a "pick back up" email.
- It's promotable on Instagram as a standalone 30-day series (one post/story per day or per milestone), which the guide alone isn't shaped for.

Suggested mechanic: single landing page, email capture unlocks Day 1 immediately, Brevo automation drips the remaining 29 days, soft guide CTA at Day 14, stronger CTA at Day 30.

---

## Brevo email sequence — subject lines + send triggers

Drip copy for the automation, keyed to day/week so Developer can wire sends once the signup endpoint exists. Weekly-digest cadence (daily would be 30 separate emails — digest keeps it light while still landing all 4 milestones).

| Trigger | Subject | Content |
|---|---|---|
| Signup (Day 0) | "Day 1 starts now: give every pound a job" | Welcome + Day 1 action + what the next 30 days look like. |
| Day 3 | "Your free worksheet is here" | Links the worksheet download, Day 2–4 actions. |
| Day 7 (Week 1 milestone) | "You now know where last month's money went" | Recap Week 1, set up Week 2. |
| Day 14 (Week 2 milestone) | "Every pound has a job — here's what's next" | Recap Week 2 + **soft CTA**: link to `/guide/give-every-pound-a-job/`. |
| Day 21 (Week 3 milestone) | "A week on budget, and it didn't go to plan — that's fine" | Recap Week 3, normalise adjusting. |
| Day 27 | "Don't wait for payday — plan next month now" | Day 27 action. |
| Day 30 (final milestone) | "You did it. Here's how to keep it going" | Recap + **CTA**: `/guide/give-every-pound-a-job/`, £7. |
| Day 34 (re-engagement, if inactive) | "Still with us? Pick back up on Day X" | For anyone who stalled mid-challenge. |

Not built yet — this is drafted copy, not a live automation. Needs: the signup capture endpoint/form (Developer), the Brevo list + automation workflow wired to these triggers (MarketingLead, once the endpoint exists to capture signups into).

---

## Voice / alignment notes

- Written in the same "ancient wisdom, modern tools" register as the rest of helpfulmoney.site: plain, short sentences, no jargon, calm about setbacks ("don't panic, don't quit").
- Matches the Instagram persona brief's method-level, non-personalised stance — every day is an action or a reflection, never a specific product or investment recommendation.
- Reuses the guide's exact framing ("give every pound a job," "live on last month's money," zero-based/envelope method) so the two pieces read as one system, per the coordination note in the parent issue.
- No personalised financial advice anywhere in the 30 days — every prompt is a general action the reader applies to their own numbers.
