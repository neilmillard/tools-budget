import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'blog-posts');

/**
 * Checks all markdown blog posts for internal links that are missing a trailing slash.
 * Internal links are defined as those starting with '/' and not having an extension (like .png).
 */
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
    
    // Regex explanation:
    // \[.*?\]\( - match markdown link start [text](
    // ( - start group 1 (the URL)
    // \/ - must start with /
    // [^\)]+? - match one or more non-) characters (lazy)
    // (?<!\/) - negative lookbehind: the character before ) must NOT be /
    // (?<!\.(?:png|jpg|jpeg|gif|svg|pdf|webp)) - negative lookbehind: ensure it's not a file extension
    // \) - match closing )
    // We use a simplified version first and refine if needed, similar to what worked in previous session.
    
    const regex = /\[.*?]\(((\/[^)]+?)(?<!\/))\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const url = match[1];
      // Skip if it looks like a file (has an extension)
      if (/\.[a-z0-9]{2,4}$/i.test(url)) continue;
      
      console.log(`Issue in ${file}: ${match[0]} (URL: ${url}) - Missing trailing slash`);
      issuesFound++;
    }
  });

  if (issuesFound > 0) {
    console.error(`Total issues found: ${issuesFound}`);
    process.exit(1);
  } else {
    console.log('Trailing slash check passed: No issues found!');
    process.exit(0);
  }
}

checkTrailingSlashes();
