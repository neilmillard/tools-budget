/* global process, console, fetch */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog-posts");
const STATE_FILE = path.join(process.cwd(), "scripts", "newsletter-state.json");
const BREVO_API_URL = "https://api.brevo.com/v3/emailCampaigns";
const SITE_URL = "https://www.helpfulmoney.site";
const EXCERPT_MAX = 220;

/**
 * Posts crossed into "published" since the last send, gated by publish date
 * (not generation date) so the automation matches the site's actual staggered
 * weekly release schedule rather than the batch the content was written in.
 * Mirrors src/lib/newsletter.ts (kept separate: this script runs standalone
 * in CI without the Next.js/TS build step).
 */
export function getNewlyPublishedPosts(posts, lastSentDate, today = new Date()) {
  const since = lastSentDate ? new Date(lastSentDate) : new Date(0);

  return posts
    .filter((post) => {
      const publishDate = new Date(post.date);
      return publishDate > since && publishDate <= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function campaignName(post) {
  return `Newsletter - ${post.title}`;
}

/**
 * Brevo is the record of what has actually gone out. The state file is only a
 * floor for the date window: it can lag (main is protected, so CI cannot commit
 * it back), and a lagging file must never cause a resend.
 */
export function withoutAlreadySent(posts, sentNames) {
  return posts.filter((post) => !sentNames.has(campaignName(post)));
}

export async function fetchSentCampaignNames(fetchFn, apiKey, pageSize = 100) {
  const names = new Set();
  for (let offset = 0; ; offset += pageSize) {
    const response = await fetchFn(
      `${BREVO_API_URL}?type=classic&limit=${pageSize}&offset=${offset}&excludeHtmlContent=true`,
      { headers: { "api-key": apiKey, Accept: "application/json" } },
    );
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Brevo campaign list failed: ${response.status} ${body}`);
    }
    const { campaigns = [], count = 0 } = await response.json();
    for (const campaign of campaigns) {
      if (campaign.status !== "draft") names.add(campaign.name);
    }
    if (campaigns.length === 0 || offset + campaigns.length >= count) return names;
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.]+$/, "")}…`;
}

/** One or two sentences for the email body and inbox preview. */
export function excerptFor({ description = "", content = "" }) {
  if (description) return truncate(stripMarkdown(description), EXCERPT_MAX);
  const lines = content.split("\n");
  const start = lines.findIndex((line) => line.startsWith("> **Quick answer:**"));
  let source;
  if (start >= 0) {
    const quote = [];
    for (let i = start; i < lines.length && lines[i].startsWith(">"); i++) quote.push(lines[i].replace(/^> ?/, ""));
    source = quote.join(" ").replace("**Quick answer:**", "");
  } else {
    source = content.replace(/^#.*$/m, "").trim().split(/\n\s*\n/)[0] ?? "";
  }
  return truncate(stripMarkdown(source), EXCERPT_MAX);
}

export function renderEmailHtml(post) {
  const utm = `utm_source=newsletter&utm_medium=email&utm_campaign=${post.id}`;
  const postUrl = escapeHtml(`${SITE_URL}/blog/${post.id}/?${utm}`);
  const guideUrl = escapeHtml(`${SITE_URL}/guide/give-every-pound-a-job/?from=newsletter&${utm}`);
  const imageUrl = escapeHtml(`${SITE_URL}/images/blog/${post.id}.png`);
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt ?? "");
  const font = "font-family:Arial,Helvetica,sans-serif;";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${excerpt}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr><td style="padding:20px 28px;${font}font-size:15px;font-weight:bold;color:#111827;">
        Helpful Money <span style="font-weight:normal;color:#6b7280;">· ancient wisdom, modern tools</span>
      </td></tr>
      <tr><td>
        <a href="${postUrl}"><img src="${imageUrl}" width="600" alt="${title}" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;${font}">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#2F855A;font-weight:bold;">New on the blog</p>
        <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#111827;">${title}</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#374151;">${excerpt}</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#2F855A;border-radius:8px;">
            <a href="${postUrl}" style="display:inline-block;padding:14px 26px;${font}font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Read the article →</a>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:24px 28px 28px;${font}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7EF;border-left:4px solid #2F855A;border-radius:10px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#111827;">Want the whole method in one place?</p>
            <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#374151;">The <em>Give Every Pound a Job</em> guide walks you through zero-based budgeting step by step, with a worked example. £7, one-off.</p>
            <a href="${guideUrl}" style="font-size:14px;font-weight:bold;color:#2F855A;">Get the guide →</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <tr><td align="center" style="padding:18px 12px;${font}font-size:12px;line-height:1.5;color:#6b7280;">
        You're getting this because you signed up at helpfulmoney.site.<br>
        <a href="{{ unsubscribe }}" style="color:#6b7280;">Unsubscribe</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function loadPosts() {
  return fs.readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf-8"));
      return {
        id: file.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
        excerpt: excerptFor({ description: data.description, content }),
      };
    });
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { lastSentDate: null };
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

async function sendCampaign(post) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  if (!apiKey || !listId) {
    throw new Error("BREVO_API_KEY and BREVO_LIST_ID must be set to send a campaign");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: campaignName(post),
      subject: post.title,
      sender: { name: "Helpful Money", email: "team@deltafamiglia.com" },
      type: "classic",
      htmlContent: renderEmailHtml(post),
      recipients: { listIds: [Number(listId)] },
      scheduledAt: undefined,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo campaign create failed for ${post.id}: ${response.status} ${body}`);
  }

  const created = await response.json();

  const sendResponse = await fetch(`${BREVO_API_URL}/${created.id}/sendNow`, {
    method: "POST",
    headers: { "api-key": apiKey },
  });

  if (!sendResponse.ok) {
    const body = await sendResponse.text();
    throw new Error(`Brevo campaign send failed for ${post.id}: ${sendResponse.status} ${body}`);
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const posts = loadPosts();
  const state = loadState();
  const today = new Date();

  const candidates = getNewlyPublishedPosts(posts, state.lastSentDate, today);
  const newlyPublished = dryRun || candidates.length === 0
    ? candidates
    : withoutAlreadySent(candidates, await fetchSentCampaignNames(fetch, process.env.BREVO_API_KEY));

  if (newlyPublished.length === 0) {
    console.log("No newly published posts since last send. Nothing to do.");
    return;
  }

  for (const post of newlyPublished) {
    console.log(`${dryRun ? "[dry-run] " : ""}Sending newsletter for "${post.title}" (${post.date})`);
    if (!dryRun) {
      await sendCampaign(post);
      // Persist after every send, not just at the end of the batch: if a later
      // post fails (or the backlog is large), already-sent posts stay recorded
      // instead of being resent on the next run.
      saveState({ lastSentDate: post.date });
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
