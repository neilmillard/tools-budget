import {redirect} from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Helpful Money",
  description: "Explore our collection of articles on personal finance, budgeting tips, investing strategies, and more to improve your financial knowledge.",
  openGraph: {
    title: "Blog | Helpful Money",
    description: "Explore our collection of articles on personal finance, budgeting tips, investing strategies, and more to improve your financial knowledge.",
  },
};

export default function BlogIndex() {
  redirect("/blog/newest/")
}
