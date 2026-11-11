# @sobin/provider-khqr

> Official EMVCo-compliant Bakong KHQR QR Code generator, parser, and deeplink creator for **SobinPay**. Built by [Sobin Digital](https://t.me/sobindigital).

## Features

- **EMVCo KHQR Generation**: Generate Individual (`tag 29`) and Merchant (`tag 30`) KHQR strings offline.
- **TLV Parsing**: Decode any KHQR string into typed Tag-Length-Value objects.
- **16-Bit CRC Verification**: Instant verification of payload integrity.
- **Bakong Mobile Deeplinks**: Direct universal deeplink scheme `bakong://...` generator.
- **Universal JavaScript**: Runs in Node.js (>=18), Next.js, Edge Runtimes, Bun, and browsers.

## Installation

```bash
# npm
npm install @sobin/provider-khqr

# pnpm
pnpm add @sobin/provider-khqr

# bun
bun add @sobin/provider-khqr
```

## Quickstart

```typescript
import { KhqrGenerator, KhqrParser, createBakongDeeplink } from "@sobin/provider-khqr";

// 1. Generate Individual KHQR
const qrString = KhqrGenerator.generateIndividual({
  bakongAccountId: "sobindigital@aclb",
  merchantName: "Sobin Digital",
  merchantCity: "Phnom Penh",
  currency: "USD",
  amount: 25.0,
  billNumber: "INV-2026-001",
});

// 2. Parse & Validate KHQR
const parsed = KhqrParser.parse(qrString);
console.log("Valid CRC:", parsed.isValidCrc);
console.log("Amount:", parsed.amount, parsed.currency);

// 3. Create Mobile Deeplink
const deeplink = createBakongDeeplink(qrString);
```

## License

MIT © [Sobin Digital](https://t.me/sobindigital)

