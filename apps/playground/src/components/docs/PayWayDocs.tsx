/**
 * @file SobinPay Documentation - ABA PayWay Provider Guide
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
import { ShieldCheck, Lock, ExternalLink, RefreshCw } from "lucide-react";

export function PayWayDocs() {
  const [liveRate, setLiveRate] = React.useState<number | null>(null);
  const [fetchingRate, setFetchingRate] = React.useState(false);

  const handleFetchRate = async () => {
    setFetchingRate(true);
    try {
      const res = await fetch("/api/payway/exchange-rates", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.usdToKhr) {
        setLiveRate(data.data.usdToKhr);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingRate(false);
    }
  };
  return (
    <div className="space-y-16">
      {/* 1. Quickstart */}
      <section id="payway-quickstart" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="blue">ABA PayWay</Badge>
          <Badge variant="emerald">v2.0 API</Badge>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          ABA PayWay Quickstart
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Initialize the SobinPay client by supplying your ABA PayWay credentials. In production, provide your live merchant ID and API key. In development, point to the ABA sandbox gateway.
        </p>

        <CodeBlock
          language="typescript"
          title="Initialize SobinPay Client"
          showLineNumbers
          code={`import { SobinPay } from "@sobindigital/pay";

const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_MERCHANT_ID || "your_merchant_id",
    apiKey: process.env.ABA_API_KEY || "your_aba_api_key",
    apiUrl: process.env.ABA_API_URL || "https://checkout-sandbox.payway.com.kh",
    timeoutMs: 15000, // Optional request timeout (default: 15s)
  },
});

// Access the PayWay client via any of these equivalent aliases:
// sobin.aba, sobin.abapay, or sobin.payway`}
        />
      </section>

      {/* 2. Web Checkout */}
      <section id="payway-checkout" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Web Checkout (Popup & Hosted)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Generate an authenticated checkout session for web browsers using <code className="text-blue-300 font-mono">sobin.aba.createPurchase(...)</code>. This method synchronously calculates the HMAC-SHA512 signature, packages the items and customer info into Base64 format, and generates a ready-to-submit HTML form.
        </p>

        <CodeBlock
          language="typescript"
          title="Create Purchase Session"
          showLineNumbers
          code={`import { AbaPaymentOption, AbaViewType } from "@sobindigital/pay";

const purchase = sobin.aba.createPurchase({
  amount: 25.0,
  currency: "USD",
  returnUrl: "https://example.com/checkout/success",
  cancelUrl: "https://example.com/checkout/cancel",
  paymentOption: AbaPaymentOption.ABAPAY_KHQR, // or "cards", "alipay", etc.
  viewType: AbaViewType.POPUP, // or AbaViewType.HOSTED
  customer: {
    firstName: "Dara",
    lastName: "Chan",
    email: "dara@example.com",
    phone: "012345678",
  },
  items: [
    { name: "Pro Developer License", quantity: 1, price: 25.0 },
  ],
});

// Returns:
// {
//   actionUrl: "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase",
//   payload: { req_time, merchant_id, tran_id, amount, hash, ... },
//   checkoutUrl: "...",
//   formHtml: "<form method='POST' action='...'>...</form>",
//   hash: "...",
//   tranId: "sb-..."
// }`}
        />

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <span className="font-semibold text-slate-200 block">
            Client-Side Popup Integration:
          </span>
          <p>
            Add jQuery and the ABA PayWay checkout scripts to your HTML header or root layout:
            <code className="block mt-1 font-mono text-blue-300 bg-slate-950 p-2.5 rounded space-y-1">
              <span>&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js&quot;&gt;&lt;/script&gt;</span>
              <br />
              <span>&lt;script src=&quot;https://checkout.payway.com.kh/plugins/checkout2-0.js&quot;&gt;&lt;/script&gt;</span>
            </code>
          </p>
          <p>
            When the form with <code className="text-slate-300 font-mono">target=&quot;aba_webservice&quot;</code> is mounted into the DOM, simply call <code className="text-slate-300 font-mono">window.AbaPayway.checkout()</code> to display the native ABA modal popup.
          </p>
        </div>
      </section>

      {/* 3. Direct KHQR & Deeplinks */}
      <section id="payway-direct-khqr" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Direct KHQR & Deeplinks (createQR)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          For mobile applications, automated kiosks, or custom POS screens, you can request a dynamic ABA PayWay KHQR code directly via server-to-server REST API.
        </p>

        <CodeBlock
          language="typescript"
          title="Direct Server-to-Server QR"
          showLineNumbers
          code={`const qr = await sobin.aba.createQR({
amount: 10.0,
currency: "USD",
returnUrl: "https://example.com/checkout/success",
customer: {
  firstName: "Sok",
  lastName: "Chan",
  phone: "012345678",
},
});

if (qr.isSuccess) {
console.log("Raw QR String:", qr.qrString);
console.log("ABA Mobile App Deeplink:", qr.abapayDeeplink);
console.log("QR Image URL:", qr.checkoutQrUrl);
}`}
        />
      </section>

      {/* 4. Check Transaction Status */}
      <section id="payway-check-transaction" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Transaction Status Check (checkTransaction)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Poll or verify the current status of any transaction by invoking <code className="text-blue-300 font-mono">sobin.aba.checkTransaction(tranId)</code>. This calls ABA PayWay’s latest <code className="text-slate-300 font-mono">check-transaction-2</code> endpoint.
        </p>

        <CodeBlock
          language="typescript"
          title="Query Payment Status"
          showLineNumbers
          code={`import { AbaPaymentStatus } from "@sobindigital/pay";

const status = await sobin.aba.checkTransaction("sb-n80c75123");

if (status.isApproved) {
  console.log("Payment completed! Status:", status.status); // AbaPaymentStatus.APPROVED
  console.log("Amount paid:", status.originalAmount, status.originalCurrency);
} else if (status.status === AbaPaymentStatus.PENDING) {
  console.log("Payment is still awaiting customer scan/authorization.");
} else {
  console.log("Payment was not approved:", status.status);
}`}
        />
      </section>

      {/* 5. Transaction Details */}
      <section id="payway-transaction-detail" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Transaction Details (getTransactionDetail)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Retrieve complete transaction metadata including bank authorization codes (APV), card brand information, masked card numbers, and raw gateway response dumps.
        </p>

        <CodeBlock
          language="typescript"
          title="Retrieve Detailed Audit Log"
          code={`const details = await sobin.aba.getTransactionDetail("sb-123456");

console.log("Bank Reference:", details.bankRef);
console.log("Payment Status:", details.paymentStatus);
console.log("Gateway Response:", details.rawResponse);`}
        />
      </section>

      {/* 6. Cancel / Close Transaction */}
      <section id="payway-close-transaction" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Cancel / Close Transaction (closeTransaction)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Explicitly cancel or void a pending, uncompleted transaction on the ABA PayWay gateway.
        </p>

        <CodeBlock
          language="typescript"
          title="Close Pending Transaction"
          code={`const result = await sobin.aba.closeTransaction("sb-123456");

if (result.isSuccess) {
  console.log("Transaction successfully voided:", result.message);
}`}
        />
      </section>

      {/* 7. Exchange Rates */}
      <section id="payway-exchange-rates" className="scroll-mt-24 space-y-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Live Exchange Rates (getExchangeRate)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Query the official real-time USD to KHR currency exchange rate provided directly by ABA Bank.
        </p>

        <CodeBlock
          language="typescript"
          title="Query Live USD/KHR Rate"
          code={`const rate = await sobin.aba.getExchangeRate();

console.log("1 USD =", rate.usdToKhr, "KHR");`}
        />

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <button
            onClick={handleFetchRate}
            disabled={fetchingRate}
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${fetchingRate ? "animate-spin" : ""}`} />
            <span>{fetchingRate ? "Querying Bank..." : "Query Live Rate"}</span>
          </button>
          <span className="text-slate-400">
            {liveRate ? (
              <span className="text-emerald-400 font-bold">
                1 USD = {liveRate.toLocaleString()} KHR (Live ABA Rate)
              </span>
            ) : (
              "Click to query live gateway exchange rates via REST API"
            )}
          </span>
        </div>
      </section>

      {/* 8. Webhook Verification */}
      <section id="payway-webhooks" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="rose">Critical Security</Badge>
          <Badge variant="purple">HMAC-SHA512</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Webhook Verification (verifyWebhook)
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          ABA PayWay sends server-to-server pushback notifications upon payment completion. You <strong>must</strong> verify the cryptographic signature to guard against fraudulent or replayed requests.
        </p>

        <CodeBlock
          language="typescript"
          title="Verify Pushback Webhook"
          showLineNumbers
          code={`// Inside your webhook route handler (e.g. Next.js, Express, or NestJS)
const payload = req.body; // Incoming JSON pushback payload
const signature = req.headers["x-payway-hmac-sha512"] || payload.hash;

const verification = sobin.aba.verifyWebhook(payload, signature);

if (!verification.isValid) {
  console.error("Untrusted pushback! Cryptographic signature mismatch.");
  return res.status(401).send("Invalid Signature");
}

if (verification.status === "APPROVED") {
  // Safe to credit customer balance or mark order as paid
  await markOrderPaid(verification.tranId);
}`}
        />
      </section>

      {/* 9. Refunds */}
      <section id="payway-refunds" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Enterprise</Badge>
          <Badge variant="blue">RSA-SHA512</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Full & Partial Refunds (refundTransaction)
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Execute full or partial refunds directly against settled transactions. ABA PayWay requires refund payloads to be encrypted using 2048-bit RSA-SHA512 with the bank&apos;s public key.
        </p>

        <CodeBlock
          language="typescript"
          title="Execute RSA-Encrypted Refund"
          showLineNumbers
          code={`const refundResult = await sobin.aba.refundTransaction({
  tranId: "sb-123456",
  amount: 10.0, // Amount to refund
  reason: "Customer order cancellation",
  rsaPublicKey: process.env.ABA_RSA_PUBLIC_KEY, // Or configured in client init
});

if (refundResult.isSuccess) {
  console.log("Refund processed successfully! Refund ID:", refundResult.refundId);
}`}
        />
      </section>
    </div>
  );
}

