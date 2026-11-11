# @sobin/core

> Core primitives, timing-safe cryptographic utilities, and money formatting for the **SobinPay** payment ecosystem. Built by [Sobin Digital](https://t.me/sobindigital).

## Features

- **Timing-Safe Cryptography**: `crypto.timingSafeEqual` signature validation preventing side-channel attacks.
- **HMAC-SHA512 & SHA256**: Standards-compliant hashing utilities.
- **CRC-16-CCITT (0xFFFF)**: High-speed lookup-table EMVCo CRC computation.
- **Safe Currency Amounts**: Strict integer-based currency conversion for USD ($0.01) and KHR (៛1).
- **Zero External Dependencies**: Pure Node.js & browser standard libraries.

## Installation

```bash
# npm
npm install @sobin/core

# pnpm
pnpm add @sobin/core

# bun
bun add @sobin/core
```

## License

MIT © [Sobin Digital](https://t.me/sobindigital)

