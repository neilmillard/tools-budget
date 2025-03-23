import Link from "next/link";
import Markdown from "markdown-to-jsx";
import {Fragment} from "react";

export type BlogPostProps = {
  title: string;
  date: string;
  content: string;
};

export type BlogPostShort = {
  id: string;
  title: string;
  date: string
}

export default function BlogPost({ title, date, content }: BlogPostProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-500 text-sm">{date}</p>
      <div className="mt-4 text-lg"><article className="prose"> <Markdown options={{ wrapper: Fragment }} children={content}/></article></div>
    </div>
  );
}

export function BlogNav(props: { previous: BlogPostShort | null, next: BlogPostShort | null }) {
  return <div className={"w-[83%] mx-auto mt-6 grid grid-cols-3 text-blue-500"}>
    <div className={"text-left"}>
      {props.previous ? (
      <Link href={`/blog/${props.previous.id}`} className={"hover:underline"}>
        &lt;- {props.previous.title}
      </Link>
    ) : <div/>}
    </div>
    <div className={"text-center"}>
      <Link href={"/blog/"}>Blog</Link>
    </div>
    <div className={"text-right"}>
      {props.next ? (
        <Link href={`/blog/${props.next.id}`} className="hover:underline">
          {props.next.title} -&gt;
        </Link>
      ) : <div/>}
    </div>
  </div>;
}