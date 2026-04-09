import Link from "next/link";
// @ts-ignore
const ReactMarkdown = process.env.NODE_ENV === 'test' 
  ? null 
  : require("react-markdown").default;
// @ts-ignore
const remarkGfm = process.env.NODE_ENV === 'test' 
  ? null 
  : require("remark-gfm").default;
const rehypeRaw = process.env.NODE_ENV === 'test'
  ? null
  : require("rehype-raw").default;
import ToolCTA from "./ToolCTA";

const MockReactMarkdown = ({ children, components }: any) => {
  const ToolCTAComponent = components?.ToolCTA;
  const content = typeof children === 'string' ? children : '';
  const ctaMatch = content.match(/<ToolCTA\s+([^>]+)\s*\/>/i);

  let props: any = {};
  if (ctaMatch && ctaMatch[1]) {
    const attrString = ctaMatch[1];
    const attrRegex = /([a-z0-9]+)=["']([^"']+)["']/gi;
    let m;
    while ((m = attrRegex.exec(attrString)) !== null) {
      props[m[1]] = m[2];
    }
  }

  return (
    <div className="mock-react-markdown">
      {children}
      {Object.keys(props).length > 0 && ToolCTAComponent && (
        <ToolCTAComponent {...props} />
      )}
    </div>
  );
};

const MarkdownComponent = process.env.NODE_ENV === 'test' ? MockReactMarkdown : ReactMarkdown;

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
      <h1 className="text-xs font-bold">{title}</h1>
      <p className="text-gray-500 text-sm">{date}</p>
      <div className="mt-4 text-lg">
        <article className="prose">
          <MarkdownComponent
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // @ts-ignore
              ToolCTA: ({ node, ...props }: any) => <ToolCTA {...props} />,
              // @ts-ignore
              toolcta: ({ node, ...props }: any) => <ToolCTA {...props} />,
            }}
          >
            {content}
          </MarkdownComponent>
        </article>
      </div>
    </div>
  );
}

export function BlogNav(props: { previous: BlogPostShort | null, next: BlogPostShort | null }) {
  return <div className={"w-[83%] mx-auto mt-6 grid grid-cols-3 text-blue-500"}>
    <div className={"text-left"}>
      {props.previous ? (
      <Link href={`/blog/${props.previous.id}/`} className={"hover:underline"}>
        &lt;- {props.previous.title}
      </Link>
    ) : <div/>}
    </div>
    <div className={"text-center"}>
      <Link href={"/blog/"}>Blog</Link>
    </div>
    <div className={"text-right"}>
      {props.next ? (
        <Link href={`/blog/${props.next.id}/`} className="hover:underline">
          {props.next.title} -&gt;
        </Link>
      ) : <div/>}
    </div>
  </div>;
}