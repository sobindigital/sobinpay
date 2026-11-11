/**
 * @file SobinPay Documentation - Bakong KHQR Provider Guide
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
import { QrCode, Smartphone, CheckCircle2 } from "lucide-react";

export function KhqrDocs() {
  return (
    <div className="space-y-16">
      {/* 1. Individual QR */}
      <section id="khqr-individual" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Bakong KHQR</Badge>
          <Badge variant="blue">Individual (Tag 29)</Badge>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Individual EMVCo KHQR Generation
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Generate standard National Bank of Cambodia EMVCo QR codes for individual Bakong account IDs (e.g. <code>username@bank</code> or phone number accounts).
        </p>

        <CodeBlock
          language="typescript"
          title="Generate Individual KHQR"
          showLineNumbers
          code={`import { SobinPay } from "@sobindigital/pay";

// Generate a Dynamic Individual KHQR (with specified amount & invoice)
const qrString = SobinPay.khqr.generateIndividual({
  bakongAccountId: "sobin_digital@aclb", // Recipient Bakong Account ID
  merchantName: "Sobin Digital",        // Payee display name (max 25 chars)
  merchantCity: "Phnom Penh",           // Operational city (default: Phnom Penh)
  amount: 15.50,                        // Amount (USD or KHR)
  currency: "USD",                      // "USD" (code 840) or "KHR" (code 116)
  billNumber: "INV-2026-001",           // Optional invoice number (Tag 62)
});

console.log(qrString);
// Output: 00020101021229300018sobin_digital@aclb520459995303840540515.505802KH5913Sobin Digital6010Phnom Penh62160112INV-2026-0016304...`}
        />

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <span className="font-semibold text-slate-200 block">
            Static vs Dynamic QR:
          </span>
          <p>
            If you omit the <code className="text-blue-300 font-mono">amount</code> parameter, SobinPay automatically generates a <strong>Static QR</strong> (Point of Initiation Tag 01 = &quot;11&quot;), allowing the payer to enter any custom amount in their banking app. When <code className="text-blue-300 font-mono">amount</code> is provided, it generates a <strong>Dynamic QR</strong> (Tag 01 = &quot;12&quot;).
          </p>
        </div>
      </section>

      {/* 2. Merchant QR */}
      <section id="khqr-merchant" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Bakong KHQR</Badge>
          <Badge variant="purple">Merchant (Tag 30)</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Merchant EMVCo KHQR Generation
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          For registered commercial businesses and organizations, generate merchant QR codes with acquiring bank credentials, merchant IDs, and store/terminal identifiers (EMVCo Tag 30 structure).
        </p>

        <CodeBlock
          language="typescript"
          title="Generate Merchant KHQR"
          showLineNumbers
          code={`const merchantQr = SobinPay.khqr.generateMerchant({
  bakongAccountId: "sobin_digital@aclb",
  merchantId: "000000001",               // Acquiring Bank Merchant ID
  acquiringBank: "Bakong Bank",          // Acquiring Bank Name
  merchantName: "Sobin Digital Store",
  merchantCity: "Phnom Penh",
  amount: 60000,
  currency: "KHR",
  billNumber: "ORD-9912",
  storeLabel: "Central Branch",
  terminalLabel: "POS-03",
});`}
        />
      </section>

      {/* 3. KHQR Parser & CRC16 */}
      <section id="khqr-parser-crc16" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="blue">Parser</Badge>
          <Badge variant="emerald">CRC-16/CCITT</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          KHQR Parser & CRC-16 Validation (parse)
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Parse any incoming or scanned KHQR string into structured JavaScript objects and automatically verify the 16-bit CRC checksum (polynomial <code>0x1021</code>, initial value <code>0xFFFF</code>).
        </p>

        <CodeBlock
          language="typescript"
          title="Parse & Validate KHQR"
          showLineNumbers
          code={`const parsed = SobinPay.khqr.parse(qrString);

if (!parsed.isValid) {
  throw new Error("Invalid KHQR string or CRC16 checksum mismatch!");
}

console.log("Account ID:", parsed.bakongAccountId); // e.g. "sobin_digital@aclb"
console.log("Payee Name:", parsed.merchantName);    // e.g. "Sobin Digital"
console.log("Amount:", parsed.amount);              // e.g. 15.5
console.log("Currency:", parsed.currency);          // "USD" or "KHR"
console.log("CRC:", parsed.crc);                    // e.g. "E5F2"
console.log("All EMVCo Tags:", parsed.tags);        // { "00": "01", "01": "12", ... }`}
        />
      </section>

      {/* 4. Universal Deeplinks */}
      <section id="khqr-deeplinks" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Mobile App</Badge>
          <Badge variant="blue">Universal Deeplink</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Bakong Universal Deeplinks (deeplink)
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Generate universal deep links that seamlessly open installed banking applications on iOS and Android devices, prompting users directly to the confirmation screen.
        </p>

        <CodeBlock
          language="typescript"
          title="Generate Mobile Deeplink"
          code={`const deeplink = SobinPay.khqr.deeplink(qrString);

// Returns:
// "https://bakong.nbc.org.kh/deeplink?qr=000201010212..."
// Or native scheme: "bakong://qr?data=000201010212..."`}
        />

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-sky-400" />
            Cross-Bank Interoperability
          </span>
          <p>
            Because Bakong KHQR is Cambodia’s national standard, this deep link and QR code works across all major Cambodian banking applications: <strong>ABA Mobile</strong>, <strong>ACLEDA mobile</strong>, <strong>Wing Bank</strong>, <strong>Canadia Bank</strong>, <strong>Sathapana</strong>, and <strong>Chip Mong Bank</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}

