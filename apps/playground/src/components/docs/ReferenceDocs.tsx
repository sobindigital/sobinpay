/**
 * @file SobinPay Documentation - TypeScript Enums & Error Reference
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

export function ReferenceDocs() {
  return (
    <div className="space-y-16">
      {/* 1. TypeScript Enums */}
      <section id="reference-enums" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Reference</Badge>
          <Badge variant="blue">Strict TypeScript</Badge>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          TypeScript Enums & Constants
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          SobinPay ships 100% strict TypeScript types and enums for compile-time safety and IDE autocompletion.
        </p>

        {/* AbaPaymentStatus Table */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-200">
            AbaPaymentStatus
          </h3>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Enum Member</th>
                  <th className="px-4 py-2.5">String Value</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 text-emerald-400 font-bold">APPROVED</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;APPROVED&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Payment completed and settled successfully</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-amber-400 font-bold">PENDING</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;PENDING&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Awaiting customer scan or approval</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">PRE_AUTH</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;PRE-AUTH&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Funds authorized / held on card</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-rose-400 font-bold">DECLINED</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;DECLINED&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Payment declined by bank or insufficient funds</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-400 font-bold">CANCELLED</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;CANCELLED&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Customer cancelled or session closed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-purple-400 font-bold">REFUNDED</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;REFUNDED&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Transaction has been refunded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AbaPaymentOption Table */}
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-semibold text-slate-200">
            AbaPaymentOption
          </h3>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Enum Member</th>
                  <th className="px-4 py-2.5">Value</th>
                  <th className="px-4 py-2.5">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">ABAPAY_KHQR</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;abapay_khqr&quot;</td>
                  <td className="px-4 py-2.5 font-sans">ABA Pay + National Bakong KHQR</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">ABAPAY_KHQR_DEEPLINK</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;abapay_khqr_deeplink&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Mobile deeplink directly launching ABA Mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">CARDS</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;cards&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Visa, Mastercard, JCB, and UnionPay</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">ALIPAY</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;alipay&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Alipay Global</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">WECHAT</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;wechat&quot;</td>
                  <td className="px-4 py-2.5 font-sans">WeChat Pay</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-blue-400 font-bold">GOOGLE_PAY</td>
                  <td className="px-4 py-2.5 text-slate-400">&quot;google_pay&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Google Pay Mobile Wallet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AbaStatusCode */}
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-semibold text-slate-200">
            AbaStatusCode (Gateway Status Codes)
          </h3>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Code</th>
                  <th className="px-4 py-2.5">Meaning</th>
                  <th className="px-4 py-2.5">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 text-emerald-400 font-bold">&quot;00&quot;</td>
                  <td className="px-4 py-2.5 font-sans font-semibold text-emerald-400">Success</td>
                  <td className="px-4 py-2.5 font-sans">Request processed successfully</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-rose-400 font-bold">&quot;1&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Invalid Hash</td>
                  <td className="px-4 py-2.5 font-sans">Verify your API key matches the merchant ID</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-rose-400 font-bold">&quot;2&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Invalid Parameters</td>
                  <td className="px-4 py-2.5 font-sans">Check required fields, amount decimals, and URLs</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-amber-400 font-bold">&quot;5&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Transaction Not Found</td>
                  <td className="px-4 py-2.5 font-sans">Transaction ID does not exist in gateway records</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-rose-400 font-bold">&quot;26&quot;</td>
                  <td className="px-4 py-2.5 font-sans">Invalid Merchant</td>
                  <td className="px-4 py-2.5 font-sans">Merchant account inactive or unwhitelisted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Error Handling */}
      <section id="reference-errors" className="scroll-mt-24 space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="rose">Defensive Engineering</Badge>
          <Badge variant="blue">Error Hierarchy</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Error Handling & Hierarchy
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          SobinPay errors inherit from the native JavaScript <code>Error</code> class and include typed machine-readable error codes.
        </p>

        <CodeBlock
          language="typescript"
          title="Safe Error Handling Pattern"
          showLineNumbers
          code={`import { SobinPay, SobinPayError, ProviderApiError } from "@sobindigital/pay";

try {
  const status = await sobin.aba.checkTransaction(tranId);
} catch (err: unknown) {
  if (err instanceof ProviderApiError) {
    console.error("Gateway HTTP Status:", err.statusCode);
    console.error("Gateway Message:", err.message);
  } else if (err instanceof SobinPayError) {
    console.error("SobinPay Code:", err.code); // e.g. "INVALID_TRANSACTION_ID"
  } else {
    console.error("Unexpected error:", err);
  }
}`}
        />
      </section>
    </div>
  );
}

