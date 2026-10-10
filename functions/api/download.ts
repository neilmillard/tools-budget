interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
  DOWNLOAD_LOG?: KVNamespace;
}

interface DownloadRecord {
  count: number;
  firstDownloadedAt: string;
  lastDownloadedAt: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

interface StripeCheckoutSession {
  payment_status?: string;
  line_items?: { data?: Array<{ price?: { id?: string } }> };
}

const SESSION_ID_PATTERN = /^cs_[a-zA-Z0-9_]+$/;

// The guide content, bundled directly in the Function rather than an R2
// bucket — small enough, and avoids needing Neil to provision a bucket.
const GUIDE_FILENAME = 'give-every-pound-a-job.md';
const GUIDE_CONTENT = `# Give Every Pound a Job

### A zero-based budgeting guide from Helpful Money

*Ancient wisdom. Modern tools.*

---

## Who this is for

You've got money coming in, money going out, and no real sense of where it goes in between. You've tried a budgeting app that just tells you what you *already* spent. You want something that tells you what to do with money *before* you spend it.

This guide teaches the **envelope / zero-based budgeting method** — the approach popularised by tools like YNAB — applied with a spreadsheet or a notebook, not a subscription. It's old money sense, the kind your gran would have practised with cash and tins, put to work with a modern worksheet. It's a method, not a product recommendation: nothing here tells you what to invest in, what to buy, or what's "right" for your situation. It's a way of thinking about money that you apply to your own numbers.

This is general educational content on a budgeting *method*. It isn't personal financial advice, and it isn't a recommendation to buy, sell, or hold any specific financial product.

> **Nan's rule:** If you don't know what job a pound has, it doesn't have one yet.

---

## The two ideas everything else is built on

### 1. Give every pound a job

Zero-based budgeting means that when money arrives, every single pound gets assigned a purpose *before* the month starts spending it. Not "I'll figure it out as I go" — a job, in advance: rent, groceries, the car's next MOT, a birthday present you know is coming in October.

Income minus allocations should equal zero. Not because you have no money left — because none of it is unassigned. Unassigned money is where impulse spending and "where did it all go" come from.

### 2. Live on last month's money

Once you've got roughly a month's income sitting in the bank *before* you start budgeting it, you stop budgeting the pay cheque that just landed and start budgeting the one that landed before it. That gap is what turns budgeting from a stressful monthly scramble into a calm, already-decided plan. It's a milestone to work towards, not a starting requirement — most people don't begin here.

---

## The method, step by step

### Step 1 — List your true expenses

Not just rent and bills. Everything that will cost money this year, even the irregular stuff:
- Fixed monthly costs (rent/mortgage, insurance, subscriptions)
- Variable monthly costs (groceries, fuel, utilities)
- Non-monthly costs (car maintenance, Christmas, birthdays, annual renewals, the dentist)

The non-monthly ones are where most budgets quietly fail. If your car needs a £400 service every October, that's not a surprise — it's a known cost you can save £33/month towards, starting in January.

### Step 2 — Turn expenses into categories (envelopes)

Each expense becomes a category — an "envelope" — with its own running balance. Traditionally this was physical cash in physical envelopes; today it's a spreadsheet column or a budgeting app category. The mechanism doesn't matter. What matters is that each category is tracked separately, so overspending in one is visible immediately rather than hiding inside one big "spending" number.

Keep the category list short enough to actually maintain — somewhere between 10 and 20 categories is typical. Too few and you lose the detail that makes this useful; too many and you'll stop updating it.

> **Nan's rule:** A tin for everything, and everything in its tin.

### Step 3 — Assign every pound of income to a category

When money comes in, allocate all of it across your categories until none is left unassigned. If income is £2,400 and your categories only add up to £2,100, the remaining £300 still needs a job — even if that job is "savings buffer" or "next month's head start."

### Step 4 — Track spending against each envelope, not your whole account

When you spend, it comes out of a specific category's balance, not just your overall bank balance. This is the habit shift that makes the method work: you're not asking "can I afford this?" against your whole account, you're asking "is there room left in *this* envelope?"

### Step 5 — Roll with the punches

You will overspend a category sometimes. That's not a failure of the method — it's the method working as intended, because it gives you an explicit decision to make: move money from another category to cover it, or accept the category is over and adjust next month. The alternative — not knowing until your account is empty — is worse.

### Step 6 — Review monthly, adjust the categories, not just the numbers

At the end of each month, look at which categories were consistently too tight or too loose and rebuild next month's allocations around reality rather than wishful thinking. The categories themselves should evolve as your life does.

---

## A worked example: one month, every pound with a job

Meet Sam. Sam's take-home pay is £2,250 a month, and a side job adds about £150. That's £2,400 to give jobs to. *(These numbers are made up to show the method. Yours will be different, and that's the point — this is one illustration, not a claim about what anyone should earn or spend.)*

### Planning, before the month starts

| Category | Type | Planned |
|---|---|---|
| Salary / main income | Income | £2,250 |
| Other income | Income | £150 |
| **Total income** | Total | **£2,400** |
| Rent / mortgage | Fixed | £1,050 |
| Utilities | Fixed | £180 |
| Insurance | Fixed | £60 |
| Subscriptions | Fixed | £30 |
| Groceries | Variable | £350 |
| Transport / fuel | Variable | £140 |
| Household / toiletries | Variable | £50 |
| Personal / fun money | Variable | £150 |
| Car maintenance (saved monthly) | Non-monthly | £33 |
| Birthdays & gifts (saved monthly) | Non-monthly | £25 |
| Christmas (saved monthly) | Non-monthly | £40 |
| Annual renewals (saved monthly) | Non-monthly | £20 |
| Buffer / unassigned catch | Other | £272 |
| **Total allocated** | Total | **£2,400** |
| **Income minus allocated** | Check | **£0** |

Fixed costs come to £1,320, variable to £690 and non-monthly to £118 — £2,128 in all. That leaves £272, which Sam doesn't leave floating: it goes into the buffer, so the check row reads £0. **Zero means every pound has a job, not that every pound gets spent.**

The £33 for the car is the £400 service from Step 1, spread over 12 months. Christmas at £40 a month is £480 by December, already set aside.

### Day 20: tracking against each envelope

| Category | Planned | Spent | Remaining |
|---|---|---|---|
| Rent / mortgage | £1,050 | £1,050 | £0 |
| Utilities | £180 | £175 | £5 |
| Groceries | £350 | £390 | −£40 |
| Transport / fuel | £140 | £95 | £45 |
| Household / toiletries | £50 | £32 | £18 |
| Personal / fun money | £150 | £80 | £70 |

Groceries are £40 over. Sam's bank balance looks fine, which is exactly how this would normally go unnoticed — the envelope makes it visible.

### Rolling with the punches (Step 5)

Sam moves £40 from Personal / fun money to Groceries: Groceries' plan becomes £390 with £0 remaining, fun money's plan becomes £110 with £30 remaining. Total allocated is still £2,400, and the check is still £0.

Nothing here "failed." Sam made a decision — fewer takeaways this month, and the food shop got paid for. Taking it from the buffer instead would have been just as valid. What matters is that the move was chosen, not discovered later.

### Month end: the review (Step 6)

Groceries went over a second month running, so next month Sam plans £380 and trims fun money to £120 — the plan now matches reality. Transport had £45 left, which Sam rolls forward since fuel prices move about. The non-monthly envelopes weren't touched; they keep building up until the bill arrives, which is exactly what they're for.

> **Nan's rule:** Going over isn't a failure. Not deciding is.

---

## Common mistakes with this method

- **Budgeting too precisely, too soon.** Round numbers and rough categories beat a perfect spreadsheet you abandon after two weeks.
- **Forgetting irregular costs.** These are the ones that make people feel the method "doesn't work" — they're not really irregular, they're just annual.
- **Treating "zero-based" as "spend it all."** Zero-based means *allocated*, not spent — a savings or buffer category is a perfectly valid job for a pound.
- **Starting with "living on last month's money" as a requirement.** It's the advanced stage, not the entry price. Start zero-based with whatever income you have now.

---

## The free budget worksheet

Pair this guide with Helpful Money's free budget worksheet — a ready-made zero-based budgeting template (income, envelope categories split into fixed/variable/non-monthly, and a running planned/spent/remaining check), available as a download from helpfulmoney.site. Use it to set up your own version of the categories and numbers above.

Duplicate it each month, carry forward unspent category balances where relevant, and adjust categories as Step 6 describes.

---

## A note on scope

This guide teaches a budgeting *method*. It does not recommend specific banks, apps, savings products, or investments, and nothing in it should be read as personalised financial advice. If you need advice specific to your circumstances, speak to a regulated financial adviser.

---

*Helpful Money — ancient wisdom, modern tools.*
`;

export async function verifyPaidSession(sessionId: string, priceId: string, secretKey: string): Promise<boolean> {
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return false;
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    if (!response.ok) {
      return false;
    }

    const session = (await response.json()) as StripeCheckoutSession;
    if (session.payment_status !== 'paid') {
      return false;
    }

    const paidPriceIds = session.line_items?.data?.map((item) => item.price?.id) ?? [];
    return paidPriceIds.includes(priceId);
  } catch {
    return false;
  }
}

// Records each successful download against the paying session, so a refund
// decision can check whether (and how many times) the file was actually
// pulled. Tracking is best-effort: a missing or failing KV binding must
// never block a paid download.
export async function recordDownload(sessionId: string, kv: KVNamespace, now: Date = new Date()): Promise<void> {
  const nowIso = now.toISOString();
  const existing = await kv.get(sessionId);
  const previous = existing ? (JSON.parse(existing) as DownloadRecord) : null;

  const record: DownloadRecord = {
    count: (previous?.count ?? 0) + 1,
    firstDownloadedAt: previous?.firstDownloadedAt ?? nowIso,
    lastDownloadedAt: nowIso,
  };

  await kv.put(sessionId, JSON.stringify(record));
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return Response.json({ message: 'Download is not configured yet.' }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get('session_id') ?? '';
  const paid = await verifyPaidSession(sessionId, env.STRIPE_PRICE_ID, env.STRIPE_SECRET_KEY);

  if (!paid) {
    return Response.json({ message: 'This download link is not valid.' }, { status: 403 });
  }

  if (env.DOWNLOAD_LOG) {
    try {
      await recordDownload(sessionId, env.DOWNLOAD_LOG);
    } catch {
      // Tracking is a nice-to-have; never fail the download because of it.
    }
  }

  return new Response(GUIDE_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${GUIDE_FILENAME}"`,
    },
  });
};
