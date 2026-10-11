'use client';

import { ReactNode } from "react";
import { trackGuideLinkClick } from "@/lib/analytics";

interface TrackedAnchorProps {
  href?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export default function TrackedAnchor({ href, children, ...rest }: TrackedAnchorProps) {
  const isGuideLink = typeof href === "string" && href.startsWith("/guide/give-every-pound-a-job");

  return (
    <a href={href} {...rest} onClick={isGuideLink ? () => trackGuideLinkClick(href) : undefined}>
      {children}
    </a>
  );
}
