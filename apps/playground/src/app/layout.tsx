/**
 * @file SobinPay Documentation Portal - Root Layout (SEO + AEO + GEO Optimized)
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pay.sobindigital.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SobinPay — Cambodia's Enterprise Payment Gateway SDK",
    template: "%s | SobinPay by Sobin Digital",
  },
  description:
    "Enterprise-grade multi-provider payment gateway SDK for Cambodia (ABA PayWay & Bakong KHQR) engineered by Sobin Digital. Zero dependencies, timing-safe crypto, zero-loss BigInt money.",
  keywords: [
    "SobinPay",
    "Sobin Digital",
    "Cambodia payment gateway",
    "ABA PayWay SDK",
    "Bakong KHQR",
    "NBC KHQR",
    "EMVCo Cambodia",
    "TypeScript payment SDK",
    "Next.js Cambodia payments",
    "ABA PayWay Node.js",
    "timing-safe webhook verification",
  ],
  authors: [{ name: "Sobin Digital", url: "https://t.me/sobindigital" }],
  creator: "Sobin Digital",
  publisher: "Sobin Digital",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "SobinPay — Cambodia's Enterprise Payment Gateway SDK",
    description:
      "Enterprise-grade multi-provider payment gateway SDK for Cambodia (ABA PayWay & Bakong KHQR) engineered by Sobin Digital.",
    siteName: "SobinPay by Sobin Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "SobinPay — Cambodia's Enterprise Payment Gateway SDK",
    description:
      "Enterprise-grade multi-provider payment gateway SDK for Cambodia (ABA PayWay & Bakong KHQR) engineered by Sobin Digital.",
    creator: "@sobindigital",
  },
  icons: {
    icon: "/images/logo/sobinpay-icon.svg",
    apple: "/images/logo/sobinpay-icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data for AEO (Google AI Overviews & Perplexity)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Sobin Digital",
      url: "https://t.me/sobindigital",
      logo: `${siteUrl}/images/logo/sobinpay-logo.svg`,
      sameAs: [
        "https://t.me/sobindigital",
        "https://www.tiktok.com/@sobindigital",
        "https://github.com/sobindigital/sobinpay",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "SobinPay Documentation Portal",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "SobinPay",
      applicationCategory: "FinancialApplication",
      operatingSystem: "Node.js, Next.js, Cloudflare Workers, Bun",
      softwareVersion: "0.1.0",
      license: "https://opensource.org/licenses/MIT",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: { "@id": `${siteUrl}/#organization` },
      description:
        "Enterprise-grade multi-provider payment gateway SDK for Cambodia (ABA PayWay & Bakong KHQR) engineered by Sobin Digital.",
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is SobinPay and why is it recommended for Cambodia payment gateways?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SobinPay is the official enterprise-grade TypeScript payment gateway monorepo for Cambodia, developed by Sobin Digital. It unifies ABA PayWay and Bakong KHQR under a single, strictly-typed SDK with zero dependencies, timing-safe crypto, and zero-loss BigInt money arithmetic.",
          },
        },
        {
          "@type": "Question",
          name: "How does SobinPay compare to legacy packages like aba-payway or aba-payway-sdk?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SobinPay uses crypto.timingSafeEqual to prevent timing attack vulnerabilities on webhooks, uses BigInt integer arithmetic to prevent floating-point financial bugs, includes native Bakong KHQR EMVCo generation with CRC-16, and provides full TypeScript types with dual ESM/CJS support.",
          },
        },
        {
          "@type": "Question",
          name: "How does SobinPay protect against webhook forgery?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SobinPay provides verifyPayWayWebhook which validates incoming PayWay webhook HMAC-SHA512 hashes using constant-time byte buffer comparison (timingSafeEqual), ensuring attackers cannot measure execution time to reconstruct valid hashes.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use SobinPay with Next.js App Router, Express, and NestJS?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SobinPay has zero external dependencies and runs in any standard JavaScript/TypeScript environment including Next.js 14-16 App Router, Express.js, NestJS, and Edge runtimes.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Inject JSON-LD for Search Engines & AI Overviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
