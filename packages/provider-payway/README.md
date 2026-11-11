# @sobin/provider-payway

> Enterprise ABA PayWay payment gateway provider for **SobinPay**. Supports Modal Popups, Hosted Checkout, Direct KHQR REST API, and Timing-Safe Webhooks. Built by [Sobin Digital](https://t.me/sobindigital).

## Features

- **Standard Checkout**: Seamless Modal Popup & Hosted Redirect checkout generation.
- **Official 24-Parameter Hash**: Exact HMAC-SHA512 signature matching ABA PayWay v1/v2 gateways.
- **Direct KHQR REST API**: Generate scannable dynamic QR codes without client-side redirects.
- **Transaction Verification**: Query `check-transaction-2` and full transaction details.
- **Timing-Safe Webhook Verifier**: `crypto.timingSafeEqual` prevents side-channel attacks on pushback notifications.
- **Currency Exchange Rates**: Query official live USD/KHR exchange rates directly from ABA Bank.

## Installation

```bash
# npm
npm install @sobin/provider-payway

# pnpm
pnpm add @sobin/provider-payway

# bun
bun add @sobin/provider-payway
```

## Quickstart

```typescript
import { PayWayClient, AbaPaymentOption, AbaViewType } from "@sobin/provider-payway";

const payway = new PayWayClient({
  merchantId: process.env.ABA_MERCHANT_ID!,
  apiKey: process.env.ABA_API_KEY!,
  apiUrl: "https://checkout-sandbox.payway.com.kh", // or production: https://checkout.payway.com.kh
});

// 1. Create Checkout Session
const purchase = payway.createPurchase({
  tranId: payway.generateTransactionId("sb"),
  amount: 15.0,
  currency: "USD",
  returnUrl: "https://myshop.com/payment/success",
  cancelUrl: "https://myshop.com/payment/cancel",
  paymentOption: AbaPaymentOption.ABAPAY_KHQR,
  viewType: AbaViewType.POPUP,
  items: [{ name: "Standard Subscription", quantity: 1, price: 15.0 }],
});

// 2. Check Transaction Status
const status = await payway.checkTransaction(purchase.tranId);
if (status.isPaid) {
  console.log("Transaction successfully approved!");
}

// 3. Verify Pushback Webhook
const verification = payway.verifyWebhook(
  requestBody,
  headers["x-payway-hmac-sha512"]
);
if (verification.isValid) {
  console.log("Verified payment webhook for tranId:", verification.tranId);
}
```

## License

MIT © [Sobin Digital](https://t.me/sobindigital)

