# SobinPay ⚡️

[![npm version](https://img.shields.io/npm/v/@sobindigital/pay.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@sobindigital/pay)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_100%25-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.9.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![Sobin Digital](https://img.shields.io/badge/Engineered_by-Sobin_Digital-orange.svg?style=flat-square)](https://t.me/sobindigital)

> The modern, zero-dependency, type-safe payment engine for Cambodia. Accept **ABA PayWay** and **Bakong KHQR** in Node.js, Next.js, and Bun with clean 3-line ergonomics.

Maintained and engineered with ❤️ by **Sobin Digital**:
- 🌐 Company: [Sobin Digital](https://t.me/sobindigital)
- 💬 Telegram: [@sobindigital](https://t.me/sobindigital)
- 📱 TikTok: [@sobindigital](https://www.tiktok.com/@sobindigital)

---

## 🌟 Why SobinPay?

| Architectural Feature | Manual REST / cURL | Legacy Axios SDKs | **SobinPay (@sobindigital/pay)** |
| :--- | :---: | :---: | :---: |
| **Ergonomics & API Design** | ❌ Complex boilerplate | ⚠️ Single-provider methods | ⭐ **Unified multi-provider hub + standalone clients** |
| **TypeScript Strictness** | ❌ Untyped JSON responses | ⚠️ Loose types & `any` casts | 🛡️ **100% Strict Type Safety, Zero `any`** |
| **Payment Status Enums** | ❌ Arbitrary string checks | ❌ String comparisons | ⭐ **Strongly typed `AbaPaymentStatus` Enum** |
| **Bakong KHQR (EMVCo)** | ❌ Not supported | ❌ Not supported | ⭐ **Full NBC EMVCo Generator, Parser & Deeplinks** |
| **Zero-Dependency Architecture** | ❌ Manual crypto boilerplate | ❌ Heavy Axios / external deps | ⚡ **Pure Native Web Fetch (Zero heavy dependencies)** |
| **Pushback Webhook Security** | ❌ Custom implementation | ⚠️ Basic string comparison | 🔒 **Constant-Time HMAC-SHA512 (`timingSafeEqual`)** |
| **Interactive Developer Portal** | ❌ None | ❌ None | 💻 **Next.js 16 Documentation Portal & Sandbox Included** |

---

## 📦 Installation

```bash
# Using npm
npm install @sobindigital/pay

# Using pnpm
pnpm add @sobindigital/pay

# Using bun
bun add @sobindigital/pay
```

---

## 🚀 Quickstart

### 1. Initialize Client

You can either use the unified multi-provider hub (`SobinPay`) or the standalone `PayWay` / `PayWayClient`:

```typescript
import { SobinPay } from "@sobindigital/pay";

const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_MERCHANT_ID!,
    apiKey: process.env.ABA_API_KEY!,
    apiUrl: "https://checkout-sandbox.payway.com.kh", // or production
  },
});
```

*Or standalone:*
```typescript
import { PayWay } from "@sobindigital/pay";

const payway = new PayWay({
  merchantId: process.env.ABA_MERCHANT_ID!,
  apiKey: process.env.ABA_API_KEY!,
});
```

---

### 2. ABA PayWay Features

#### A. Generate Direct KHQR Code & Mobile Deeplink
```typescript
const result = await sobin.aba.createQR({
  amount: 10.50,
  currency: "USD", // or "KHR"
  customer: {
    email: "customer@example.com",
    phone: "012345678",
  },
});

console.log("QR String:", result.qrString);
console.log("ABA Mobile Deeplink:", result.abapayDeeplink);
```

#### B. Create Web Purchase (Popup or Hosted Checkout)
```typescript
import { AbaPaymentOption, AbaViewType } from "@sobindigital/pay";

const purchase = sobin.aba.createPurchase({
  amount: 25.00,
  currency: "USD",
  returnUrl: "https://example.com/checkout/success",
  cancelUrl: "https://example.com/checkout/cancel",
  paymentOption: AbaPaymentOption.ABAPAY_KHQR,
  viewType: AbaViewType.POPUP,
});

console.log("Action URL:", purchase.actionUrl);
console.log("Payload:", purchase.payload);
console.log("Pre-rendered Form HTML:", purchase.formHtml);
```

#### C. Real-Time Transaction Status Check
```typescript
import { AbaPaymentStatus } from "@sobindigital/pay";

const status = await sobin.aba.checkTransaction("ORDER-12345");

if (status.isApproved && status.status === AbaPaymentStatus.APPROVED) {
  console.log(`Payment confirmed! Amount: ${status.originalAmount}`);
}
```

#### D. Retrieve Detailed Transaction Record
```typescript
const details = await sobin.aba.getTransactionDetail("ORDER-12345");

console.log("Status:", details.paymentStatus); // AbaPaymentStatus.APPROVED
console.log("Bank Reference:", details.bankRef);
```

#### E. Close / Cancel Pending Transaction
```typescript
const cancelResult = await sobin.aba.closeTransaction("ORDER-12345");
if (cancelResult.isSuccess) {
  console.log("Transaction successfully closed");
}
```

#### F. Fetch Daily Bank Exchange Rate
```typescript
const rate = await sobin.aba.getExchangeRate();
console.log("USD to KHR Rate:", rate.usdToKhr);
```

#### G. Secure Webhook Pushback Verification
```typescript
// Inside your Express, Next.js Server Action, or NestJS webhook handler:
const verification = sobin.aba.verifyWebhook(
  req.body,
  req.headers["x-payway-hmac-sha512"]
);

if (verification.isValid && verification.status === AbaPaymentStatus.APPROVED) {
  console.log(`Payment confirmed for order: ${verification.tranId}`);
}
```

---

### 3. Bakong KHQR (EMVCo Generator & Parser)

#### A. Generate Dynamic Individual KHQR
```typescript
import { SobinPay } from "@sobindigital/pay";

const qrString = SobinPay.khqr.generateIndividual({
  bakongAccountId: "sobin_digital@aclb",
  merchantName: "Sobin Digital",
  amount: 15.00,
  currency: "USD",
  billNumber: "INV-1001",
});

const deeplink = SobinPay.khqr.deeplink(qrString);
```

#### B. Parse & Validate Any KHQR
```typescript
const parsed = SobinPay.khqr.parse(qrString);

if (parsed.isValid) {
  console.log(`Merchant: ${parsed.merchantName}`);
  console.log(`Amount: ${parsed.amount} ${parsed.currency}`);
  console.log(`Bakong Account: ${parsed.bakongAccountId}`);
}
```

---

## 🗂️ Complete API Reference

| Method | Description |
| :--- | :--- |
| `sobin.aba.createQR(options)` | Generates direct KHQR string, image URL, and ABA mobile deeplink |
| `sobin.aba.createPurchase(options)` | Generates signed checkout payload, checkout URL, and HTML form |
| `sobin.aba.checkTransaction(tranId)` | Real-time status query via `check-transaction-2` |
| `sobin.aba.getTransactionDetail(tranId)` | Detailed transaction report with bank reference |
| `sobin.aba.closeTransaction(tranId)` | Cancels a pending transaction |
| `sobin.aba.getExchangeRate()` | Retrieves bank USD/KHR exchange rates |
| `sobin.aba.listTransactions(filter)` | Queries paginated transaction list |
| `sobin.aba.verifyWebhook(body, sig)` | Validates incoming pushback callbacks with timing-safe HMAC |
| `sobin.aba.refundTransaction(tranId, amt)`| Automated RSA-encrypted refund |
| `SobinPay.khqr.generateIndividual(opts)` | Generates individual Bakong EMVCo QR code string |
| `SobinPay.khqr.generateMerchant(opts)` | Generates merchant Bakong EMVCo QR code string |
| `SobinPay.khqr.parse(qrString)` | Parses and verifies 16-bit CRC of any KHQR string |
| `SobinPay.khqr.deeplink(qrString)` | Generates `bakong://` mobile app deeplink |

---

## 🧪 Testing

```bash
# Run 100% type-checked unit & crypto test suite
npm test

# Build all packages (ESM + CommonJS + .d.ts)
npm run build
```

---

## 💻 Developer Portal & Interactive Playground

SobinPay includes a production-grade **Documentation & Developer Portal** built on **Next.js 16**, featuring:
- 📖 **Complete Documentation**: Guides for ABA PayWay, Bakong KHQR, TypeScript enums, error hierarchy, and framework recipes (Next.js App Router Server Actions, Express.js, NestJS).
- ⚡ **Live Sandbox & QR Tester**: Test ABA PayWay popup/direct checkout and render scannable Bakong KHQR codes in real-time.
- 🔒 **Webhook Debugger**: Paste raw pushback payloads to inspect the canonical normalization string and verify HMAC-SHA512 signatures in constant time.
- 🔍 **EMVCo KHQR Tag Inspector**: Parse any raw Bakong QR string and inspect its Tag-Length-Value (TLV) elements and 16-bit CRC checksum.
- ⌨️ **Command Palette (⌘K / Ctrl+K)**: Instant keyboard-driven documentation search across all topics and APIs.

To launch the portal locally:
```bash
npm run dev --workspace=playground
# Open http://localhost:3000 in your browser
```

---

## 📄 License & Copyright

MIT © [Sobin Digital](https://t.me/sobindigital)

Engineered by **Sobin Digital**  
- Telegram: [@sobindigital](https://t.me/sobindigital)  
- TikTok: [@sobindigital](https://www.tiktok.com/@sobindigital)
