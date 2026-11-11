/**
 * @file SobinPay ABA PayWay - Comprehensive Unit Tests
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
import {
  PayWayClient,
  AbaPaymentOption,
  AbaPaymentStatus,
} from "../src/index.js";
import { createHmacSha512Base64 } from "@sobindigital/core";

describe("PayWayClient", () => {
  const credentials = {
    merchantId: "test_merchant",
    apiKey: "test_secret_api_key_12345",
  };

  it("creates a signed checkout purchase with correct fields and hash", () => {
    const payway = new PayWayClient(credentials);
    const purchase = payway.createPurchase({
      tranId: "tran_001",
      amount: 15.0,
      currency: "USD",
      returnUrl: "https://mysite.com/success",
      cancelUrl: "https://mysite.com/cancel",
      paymentOption: AbaPaymentOption.ABAPAY_KHQR,
    });

    expect(purchase.actionUrl).toContain("/api/payment-gateway/v1/payments/purchase");
    expect(purchase.payload.merchant_id).toBe("test_merchant");
    expect(purchase.payload.tran_id).toBe("tran_001");
    expect(purchase.payload.amount).toBe("15.00");
    expect(purchase.payload.currency).toBe("USD");
    expect(purchase.payload.payment_option).toBe(AbaPaymentOption.ABAPAY_KHQR);
    expect(purchase.hash).toBeDefined();
    expect(purchase.hash.length).toBeGreaterThan(20);
    expect(purchase.formHtml).toContain("<form method=\"POST\"");
  });

  it("verifies valid pushback webhook signature using enum status", () => {
    const payway = new PayWayClient(credentials);
    const payload = {
      tran_id: "tran_001",
      status: "0", // Approved
      amount: "15.00",
      currency: "USD",
    };

    // Sorted keys concatenation
    const dataToHash = "15.00" + "USD" + "0" + "tran_001";
    const signature = createHmacSha512Base64(dataToHash, credentials.apiKey);

    const result = payway.verifyWebhook(payload, signature);
    expect(result.isValid).toBe(true);
    expect(result.status).toBe(AbaPaymentStatus.APPROVED);
  });

  it("rejects invalid pushback webhook signature", () => {
    const payway = new PayWayClient(credentials);
    const payload = {
      tran_id: "tran_001",
      status: "0",
    };

    const result = payway.verifyWebhook(payload, "invalid_signature");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Cryptographic signature mismatch");
  });

  it("normalizes ABA bank statuses to AbaPaymentStatus enum", () => {
    const payway = new PayWayClient(credentials);

    expect(payway.verifyWebhook({ status: "0" }, "any").status).toBe(AbaPaymentStatus.APPROVED);
    expect(payway.verifyWebhook({ status: "1" }, "any").status).toBe(AbaPaymentStatus.PENDING);
    expect(payway.verifyWebhook({ status: "PRE_AUTH" }, "any").status).toBe(AbaPaymentStatus.PRE_AUTH);
    expect(payway.verifyWebhook({ status: "3" }, "any").status).toBe(AbaPaymentStatus.DECLINED);
    expect(payway.verifyWebhook({ status: "CANCELLED" }, "any").status).toBe(AbaPaymentStatus.CANCELLED);
    expect(payway.verifyWebhook({ status: "4" }, "any").status).toBe(AbaPaymentStatus.REFUNDED);
  });
});
