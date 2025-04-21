"use client";

import Link from "next/link";

export default function SortLinks({ currentSort }: {currentSort: "newest" | "oldest"}) {
  return (
    <div className={"mb-4 flex gap-4"}>
    <Link href={"/blog/newest/"}
          className={`${
            currentSort === "newest" ? "font-bold text-blue-600" : "text-gray-600"
          } hover:underline`}
          >
      Newest First
    </Link>
      <Link href={"/blog/oldest/"}
            className={`${
              currentSort === "oldest" ? "font-bold text-blue-600" : "text-gray-600"
            } hover:underline`}
      >
        Oldest First
      </Link>
    </div>
)
}