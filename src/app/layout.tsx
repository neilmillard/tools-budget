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
  title: "Helpful Money, Tools",
  description: "What to do with your Money?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <meta property="og:title" content="Helpful Money" />
      <meta property="og:description" content="Helpful Money" />
      <meta property="og:url" content="https://www.helpful-money.com" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Helpful Money" />
      <title>Helpful Money</title>
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
