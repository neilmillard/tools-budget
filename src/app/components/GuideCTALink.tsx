'use client';

import Link from "next/link";
import { ReactNode } from "react";
import { trackGuideLinkClick } from "@/lib/analytics";

interface GuideCTALinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function GuideCTALink({ href, children, className }: GuideCTALinkProps) {
  return (
    <Link href={href} className={className} onClick={() => trackGuideLinkClick(href)}>
      {children}
    </Link>
  );
}
