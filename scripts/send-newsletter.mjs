import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog-posts");
const STATE_FILE = path.join(process.cwd(), "scripts", "newsletter-state.json");
const BREVO_API_URL = "https://api.brevo.com/v3/emailCampaigns";

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

function loadPosts() {
  return fs.readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf-8"));
      return { id: file.replace(/\.md$/, ""), title: data.title, date: data.date };
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

  const url = `https://www.helpfulmoney.site/blog/${post.id}/`;
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Newsletter - ${post.title}`,
      subject: post.title,
      sender: { name: "Helpful Money", email: "hello@helpfulmoney.site" },
      type: "classic",
      htmlContent: `<p>New from Helpful Money — ancient wisdom, modern tools.</p><p><a href="${url}">${post.title}</a></p>`,
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

  const newlyPublished = getNewlyPublishedPosts(posts, state.lastSentDate, today);

  if (newlyPublished.length === 0) {
    console.log("No newly published posts since last send. Nothing to do.");
    return;
  }

  for (const post of newlyPublished) {
    console.log(`${dryRun ? "[dry-run] " : ""}Sending newsletter for "${post.title}" (${post.date})`);
    if (!dryRun) {
      await sendCampaign(post);
    }
  }

  if (!dryRun) {
    saveState({ lastSentDate: newlyPublished[newlyPublished.length - 1].date });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
