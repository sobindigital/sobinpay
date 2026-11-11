/**
 * @file SobinPay - Unified Client Ergonomics Unit Tests
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

import { describe, it, expect } from "vitest";
import { SobinPay, AbaPaymentStatus, AbaPaymentOption } from "../src/index.js";

describe("SobinPay Unified Client Ergonomics", () => {
  it("provides clean access through sobin.aba and sobin.abapay aliases", () => {
    const sobin = new SobinPay({
      aba: {
        merchantId: "my_merchant",
        apiKey: "my_api_key_secret_12345",
      },
    });

    // Check direct access without cumbersome wrappers
    expect(sobin.aba).toBeDefined();
    expect(sobin.abapay).toBe(sobin.aba);
    expect(sobin.payway).toBe(sobin.aba);

    const purchase = sobin.aba.createPurchase({
      amount: 25.0,
      currency: "USD",
      paymentOption: AbaPaymentOption.ABAPAY_KHQR,
    });

    expect(purchase.payload.merchant_id).toBe("my_merchant");
    expect(purchase.payload.amount).toBe("25.00");
    expect(purchase.hash).toBeDefined();
  });

  it("throws clear domain error when accessing unconfigured provider", () => {
    const sobin = new SobinPay();
    expect(() => sobin.aba).toThrow("ABA PayWay credentials were not provided to SobinPay");
  });

  it("exposes Bakong KHQR static utilities", () => {
    const qrString = SobinPay.khqr.generateIndividual({
      bakongAccountId: "sobin_digital@aclb",
      merchantName: "Sobin Digital",
      amount: 50.0,
      currency: "USD",
    });

    expect(qrString).toBeDefined();
    const parsed = SobinPay.khqr.parse(qrString);
    expect(parsed.isValid).toBe(true);
    expect(parsed.bakongAccountId).toBe("sobin_digital@aclb");
  });
});

