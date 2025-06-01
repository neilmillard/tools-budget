import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { GoogleTagManager } from "@next/third-parties/google"
import {NavBar} from "@/app/components/NavBar";
import {Footer} from "@/app/components/Footer";
import Adsense from "@/app/components/Adsense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helpful Money | Financial Tools and Resources",
  description: "Discover financial tools, calculators, and resources to help you make better decisions with your money. Learn about investing, budgeting, and financial planning.",
  keywords: ["money management", "financial tools", "budgeting", "investing", "personal finance", "financial planning"],
  authors: [{ name: "Helpful Money Team" }],
  creator: "Helpful Money",
  publisher: "Helpful Money",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://www.helpfulmoney.site"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Helpful Money | Financial Tools and Resources",
    description: "Discover financial tools, calculators, and resources to help you make better decisions with your money.",
    url: "https://www.helpfulmoney.site",
    siteName: "Helpful Money",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helpful Money | Financial Tools and Resources",
    description: "Discover financial tools, calculators, and resources to help you make better decisions with your money.",
    creator: "@helpfulmoney",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <Adsense />
    </head>
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <NavBar/>
    <div className='h-10'></div>
    {children}
    <Footer/>
    <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
    </body>
    </html>
  );
}
