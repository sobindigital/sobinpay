/**
 * @file SobinPay Documentation - Search Index & Navigation Metadata
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

export interface NavSection {
  title: string;
  items: Array<{
    id: string;
    title: string;
    badge?: string;
    badgeColor?: "blue" | "emerald" | "amber" | "purple";
  }>;
}

export const DOCS_NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { id: "overview-intro", title: "Introduction" },
      { id: "overview-install", title: "Installation" },
      { id: "overview-architecture", title: "Architecture & Design", badge: "Monorepo" },
      { id: "overview-concepts", title: "Core Concepts", badge: "Zero-Loss" },
    ],
  },
  {
    title: "ABA PayWay Gateway",
    items: [
      { id: "payway-quickstart", title: "Quickstart & Setup" },
      { id: "payway-checkout", title: "Web Checkout (Popup & Hosted)", badge: "v2.0" },
      { id: "payway-direct-khqr", title: "Direct KHQR & Deeplinks" },
      { id: "payway-check-transaction", title: "Transaction Status Check" },
      { id: "payway-transaction-detail", title: "Transaction Details" },
      { id: "payway-close-transaction", title: "Cancel / Close Transaction" },
      { id: "payway-exchange-rates", title: "Real-time Exchange Rates" },
      { id: "payway-webhooks", title: "Webhook Verification (HMAC-SHA512)", badge: "Security" },
      { id: "payway-refunds", title: "Full & Partial Refunds (RSA)", badge: "Enterprise" },
    ],
  },
  {
    title: "Bakong KHQR Engine",
    items: [
      { id: "khqr-individual", title: "Individual EMVCo QR" },
      { id: "khqr-merchant", title: "Merchant EMVCo QR" },
      { id: "khqr-parser-crc16", title: "KHQR Parser & CRC-16 Validation", badge: "CCITT" },
      { id: "khqr-deeplinks", title: "Bakong Universal Deeplinks" },
    ],
  },
  {
    title: "Reference & Integrations",
    items: [
      { id: "reference-enums", title: "TypeScript Enums" },
      { id: "reference-errors", title: "Error Handling & Hierarchy" },
      { id: "recipe-nextjs", title: "Next.js App Router Recipe", badge: "Recipe" },
      { id: "recipe-express", title: "Express.js Recipe", badge: "Recipe" },
      { id: "recipe-nestjs", title: "NestJS Recipe", badge: "Recipe" },
      { id: "reference-faq", title: "Frequently Asked Questions", badge: "AEO" },
    ],
  },
  {
    title: "Interactive Developer Tools",
    items: [
      { id: "interactive-tester", title: "Live Sandbox & QR Tester", badge: "Live" },
      { id: "interactive-webhook-debugger", title: "Webhook Signature Debugger", badge: "Tool" },
      { id: "interactive-khqr-inspector", title: "EMVCo KHQR Tag Inspector", badge: "Tool" },
    ],
  },
];

export interface SearchEntry {
  id: string;
  title: string;
  section: string;
  description: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchEntry[] = [
  {
    id: "overview-intro",
    title: "Introduction to SobinPay",
    section: "Overview",
    description: "Enterprise-grade multi-provider payment gateway SDK for Cambodia by Sobin Digital.",
    keywords: ["sobinpay", "cambodia", "sdk", "gateway", "aba", "bakong", "khqr"],
  },
  {
    id: "overview-install",
    title: "Installation & Dual ESM/CJS",
    section: "Overview",
    description: "Install @sobindigital/pay via npm, pnpm, yarn, or bun with zero external dependencies.",
    keywords: ["install", "npm", "pnpm", "yarn", "bun", "esm", "cjs"],
  },
  {
    id: "overview-architecture",
    title: "Monorepo Architecture & Multi-Provider Design",
    section: "Overview",
    description: "Modular architecture separating core math, ABA PayWay, and Bakong KHQR into independent packages.",
    keywords: ["architecture", "monorepo", "core", "provider", "facade"],
  },
  {
    id: "overview-concepts",
    title: "Core Concepts (Precision Math & Timing-Safe Crypto)",
    section: "Overview",
    description: "Deterministic financial math avoiding IEEE-754 floating point errors and timing-safe comparison.",
    keywords: ["math", "floating point", "precision", "crypto", "timing safe", "security"],
  },
  {
    id: "payway-quickstart",
    title: "ABA PayWay Quickstart",
    section: "ABA PayWay",
    description: "Initialize PayWay client with merchantId, apiKey, and optional sandbox apiUrl.",
    keywords: ["quickstart", "client", "merchantid", "apikey", "sandbox", "payway"],
  },
  {
    id: "payway-checkout",
    title: "Web Checkout (Popup & Hosted) - createPurchase",
    section: "ABA PayWay",
    description: "Generate cryptographically signed purchase payload and form for popup or hosted checkout.",
    keywords: ["createpurchase", "popup", "hosted", "checkout", "form", "signature"],
  },
  {
    id: "payway-direct-khqr",
    title: "Direct KHQR & Deeplink - createQR",
    section: "ABA PayWay",
    description: "Generate server-to-server dynamic ABA PayWay KHQR strings and mobile app deeplinks.",
    keywords: ["createqr", "generateqr", "direct khqr", "deeplink", "rest api"],
  },
  {
    id: "payway-check-transaction",
    title: "Transaction Status Check - checkTransaction",
    section: "ABA PayWay",
    description: "Query real-time payment status (APPROVED, PENDING, DECLINED, CANCELLED) via check-transaction-2.",
    keywords: ["checktransaction", "status", "approved", "pending", "declined"],
  },
  {
    id: "payway-transaction-detail",
    title: "Transaction Details - getTransactionDetail",
    section: "ABA PayWay",
    description: "Retrieve comprehensive audit logs, bank references, card details, and timestamps.",
    keywords: ["gettransactiondetail", "audit", "bankref", "card", "details"],
  },
  {
    id: "payway-close-transaction",
    title: "Cancel / Close Transaction - closeTransaction",
    section: "ABA PayWay",
    description: "Close or void an unpaid or expired transaction on the ABA PayWay gateway.",
    keywords: ["closetransaction", "cancel", "void", "expire"],
  },
  {
    id: "payway-exchange-rates",
    title: "Live Exchange Rates - getExchangeRate",
    section: "ABA PayWay",
    description: "Query official ABA Bank USD to KHR currency conversion rates.",
    keywords: ["exchange rate", "currency", "usd", "khr", "conversion"],
  },
  {
    id: "payway-webhooks",
    title: "Webhook Verification - verifyWebhook",
    section: "ABA PayWay",
    description: "Verify cryptographic HMAC-SHA512 authenticity of server-to-server pushbacks with timing-safe checks.",
    keywords: ["verifywebhook", "hmac", "sha512", "webhook", "pushback", "callback"],
  },
  {
    id: "payway-refunds",
    title: "Full & Partial Refunds - refundTransaction",
    section: "ABA PayWay",
    description: "Execute programmatic full or partial refunds encrypted using 2048-bit RSA-SHA512.",
    keywords: ["refund", "rsa", "refundtransaction", "partial refund"],
  },
  {
    id: "khqr-individual",
    title: "Individual EMVCo QR - generateIndividual",
    section: "Bakong KHQR",
    description: "Generate static or dynamic EMVCo-compliant QR codes for individual Bakong account IDs.",
    keywords: ["generateindividual", "individual", "bakong", "emvco", "tag 29"],
  },
  {
    id: "khqr-merchant",
    title: "Merchant EMVCo QR - generateMerchant",
    section: "Bakong KHQR",
    description: "Generate merchant EMVCo QR codes with acquiring bank, merchant ID, and Tag 30 structure.",
    keywords: ["generatemerchant", "merchant", "tag 30", "acquiring bank"],
  },
  {
    id: "khqr-parser-crc16",
    title: "KHQR Parser & CRC16 Validation - parse",
    section: "Bakong KHQR",
    description: "Parse Tag-Length-Value (TLV) EMVCo string and validate 16-bit CRC-CCITT checksum.",
    keywords: ["parse", "parser", "crc16", "crc", "ccitt", "tlv", "validation"],
  },
  {
    id: "khqr-deeplinks",
    title: "Bakong Universal Deeplinks - deeplink",
    section: "Bakong KHQR",
    description: "Generate bakong:// mobile app deep links that automatically launch user banking apps.",
    keywords: ["deeplink", "bakong://", "mobile", "app", "redirect"],
  },
  {
    id: "reference-enums",
    title: "TypeScript Enums & Constants",
    section: "Reference",
    description: "Complete list of AbaPaymentStatus, AbaPaymentOption, AbaStatusCode, and AbaViewType enums.",
    keywords: ["enums", "abapaymentstatus", "abapaymentoption", "abastatuscode", "types"],
  },
  {
    id: "reference-errors",
    title: "Error Handling & SobinPayError Hierarchy",
    section: "Reference",
    description: "SobinPayError, ProviderApiError, CryptoError, and error code references.",
    keywords: ["errors", "sobinpayerror", "providerapierror", "try catch", "exception"],
  },
  {
    id: "recipe-nextjs",
    title: "Next.js App Router & Server Actions Recipe",
    section: "Recipes",
    description: "Production implementation for Next.js 14/15/16 with Server Actions and Route Handlers.",
    keywords: ["next.js", "server actions", "route handler", "app router", "react"],
  },
  {
    id: "recipe-express",
    title: "Express.js Integration Recipe",
    section: "Recipes",
    description: "REST API endpoints and raw body pushback webhook verification in Express.",
    keywords: ["express", "node", "rest", "backend"],
  },
  {
    id: "recipe-nestjs",
    title: "NestJS Module & HMAC Guard Recipe",
    section: "Recipes",
    description: "Enterprise NestJS injection service and custom WebhookGuard for SobinPay.",
    keywords: ["nestjs", "guard", "service", "module", "typescript"],
  },
  {
    id: "reference-faq",
    title: "Frequently Asked Questions (FAQ)",
    section: "Reference",
    description: "Detailed answers on security, timing attacks, BigInt precision, Bakong KHQR, and comparisons with legacy packages.",
    keywords: ["faq", "questions", "security", "timing attack", "bigint", "aba-payway", "comparison", "license"],
  },
  {
    id: "interactive-tester",
    title: "Live Sandbox & QR Tester",
    section: "Developer Tools",
    description: "Real-time sandbox tester for ABA PayWay Popup, Direct QR, and Bakong KHQR.",
    keywords: ["sandbox", "tester", "live", "qr code", "popup", "interactive"],
  },
  {
    id: "interactive-webhook-debugger",
    title: "Webhook Signature Debugger",
    section: "Developer Tools",
    description: "Test HMAC-SHA512 calculation, inspect canonical string, and verify signatures.",
    keywords: ["webhook debugger", "hmac verifier", "signature test", "tool"],
  },
  {
    id: "interactive-khqr-inspector",
    title: "EMVCo KHQR Tag Inspector",
    section: "Developer Tools",
    description: "Paste any Bakong KHQR code to inspect all TLV tags and verify CRC16 checksum.",
    keywords: ["khqr inspector", "emvco inspector", "tlv tags", "crc test"],
  },
];

