import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'blog-posts');

/**
 * Finds internal markdown links that are missing a trailing slash. Internal
 * links are those starting with '/' and not having a file extension (like
 * .png). The path is checked before any '?query' or '#fragment', so a link
 * such as `/guide/?from=x` is not flagged just because the full URL doesn't
 * end in '/'.
 */
export function findTrailingSlashIssues(content) {
  const regex = /\[.*?]\((\/[^)]+)\)/g;
  const issues = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const url = match[1];
    const pathOnly = url.split(/[?#]/)[0];

    // Skip if it looks like a file (has an extension)
    if (/\.[a-z0-9]{2,4}$/i.test(pathOnly)) continue;

    // Already has a trailing slash before any query/fragment
    if (pathOnly.endsWith('/')) continue;

    issues.push({ match: match[0], url });
  }

  return issues;
}

function checkTrailingSlashes() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log(`Directory ${POSTS_DIR} does not exist. Skipping check.`);
    process.exit(0);
  }

  const files = fs.readdirSync(POSTS_DIR);
  let issuesFound = 0;

  files.forEach(file => {
    if (!file.endsWith('.md')) return;
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');

    findTrailingSlashIssues(content).forEach(issue => {
      console.log(`Issue in ${file}: ${issue.match} (URL: ${issue.url}) - Missing trailing slash`);
      issuesFound++;
    });
  });

  if (issuesFound > 0) {
    console.error(`Total issues found: ${issuesFound}`);
    process.exit(1);
  } else {
    console.log('Trailing slash check passed: No issues found!');
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkTrailingSlashes();
}
