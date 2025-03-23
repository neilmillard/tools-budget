import {getAdjacentBlogPosts, getAllBlogPosts, getBlogPost} from "@/lib/blogs";
import BlogPost, {BlogNav, BlogPostShort} from "@/app/components/BlogPost";

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
