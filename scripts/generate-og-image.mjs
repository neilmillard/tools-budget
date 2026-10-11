import { ImageResponse } from "next/og.js";
import { writeFile } from "fs/promises";
import path from "path";

const image = new ImageResponse(
  {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
        color: "#ffffff",
        fontFamily: "sans-serif",
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "#9ca3af", marginBottom: 24 },
            children: "Ancient wisdom. Modern tools.",
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 64, fontWeight: 700, textAlign: "center", padding: "0 80px" },
            children: "Give Every Pound a Job",
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 28, color: "#d1d5db", marginTop: 24 },
            children: "Helpful Money",
          },
        },
      ],
    },
  },
  { width: 1200, height: 630 }
);

const buffer = Buffer.from(await image.arrayBuffer());
const outPath = path.join(process.cwd(), "public", "images", "give-every-pound-a-job-share.png");
await writeFile(outPath, buffer);
console.log("Wrote", outPath, buffer.length, "bytes");
