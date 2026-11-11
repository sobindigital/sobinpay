/**
 * @file SobinPay Documentation Portal - Root Layout
 * @author Sobin Digital
 * @license MIT
 *
 * @contact
 *   - Company: Sobin Digital
 *   - Telegram: https://t.me/sobindigital
 *   - TikTok: https://www.tiktok.com/@sobindigital
 *
 * Copyright (c) 2026 Sobin Digital. All rights reserved.
 */

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SobinPay — Enterprise Developer Documentation & Portal",
  description:
    "Enterprise-grade multi-provider payment gateway SDK for Cambodia (ABA PayWay & Bakong KHQR) engineered by Sobin Digital.",
  keywords: [
    "SobinPay",
    "Sobin Digital",
    "Cambodia payment gateway",
    "ABA PayWay",
    "Bakong KHQR",
    "EMVCo",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "Sobin Digital", url: "https://t.me/sobindigital" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* jQuery - Required by ABA PayWay SDK */}
        <Script
          strategy="beforeInteractive"
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        />
        {/* ABA PayWay SDK (Sandbox & Production) */}
        <Script
          strategy="afterInteractive"
          src="https://checkout-sandbox.payway.com.kh/plugins/checkout2-0.js"
        />
        <Script
          strategy="afterInteractive"
          src="https://checkout.payway.com.kh/plugins/checkout2-0.js"
        />
      </head>
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
