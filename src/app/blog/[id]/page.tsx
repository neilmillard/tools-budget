import {getAdjacentBlogPosts, getAllBlogPosts, getBlogPost} from "@/lib/blogs";
import BlogPost, {BlogNav, BlogPostShort} from "@/app/components/blog/BlogPost";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | undefined }): Promise<Metadata> {
  const resolvedParams = params ? await params : { id: '' };
  const { id } = resolvedParams;
  const blog = await getBlogPost(id);

  // Use description from frontmatter if available, otherwise create an excerpt
  const description = blog.description || 
    (blog.content.replace(/<[^>]*>/g, '').length > 160 
      ? blog.content.replace(/<[^>]*>/g, '').substring(0, 157) + '...' 
      : blog.content.replace(/<[^>]*>/g, ''));

  return {
    title: `${blog.title} | Helpful Money Blog`,
    description: description,
    openGraph: {
      title: `${blog.title} | Helpful Money Blog`,
      description: description,
    },
    alternates: {
      canonical: `/blog/${id}/`,
    },
  };
}

export default async function BlogPage({ params }: {
  params: Promise<{ id: string }> | undefined
}) {
  const resolvedParams = params ? await params : { id: '' };
  const { id } = resolvedParams;
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
