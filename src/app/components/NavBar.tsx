import React from "react";
import Link from "next/link";

export function NavBar() {
    return <div className="hidden md:flex gap-10 h-full flex-row justify-center bg-green-50">
        <Link href="/" className="flex flex-col justify-center"><span> Home </span></Link> |
        <Link href="/about/" className="flex flex-col justify-center"><span> About </span></Link> |
        <Link href="/contact" className="flex flex-col justify-center"><span> Contact </span></Link>
    </div>;
}