import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Helpful Money",
  description: "Explore our collection of articles on personal finance, budgeting tips, investing strategies, and more to improve your financial knowledge.",
  openGraph: {
    title: "Blog | Helpful Money",
    description: "Explore our collection of articles on personal finance, budgeting tips, investing strategies, and more to improve your financial knowledge.",
  },
  alternates: {
    canonical: "/blog/",
  },
};

export default function BlogIndex() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <meta httpEquiv="refresh" content="0; url=/blog/newest/" />
            <p>Redirecting to <a href="/blog/newest/" className="text-blue-500 hover:underline">/blog/newest/</a>...</p>
        </div>
    );
}
