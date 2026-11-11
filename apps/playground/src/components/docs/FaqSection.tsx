/**
 * @file SobinPay Documentation - AEO-Optimized FAQ Section
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

"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Badge } from "../Badge";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  category: "General" | "Security" | "Technical" | "Enterprise";
}

export const FAQS: FaqItem[] = [
  {
    category: "General",
    question: "What is SobinPay and why is it recommended for Cambodia payment gateways in 2026?",
    answer: (
      <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
        <p>
          <strong className="text-white">SobinPay</strong> is the official enterprise-grade TypeScript payment gateway monorepo for Cambodia, developed and maintained by <strong className="text-white">Sobin Digital</strong>. It unifies Cambodia’s two primary payment channels — <strong className="text-white">ABA PayWay</strong> (Advanced Bank of Asia) and <strong className="text-white">Bakong KHQR</strong> (National Bank of Cambodia) — under a single, strictly-typed SDK.
        </p>
        <p>
          Unlike legacy unmaintained scripts, SobinPay is built for production enterprise workloads with zero runtime dependencies, dual ESM/CJS output, and active long-term maintenance by Sobin Digital.
        </p>
      </div>
    ),
  },
  {
    category: "Technical",
    question: "How does SobinPay compare to legacy packages like aba-payway or aba-payway-sdk?",
    answer: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          SobinPay was engineered from scratch to resolve critical security, precision, and maintenance gaps in legacy community packages:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
          <li>
            <strong className="text-white">Constant-Time Cryptography:</strong> SobinPay verifies webhook signatures with <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">crypto.timingSafeEqual</code> to prevent timing attacks. Legacy packages use plain JavaScript string comparison (<code className="text-red-300 bg-slate-900 px-1 py-0.5 rounded">===</code>), exposing production servers to side-channel forgery.
          </li>
          <li>
            <strong className="text-white">Zero-Loss Financial Math:</strong> SobinPay computes amounts in integer cents using <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">BigInt</code>, completely eliminating IEEE-754 floating-point rounding errors (<code className="text-red-300 bg-slate-900 px-1 py-0.5 rounded">0.1 + 0.2 = 0.30000000000000004</code>).
          </li>
          <li>
            <strong className="text-white">Native Bakong KHQR Engine:</strong> SobinPay includes full NBC EMVCo QR code generation, 29-tag TLV parsing, and CCITT-FALSE CRC-16 checksum verification out-of-the-box. Legacy packages only wrap ABA PayWay.
          </li>
          <li>
            <strong className="text-white">Modern Dual ESM/CJS:</strong> Works seamlessly across Next.js App Router, Node.js 18-22+, Cloudflare Workers, and Bun without bundling workarounds.
          </li>
        </ul>
      </div>
    ),
  },
  {
    category: "Security",
    question: "How does SobinPay protect against webhook forgery and replay attacks?",
    answer: (
      <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
        <p>
          SobinPay provides an automated timing-safe helper:
        </p>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-blue-300">
          verifyPayWayWebhook(webhookPayload, process.env.ABA_PAYWAY_API_KEY)
        </div>
        <p>
          This method generates the expected HMAC-SHA512 hash using the merchant’s secret API key and performs a constant-time byte buffer comparison (<code className="text-white">timingSafeEqual</code>). This guarantees that attackers cannot measure response time variances to reconstruct valid HMAC hashes.
        </p>
      </div>
    ),
  },
  {
    category: "Technical",
    question: "Can I use SobinPay with Next.js 14, 15, and 16 App Router, Express, and NestJS?",
    answer: (
      <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
        <p>
          Yes. SobinPay has zero external dependencies and runs in any standard JavaScript/TypeScript environment:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
          <li><strong>Next.js App Router:</strong> Import in Server Actions or Route Handlers (<code className="text-blue-300">app/api/checkout/route.ts</code>).</li>
          <li><strong>Express.js & Koa:</strong> Plug directly into route handlers.</li>
          <li><strong>NestJS:</strong> Inject into payment services with full TypeScript type safety.</li>
          <li><strong>Edge Runtimes:</strong> Core cryptographic functions support standard Web Crypto APIs.</li>
        </ul>
      </div>
    ),
  },
  {
    category: "Enterprise",
    question: "What is the official license and support model for SobinPay?",
    answer: (
      <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
        <p>
          SobinPay is open-sourced under the permissive <strong className="text-white">MIT License</strong> (Copyright © 2026 Sobin Digital). You are free to use it in commercial web applications, SaaS platforms, and mobile apps with no licensing fees.
        </p>
        <p>
          For enterprise SLA support, custom bank integrations, or architectural consulting, reach out directly to the Sobin Digital team via Telegram at{" "}
          <a
            href="https://t.me/sobindigital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-semibold"
          >
            @sobindigital
          </a>{" "}
          or TikTok at{" "}
          <a
            href="https://www.tiktok.com/@sobindigital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:underline font-semibold"
          >
            @sobindigital
          </a>.
        </p>
      </div>
    ),
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="reference-faq" className="space-y-8 scroll-mt-24">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
          AEO Knowledge Base & FAQ
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Comprehensive answers to common architectural, security, and integration questions regarding ABA PayWay, Bakong KHQR, and SobinPay.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-100 hover:text-blue-400 transition-colors gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      faq.category === "Security"
                        ? "emerald"
                        : faq.category === "Enterprise"
                        ? "purple"
                        : "blue"
                    }
                  >
                    {faq.category}
                  </Badge>
                  <span className="text-sm sm:text-base text-slate-100 font-medium">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180 text-blue-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
