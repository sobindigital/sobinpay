# @sobindigital/pay

> Unified Multi-Provider TypeScript Payment Gateway SDK for Cambodia (ABA PayWay, Bakong KHQR) by **Sobin Digital**.

[![npm version](https://img.shields.io/npm/v/@sobindigital/pay.svg?style=flat-square)](https://www.npmjs.com/package/@sobindigital/pay)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square)](https://www.typescriptlang.org/)

## Installation

```bash
# npm
npm install @sobindigital/pay

# pnpm
pnpm add @sobindigital/pay

# bun
bun add @sobindigital/pay
```

## Quick Start

```typescript
import { SobinPay, AbaPaymentOption } from "@sobindigital/pay";

// Initialize with ABA credentials
const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_MERCHANT_ID!,
    apiKey: process.env.ABA_API_KEY!,
    apiUrl: "https://checkout-sandbox.payway.com.kh", // or production: https://checkout.payway.com.kh
  },
});

// 1. Create ABA PayWay Purchase Session
const purchase = sobin.aba.createPurchase({
  tranId: sobin.aba.generateTransactionId("sb"),
  amount: 25.0,
  currency: "USD",
  returnUrl: "https://myshop.com/payment/success",
  paymentOption: AbaPaymentOption.ABAPAY_KHQR,
});

// 2. Offline Bakong KHQR generation (No credentials needed!)
const khqr = SobinPay.khqr.generateIndividual({
  bakongAccountId: "sobindigital@aclb",
  merchantName: "Sobin Digital",
  merchantCity: "Phnom Penh",
  currency: "USD",
  amount: 25.0,
});

// 3. Parse KHQR & Create Bakong Deeplink
const parsed = SobinPay.khqr.parse(khqr);
const deeplink = SobinPay.khqr.deeplink(khqr);
```

## Documentation

Full interactive documentation portal and sandbox available at [SobinPay Documentation](https://github.com/sobindigital/sobinpay).

## Community & Support

- **Sobin Digital**: [Telegram Channel](https://t.me/sobindigital)
- **TikTok**: [@sobindigital](https://www.tiktok.com/@sobindigital)

## License

MIT © [Sobin Digital](https://t.me/sobindigital)

