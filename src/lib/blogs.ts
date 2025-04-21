import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {BlogPostShort} from "@/app/components/blog/BlogPost";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog-posts");

export function getAllBlogPosts(sortOrder: "newest" | "oldest" = "newest"): BlogPostShort[] {
  const files = fs.readdirSync(POSTS_DIR);
  const today = new Date();

  const blogs:BlogPostShort[] =  files.map((file) => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    if (new Date(data.date) > today){
      return { id: "",
        title: null,
        date: null,
      };
    } else {
      return {
        id: file.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
      };
    }
  }).filter(n => n.title); // chop the null values

  return blogs.sort((a, b) =>
    sortOrder === "newest"
    ? new Date(b.date).getTime() - new Date(a.date).getTime()
    : new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export async function getBlogPost(id: string) {
  const filePath = path.join(POSTS_DIR, `${id}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    id,
    title: data.title,
    date: data.date,
    content: content,
  };
}

export function getAdjacentBlogPosts(id: string) {
  const blogs = getAllBlogPosts("oldest");
  const index = blogs.findIndex((blog) => blog.id === id);

  const previous = index > 0 ? blogs[index - 1] : null;
  const next = index < blogs.length - 1 ? blogs[index + 1] : null;

  return {previous, next};
}