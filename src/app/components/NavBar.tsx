'use client';
import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function NavBar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return <nav className="hidden md:flex gap-10 h-full flex-row justify-center bg-green-50">
        <Link href="/" className={isActive("/") ? "font-bold" : "" + "flex flex-col justify-center"}><span> Home </span></Link> |
        <Link href="/about/" className={isActive("/about/") ? "font-bold" : "" + "flex flex-col justify-center"}><span> About </span></Link> |
        <Link href="/contact" className={isActive("/contact/") ? "font-bold" : "" + "flex flex-col justify-center"}><span> Contact </span></Link>
    </nav>;
}