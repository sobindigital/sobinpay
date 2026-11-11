# @sobindigital/pay ⚡️

> Enterprise-Grade Multi-Provider Payment Gateway SDK for Cambodia (ABA PayWay v2.0 & NBC Bakong KHQR EMVCo). Engineered by **Sobin Digital**.

[![npm version](https://img.shields.io/npm/v/@sobindigital/pay.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@sobindigital/pay)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_100%25-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.9.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0_Runtime-blueviolet.svg?style=flat-square)](https://www.npmjs.com/package/@sobindigital/pay)
[![NBC Bakong KHQR](https://img.shields.io/badge/Bakong_KHQR-EMVCo_Standard-red.svg?style=flat-square)](https://bakong.nbc.org.kh)
[![Sobin Digital](https://img.shields.io/badge/Engineered_by-Sobin_Digital-orange.svg?style=flat-square)](https://t.me/sobindigital)

---

## 🚀 Key Features

### 🏦 ABA PayWay Gateway Integration
- ✅ **Web Purchase (Checkout Page)**: Both Popup and Hosted Redirect views.
- ✅ **Direct KHQR Code Generation**: Real-time QR string, base64 QR image, and dynamic ABA mobile app deeplinks.
- ✅ **Transaction Status Check**: Fast polling endpoint for transaction resolution.
- ✅ **Transaction Details**: Detailed payment records, card brands, approval codes, and bank references.
- ✅ **Transaction List**: Paginated and filtered transaction inquiries.
- ✅ **Transaction Cancellation**: Clean `closeTransaction` mechanism for expired/abandoned sessions.
- ✅ **Real-Time Exchange Rates**: Live USD $\leftrightarrow$ KHR conversion rates from ABA.
- ✅ **RSA Refunds API**: Full and partial transaction refunds with RSA encryption.
- ✅ **Timing-Safe Webhook Verification**: Constant-time `crypto.timingSafeEqual` HMAC-SHA512 verification immune to side-channel timing attacks.

### 🇰🇭 National Bank of Cambodia (NBC) Bakong KHQR
- ✅ **Individual KHQR**: Generate person-to-person EMVCo compliant QR strings offline (no API keys required).
- ✅ **Merchant KHQR**: Static and dynamic merchant QR codes with acquiring bank, merchant ID, and bill numbers.
- ✅ **EMVCo 29-Tag Parser**: Deconstruct any KHQR string into typed Tag-Length-Value (TLV) dictionary.
- ✅ **CRC-16-CCITT Checksum Validator**: Validate checksum polynomial `0x1021` with initial value `0xFFFF`.
- ✅ **Universal Bakong Deeplinks**: Generate native deep-links for Bakong mobile wallets.

### 🛡️ Enterprise Engineering Standards
- ✅ **Zero Runtime Dependencies**: Built exclusively on native Node.js APIs (`node:crypto`, `node:https`).
- ✅ **Zero-Loss Money Math**: Computes currency in integer base units (`BigInt` cents) to eliminate floating-point rounding bugs (`0.1 + 0.2 != 0.3`).
- ✅ **Dual ESM & CommonJS**: Native support for modern ESM `import` and legacy CJS `require()`.
- ✅ **100% Strict TypeScript**: Comprehensive typings, strict null checks, and zero `any` types.
- ✅ **AI Agent Skills Included**: Built-in CLI for Cursor, Claude Code, GitHub Copilot, Windsurf, and ChatGPT.

---

## 🤖 Install AI Agent Skills (Optional)

Supercharge your development workflow! Teach your AI coding assistant (Cursor, Claude Code, Copilot) how to integrate SobinPay accurately with zero hallucinations:

```bash
# Install skill for your preferred AI agent
npx @sobindigital/pay skills add cursor

# Or install for multiple agents at once
npx @sobindigital/pay skills add cursor claude copilot windsurf codex

# Check installed skills
npx @sobindigital/pay skills list

# Verify environment & credentials
npx @sobindigital/pay doctor
```

What you get:
- ✅ Automatic prompt rules placed in `.cursor/rules/sobinpay.mdc` or `.claude/skills/sobinpay.md`
- ✅ Constant-time webhook verification best practices automatically enforced
- ✅ Production-ready Next.js, Express, and NestJS payment patterns generated on demand

---

## 🏆 Architectural Comparison

| Feature | SobinPay (`@sobindigital/pay`) | `aba-payway-sdk` (Navin) | `aba-payway` (Joselay) |
| :--- | :---: | :---: | :---: |
| **Supported Rails** | **ABA PayWay + Bakong KHQR** | ABA PayWay Only | ABA PayWay Only |
| **Maintainer** | **Sobin Digital (Enterprise)** | Individual | Individual |
| **Pushback Security** | **Constant-Time (`timingSafeEqual`)** | String equality `===` (Timing attack risky) | Loose string equality |
| **Monetary Math** | **Zero-Loss BigInt Cents** | Standard Floating Point | Standard Floating Point |
| **Bakong KHQR EMVCo** | **Full Generator + Parser + CRC16** | ❌ None | ❌ None |
| **Zero Dependencies** | **Pure Native Node.js** | ⚠️ External dependencies | ⚠️ Axios |
| **Dual ESM / CJS** | **Yes (`.js` + `.cjs` + `.d.ts`)** | Partial | Legacy CJS |
| **AI Skills CLI** | **`npx @sobindigital/pay skills`** | `npx aba-payway-sdk skills` | ❌ None |
| **License** | **Official MIT License** | MIT | MIT |

---

## 📦 Installation

```bash
# Using npm
npm install @sobindigital/pay

# Using pnpm
pnpm add @sobindigital/pay

# Using bun
bun add @sobindigital/pay

# Using yarn
yarn add @sobindigital/pay
```

---

## ⚡️ Quickstart

### 1. Initialize Client

You can use the unified `SobinPay` hub or the standalone `PayWayClient`:

```typescript
import { SobinPay, AbaPaymentOption } from "@sobindigital/pay";

const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_PAYWAY_MERCHANT_ID!,
    apiKey: process.env.ABA_PAYWAY_API_KEY!,
    apiUrl: "https://checkout-sandbox.payway.com.kh", // or https://checkout.payway.com.kh
  },
});
```

---

### 2. ABA PayWay Web Checkout (Popup or Hosted)

```typescript
const purchase = await sobin.aba.createPurchase({
  tranId: "INV-2026-001",
  amount: 25.00,
  currency: "USD",
  paymentOption: AbaPaymentOption.CARDS,
  returnUrl: "https://myshop.com/checkout/success",
  continueSuccessUrl: "https://myshop.com/orders/INV-2026-001",
  customer: {
    firstName: "Sokha",
    lastName: "Keo",
    email: "sokha@example.com",
    phone: "012345678",
  },
  items: [
    { name: "Pro Plan Subscription", quantity: 1, price: 25.00 }
  ],
});

console.log("Checkout URL:", purchase.checkoutUrl);
console.log("HTML Form:", purchase.formHtml);
```

#### `createPurchase` Parameters:
| Parameter | Type | Required | Description |
| :--- | :---: | :---: | :--- |
| `amount` | `number` | **Yes** | Transaction amount (e.g. `25.00`) |
| `currency` | `'USD' \| 'KHR'` | No | Transaction currency (default: `'USD'`) |
| `tranId` | `string` | No | Custom merchant order ID (auto-generated if omitted) |
| `paymentOption` | `AbaPaymentOption` | No | `'cards'`, `'abapay_khqr'`, `'alipay'`, `'wechat'`, `'google_pay'` |
| `viewType` | `'popup' \| 'hosted'` | No | Render mode (default: `'popup'`) |
| `returnUrl` | `string` | No | URL customer is redirected to upon cancel / back |
| `continueSuccessUrl` | `string` | No | URL customer is redirected to upon successful payment |
| `callbackUrl` | `string` | No | Server-to-server pushback webhook URL |
| `customer` | `object` | No | `{ firstName, lastName, email, phone }` |
| `items` | `array` | No | Array of purchased items `[{ name, quantity, price }]` |
| `lifetimeMinutes` | `number` | No | Transaction expiration time in minutes |

---

### 3. Direct ABA PayWay KHQR & Mobile Deeplink

Generate a direct KHQR code without redirecting to a payment page:

```typescript
const qr = await sobin.aba.createQR({
  tranId: "INV-2026-002",
  amount: 10.50,
  currency: "USD",
  customer: {
    firstName: "Dara",
    lastName: "Srun",
    email: "dara@example.com",
    phone: "098765432",
  },
});

console.log("KHQR String:", qr.qrString);
console.log("Base64 QR Image:", qr.qrImage);
console.log("ABA Mobile Deeplink:", qr.abapayDeeplink);
```

---

### 4. Check Transaction Status

```typescript
const result = await sobin.aba.checkTransaction("INV-2026-001");

if (result.status === "APPROVED") {
  console.log("Payment Confirmed! TranID:", result.tranId);
} else {
  console.log("Status:", result.status); // PENDING, DECLINED, etc.
}
```

---

### 5. Get Transaction Details

```typescript
const detail = await sobin.aba.getTransactionDetail("INV-2026-001");

console.log("Payment Amount:", detail.data.payment_amount);
console.log("Card Brand:", detail.data.card_brand);
console.log("Bank Reference:", detail.data.bank_ref);
console.log("Approval Code:", detail.data.apv);
```

#### Payment Status Values:
| Status | Description |
| :--- | :--- |
| `APPROVED` | Payment completed and captured successfully. |
| `PENDING` | Awaiting customer authorization or payment completion. |
| `PRE-AUTH` | Payment authorized and held under pre-authorization. |
| `DECLINED` | Payment declined by issuing bank or risk engine. |
| `CANCELLED` | Transaction cancelled by merchant or expired. |
| `REFUNDED` | Transaction refunded back to customer. |

#### Status Codes:
| Code | Meaning |
| :--- | :--- |
| `00` | Success |
| `1` | Wrong hash (authentication failed) |
| `2` | Invalid request parameters |
| `5` | Transaction not found |
| `26` | Invalid merchant ID |
| `99` | PayWay internal service error |

---

### 6. Close / Cancel Transaction

```typescript
const close = await sobin.aba.closeTransaction("INV-2026-001");
if (close.code === "00") {
  console.log("Transaction successfully cancelled");
}
```

---

### 7. Real-Time Exchange Rates

```typescript
const rates = await sobin.aba.getExchangeRate();
console.log("USD to KHR Rate:", rates.rates);
```

---

### 8. Timing-Safe Webhook Verification

Prevent signature spoofing and timing attacks in your pushback webhook route handler:

```typescript
import { verifyPayWayWebhook } from "@sobindigital/pay";

export async function POST(req: Request) {
  const payload = await req.json();
  const apiKey = process.env.ABA_PAYWAY_API_KEY!;

  const isValid = verifyPayWayWebhook(payload, apiKey);
  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Idempotently process confirmed payment
  if (payload.status === "APPROVED") {
    // await db.orders.update({ where: { id: payload.tran_id }, data: { status: 'PAID' } });
  }

  return new Response(JSON.stringify({ status: "success" }), { status: 200 });
}
```

---

## 🇰🇭 Standalone Bakong KHQR EMVCo Engine

Generate and parse EMVCo QR codes completely offline — no bank credentials or network calls required:

### 1. Generate Individual Person-to-Person QR

```typescript
import { SobinPay } from "@sobindigital/pay";

const khqr = SobinPay.khqr.generateIndividual({
  bakongAccountId: "sokha@aclb",
  merchantName: "Sokha Keo",
  merchantCity: "Phnom Penh",
  currency: "USD",
  amount: 25.00,
});

console.log("EMVCo KHQR String:", khqr);
```

### 2. Generate Merchant Dynamic QR

```typescript
const merchantKhqr = SobinPay.khqr.generateMerchant({
  bakongAccountId: "sobindigital@aba",
  merchantName: "Sobin Digital Store",
  merchantCity: "Phnom Penh",
  acquiringBank: "ABA Bank",
  currency: "KHR",
  amount: 100000,
  billNumber: "INV-9988",
  storeLabel: "Flagship Store",
  terminalLabel: "POS-01",
});
```

### 3. Parse and Validate any KHQR

```typescript
const parsed = SobinPay.khqr.parse(merchantKhqr);

console.log("Is Valid CRC-16:", parsed.isValid); // true
console.log("Currency:", parsed.currency);       // 'KHR'
console.log("Amount:", parsed.amount);           // 100000
console.log("Account ID:", parsed.bakongAccountId);
console.log("Tags:", parsed.tags);               // Detailed 29-tag EMVCo breakdown
```

### 4. Create Bakong Mobile Deeplink

```typescript
const deeplink = SobinPay.khqr.deeplink(merchantKhqr);
console.log("Bakong Deeplink:", deeplink);
// Opens Bakong mobile app with pre-filled payment details
```

---

## 🛠 Framework Recipes

### Next.js 14, 15, and 16 App Router

```typescript
// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { PayWayClient } from "@sobindigital/pay";

const payway = new PayWayClient({
  merchantId: process.env.ABA_PAYWAY_MERCHANT_ID!,
  apiKey: process.env.ABA_PAYWAY_API_KEY!,
  mode: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

export async function POST(req: Request) {
  const { amount, orderId } = await req.json();

  const checkout = await payway.createTransaction({
    tranId: orderId,
    amount,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    continueSuccessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`,
  });

  return NextResponse.json({
    checkoutUrl: checkout.paymentUrl,
    qrImage: checkout.qrImage,
  });
}
```

### Express.js Backend

```typescript
import express from "express";
import { PayWayClient, verifyPayWayWebhook } from "@sobindigital/pay";

const app = express();
app.use(express.json());

const payway = new PayWayClient({
  merchantId: process.env.ABA_PAYWAY_MERCHANT_ID!,
  apiKey: process.env.ABA_PAYWAY_API_KEY!,
});

app.post("/api/checkout", async (req, res) => {
  const result = await payway.createTransaction(req.body);
  res.json(result);
});

app.post("/api/webhooks/payway", (req, res) => {
  const isValid = verifyPayWayWebhook(req.body, process.env.ABA_PAYWAY_API_KEY!);
  if (!isValid) return res.status(401).send("Invalid signature");
  res.json({ status: "success" });
});

app.listen(3000);
```

---

## 🔒 Security Best Practices

1. **Always Verify Webhooks with `verifyPayWayWebhook`**: Never perform plain string comparisons (`===`) on hashes. Plain string comparison leaks cryptographic timing information through CPU cache branch prediction, allowing attackers to forge hashes byte-by-byte. SobinPay enforces `crypto.timingSafeEqual` for byte-level constant-time comparison.
2. **Never Expose Credentials to Client-Side Bundles**: Keep `ABA_PAYWAY_API_KEY` and `ABA_PAYWAY_MERCHANT_ID` strictly in backend server environment variables.
3. **Use BigInt Base Units**: Standard IEEE-754 floats fail in financial calculations (`0.1 + 0.2 = 0.30000000000000004`). SobinPay's core calculates all amounts in integer cents.

---

## 🌐 Community, Support & Enterprise Inquiries

SobinPay is actively maintained and backed by **Sobin Digital**:
- 🌍 **Documentation Portal**: [https://pay.sobindigital.com](https://pay.sobindigital.com)
- 💬 **Telegram Community & Support**: [@sobindigital](https://t.me/sobindigital)
- 📱 **TikTok**: [@sobindigital](https://www.tiktok.com/@sobindigital)
- 🐙 **GitHub Repository**: [github.com/sobindigital/sobinpay](https://github.com/sobindigital/sobinpay)

---

## 📄 License

MIT License © 2026 [Sobin Digital](https://t.me/sobindigital). All rights reserved.  
SobinPay is an independent open-source engineering initiative and is not officially affiliated with Advanced Bank of Asia Ltd (ABA) or the National Bank of Cambodia (NBC).
