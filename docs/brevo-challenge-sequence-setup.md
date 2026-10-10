# Brevo setup for the 30-day challenge (DEL-586)

The signup/email-capture side is now built and wired into the site (`/challenge/give-every-pound-a-job/`,
`functions/api/challenge-signup.ts`). What's left is Brevo-dashboard configuration — a list and an
automation — that only someone with Brevo account access can do. This is that checklist.

The drip copy itself (subject lines, send triggers, content) is already drafted in
`docs/30-day-budgeting-challenge.md` under "Brevo email sequence — subject lines + send triggers". This
doc is just the mechanical setup to make that drip actually send.

## 1. Create the list

1. In Brevo, create a new contact list — e.g. **"30-Day Challenge"** — separate from any existing
   newsletter/contact list, so the challenge drip doesn't mix with other sends.
2. Note its numeric list ID (Brevo shows this on the list's settings page).

## 2. Add the list ID as a Cloudflare Pages environment variable

The signup endpoint (`functions/api/challenge-signup.ts`) reads two env vars, matching the pattern
`functions/api/contact.ts` already uses for `BREVO_API_KEY`:

- `BREVO_API_KEY` — already set (shared with the contact form).
- `BREVO_CHALLENGE_LIST_ID` — **new, not set yet.** Add it in the Cloudflare Pages project's
  environment variables (Production), with the numeric ID from step 1. Until this is set, the endpoint
  responds with "Service unavailable" on `main` (or a preview no-op message on preview branches) instead
  of silently failing.

## 3. Build the automation

In Brevo, create an automation workflow triggered by **"Contact added to list"** → the list from step 1.
Each row below is one automation email/step:

| Trigger (days after signup) | Subject |
|---|---|
| 0 (immediate) | "Day 1 starts now: give every pound a job" |
| 3 | "Your free worksheet is here" |
| 7 | "You now know where last month's money went" |
| 14 | "Every pound has a job — here's what's next" |
| 21 | "A week on budget, and it didn't go to plan — that's fine" |
| 27 | "Don't wait for payday — plan next month now" |
| 30 | "You did it. Here's how to keep it going" |
| 34, only if inactive | "Still with us? Pick back up on Day X" |

Content for each email is in `docs/30-day-budgeting-challenge.md`'s day-by-day section — copy the relevant
days' actions into each send rather than duplicating the full 30 days in every email (weekly-digest
cadence, not one email per day).

Links to include:
- Day 3 email → the free worksheet: `/download/Give Every Pound a Job - Budget Worksheet.xlsx`
- Day 14 email → soft mention of the guide: `/guide/give-every-pound-a-job/`
- Day 30 email → full CTA for the guide: `/guide/give-every-pound-a-job/` (£7)

## 4. Test before going live

1. Set `BREVO_CHALLENGE_LIST_ID` on a preview branch too (or temporarily on Production) and submit the
   `/challenge/give-every-pound-a-job/` form with a real inbox you control.
2. Confirm the contact lands in the right list in Brevo and the Day 0 automation email sends.
3. Only then treat the challenge page as live/promotable (e.g. on Instagram).

## Not in scope here

- The guide's checkout/delivery flow (DEL-583/DEL-585) — unrelated, already live.
- Re-engagement logic for contacts who unsubscribe mid-challenge — handled by Brevo's own
  unsubscribe/suppression handling, nothing custom needed.
