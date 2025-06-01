import {getAdjacentBlogPosts, getAllBlogPosts, getBlogPost} from "@/lib/blogs";
import BlogPost, {BlogNav, BlogPostShort} from "@/app/components/blog/BlogPost";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await getBlogPost(params.id);

  // Create a plain text excerpt from the content (first 160 characters)
  const contentText = blog.content.replace(/<[^>]*>/g, '');
  const excerpt = contentText.length > 160 ? contentText.substring(0, 157) + '...' : contentText;

  return {
    title: `${blog.title} | Helpful Money Blog`,
    description: excerpt,
    openGraph: {
      title: `${blog.title} | Helpful Money Blog`,
      description: excerpt,
    },
  };
}

export default async function BlogPage({ params, }: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params
  const blog = await getBlogPost(id);
  const {previous, next} = getAdjacentBlogPosts(id);

  return (
    <div className={"max-w-2x1 mx-auto pt-6"}>
      <BlogNav previous={previous} next={next}/>

      <BlogPost title={blog.title} date={blog.date} content={blog.content}/>

      <BlogNav previous={previous} next={next}/>
    </div>
  );
}

export async function generateStaticParams() {
  const blogs = getAllBlogPosts();
  return blogs.map((blog: BlogPostShort) => ({id: blog.id}));
}
