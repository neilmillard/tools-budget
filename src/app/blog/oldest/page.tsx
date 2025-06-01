import Link from "next/link";
import {getAllBlogPosts} from "@/lib/blogs";
import SortLinks from "@/app/components/blog/SortLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts (Oldest First) | Helpful Money",
  description: "Browse our collection of articles on personal finance, budgeting tips, and investing strategies, sorted from oldest to newest.",
  openGraph: {
    title: "Blog Posts (Oldest First) | Helpful Money",
    description: "Browse our collection of articles on personal finance, budgeting tips, and investing strategies, sorted from oldest to newest.",
  },
};

export default function BlogIndex() {
  const blogs = getAllBlogPosts("oldest");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <SortLinks currentSort="oldest" />
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id} className="mb-2">
            <Link href={`/blog/${blog.id}`} className="text-blue-500 hover:underline">
              {blog.title}
            </Link>
            <p className="text-sm text-gray-500">{blog.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
