/* global process, Buffer, console */
// Generates a 1200x630 share image (og:image) for every blog post into
// public/images/blog/<id>.png. Run after adding a post:
//   node scripts/generate-blog-og-images.mjs
// Pick a different illustration with `image: <motif>` in the post's
// frontmatter (jar, envelopes, house, chart, fees, coins, scales).
import { ImageResponse } from "next/og.js";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { MOTIFS, motifForPost } from "./blog-image-themes.mjs";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog-posts");
const OUT_DIR = path.join(process.cwd(), "public", "images", "blog");
// Noto Sans (OFL, see scripts/fonts/OFL.txt), subset to Latin. The Geist font
// bundled with next/og leaves extra-wide gaps after words with ligatures
// ("Forgotten  Art"), because the renderer measures ligatures as separate letters.
const FONT_PATH = path.join(process.cwd(), "scripts", "fonts", "NotoSans-Regular-latin.ttf");

const div = (style, children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

function card(title, motif) {
  const svgUri = `data:image/svg+xml;base64,${Buffer.from(MOTIFS[motif]).toString("base64")}`;
  const titleSize = title.length > 70 ? 46 : title.length > 45 ? 54 : 62;
  return div(
    { width: "1200px", height: "630px", backgroundColor: "#FBF7EF", color: "#1F2937", fontFamily: "Noto Sans" },
    [
      div({ width: "18px", height: "630px", backgroundColor: "#2F855A" }, []),
      div(
        { flexDirection: "column", justifyContent: "space-between", width: "700px", padding: "64px 40px 56px 60px" },
        [
          div({ fontSize: 22, letterSpacing: 4, color: "#2F855A" }, "HELPFUL MONEY"),
          div({ fontSize: titleSize, lineHeight: 1.15 }, title),
          div({ fontSize: 24, color: "#6B7280" }, "helpfulmoney.site"),
        ]
      ),
      div({ alignItems: "center", justifyContent: "center", width: "482px" }, [
        { type: "img", props: { src: svgUri, width: 400, height: 400 } },
      ]),
    ]
  );
}

const font = await readFile(FONT_PATH);
await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(POSTS_DIR)).filter((file) => file.endsWith(".md"));
for (const file of files) {
  const id = file.replace(/\.md$/, "");
  const { data } = matter(await readFile(path.join(POSTS_DIR, file), "utf-8"));
  const motif = motifForPost(id, data.image);
  const image = new ImageResponse(card(data.title, motif), {
    width: 1200,
    height: 630,
    fonts: [{ name: "Noto Sans", data: font, weight: 400, style: "normal" }],
  });
  await writeFile(path.join(OUT_DIR, `${id}.png`), Buffer.from(await image.arrayBuffer()));
  console.log(`${id}.png (${motif})`);
}
