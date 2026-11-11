/**
 * @file SobinPay Documentation - Overview & Core Concepts
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

import React from "react";
import { CodeBlock } from "../CodeBlock";
import { Badge } from "../Badge";
import { ShieldCheck, Cpu, Layers, Scale, AlertTriangle } from "lucide-react";

export function OverviewDocs() {
  return (
    <div className="space-y-16">
      {/* 1. Introduction */}
      <section id="overview-intro" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="blue">Developer Guide</Badge>
          <Badge variant="emerald">Enterprise Tier-1</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SobinPay Documentation
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          <strong>SobinPay</strong> is an enterprise-grade TypeScript payment gateway SDK for Cambodia engineered by <strong>Sobin Digital</strong>. It delivers a unified, zero-dependency, type-safe interface for <strong>ABA PayWay</strong> and National Bank of Cambodia’s <strong>Bakong KHQR</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Zero Dependencies</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No bloated HTTP or crypto libraries. Relies strictly on native Node.js 18+ runtime APIs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Timing-Safe Security</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Constant-time HMAC-SHA512 verification and 2048-bit RSA encryption to prevent side-channel timing attacks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Dual ESM + CJS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-compiled with dual modern ESM and CommonJS bundles with complete TypeScript <code>.d.ts</code> declarations.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Installation */}
      <section id="overview-install" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Installation
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Install the main unified facade package <code className="text-blue-300 font-mono">@sobin/pay</code> using your preferred package manager:
        </p>

        <CodeBlock code="npm install @sobin/pay" packageTabs packageCommand="@sobin/pay" />

        <div className="text-xs text-slate-400 space-y-2">
          <p>
            Alternatively, if you only need a specific provider, you can install individual scoped packages:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-slate-300">
            <li><code>@sobin/provider-payway</code> — Dedicated ABA PayWay client</li>
            <li><code>@sobin/provider-khqr</code> — Dedicated Bakong KHQR generator & parser</li>
            <li><code>@sobin/core</code> — Shared types, money math, and crypto primitives</li>
          </ul>
        </div>
      </section>

      {/* 3. Architecture & Multi-Provider Design */}
      <section id="overview-architecture" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Architecture & Multi-Provider Design
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          SobinPay is structured as an enterprise TypeScript monorepo with high separation of concerns:
        </p>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="font-mono text-xs text-slate-300 space-y-2">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-purple-400 font-bold">@sobin/pay</span> (Unified Facade)
              <p className="text-slate-400 text-[11px] mt-1 font-sans">
                Unified developer entrypoint providing <code>sobin.aba.*</code>, <code>sobin.abapay.*</code>, and <code>SobinPay.khqr.*</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-slate-800">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-blue-400 font-bold">@sobin/provider-payway</span>
                <p className="text-slate-400 text-[11px] mt-1 font-sans">
                  Implements ABA PayWay REST & Web checkout APIs, HMAC-SHA512 hashing, status checks, close transaction, exchange rates, and RSA refunds.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">@sobin/provider-khqr</span>
                <p className="text-slate-400 text-[11px] mt-1 font-sans">
                  Implements National Bank of Cambodia EMVCo KHQR specifications, Tag-Length-Value parsing, 16-bit CRC-CCITT calculation, and deep links.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 ml-4">
              <span className="text-amber-400 font-bold">@sobin/core</span> (Shared Foundation)
              <p className="text-slate-400 text-[11px] mt-1 font-sans">
                Shared type contracts, error hierarchy (<code>SobinPayError</code>, <code>ProviderApiError</code>), timing-safe crypto, and safe money math.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Concepts */}
      <section id="overview-concepts" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Core Concepts & Financial Safety
        </h2>

        {/* Precision Safety */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            1. Zero Floating-Point Precision Loss
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Standard JavaScript floating-point numbers can cause subtle precision errors (e.g. <code>0.1 + 0.2 === 0.30000000000000004</code>). In financial transaction processing, even a 1-cent discrepancy results in cryptographic hash mismatches and rejected payments.
          </p>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Automated Decimal Sanitization
            </div>
            <p className="text-amber-200/80">
              SobinPay automatically normalizes amounts according to currency rules: USD amounts are formatted strictly with 2 fixed decimal places (e.g. <code>12.50</code>), while KHR amounts are rounded to integer units (e.g. <code>50000</code>).
            </p>
          </div>
        </div>

        {/* Timing-Safe Crypto */}
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            2. Timing-Safe Cryptographic Comparisons
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Comparing webhook signatures with standard string equality (<code>a === b</code>) leaks byte-by-byte comparison timing, allowing remote attackers to deduce valid cryptographic digests through side-channel attacks. SobinPay always uses Node’s <code>crypto.timingSafeEqual</code> for signature validation.
          </p>
          <CodeBlock
            language="typescript"
            title="Constant-Time Signature Check"
            code={`import { timingSafeEqualString } from "@sobin/pay";

// Safely compares received signature without timing leakage
const isValid = timingSafeEqualString(receivedSignature, computedSignature);`}
          />
        </div>
      </section>
    </div>
  );
}

