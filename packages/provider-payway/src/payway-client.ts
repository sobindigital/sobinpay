/**
 * @file SobinPay ABA PayWay - Enterprise Client Implementation
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

import { randomBytes } from "node:crypto";
import {
  createMoneyAmount,
  formatCompactUtcTimestamp,
  createHmacSha512Base64,
  timingSafeEqualString,
  rsaEncryptChunks,
  SobinPayError,
  ProviderApiError,
  PaymentCurrency,
} from "@sobin/core";
import {
  AbaPaymentOption,
  AbaPaymentStatus,
  AbaStatusCode,
  AbaViewType,
  type PayWayConfig,
  type CreatePurchaseOptions,
  type CreatePurchaseResult,
  type CreateQROptions,
  type CreateQRResult,
  type CheckTransactionResult,
  type TransactionDetailResult,
  type CloseTransactionResult,
  type ExchangeRateResult,
  type ListTransactionsFilter,
  type ListTransactionsResult,
  type WebhookVerificationResult,
} from "./types.js";

const DEFAULT_SANDBOX_API_URL = "https://checkout-sandbox.payway.com.kh";
const DEFAULT_TIMEOUT_MS = 10000;

export function normalizeAbaStatus(statusValue: unknown): AbaPaymentStatus {
  if (typeof statusValue !== "string" && typeof statusValue !== "number") {
    return AbaPaymentStatus.UNKNOWN;
  }
  const str = String(statusValue).trim().toUpperCase();

  if (str === "0" || str === "00" || str === "APPROVED") {
    return AbaPaymentStatus.APPROVED;
  }
  if (
    str === "1" ||
    str === "2" ||
    str === "CREATED" ||
    str === "PENDING" ||
    str === "PROCESSING"
  ) {
    return AbaPaymentStatus.PENDING;
  }
  if (str === "PRE_AUTH" || str === "PRE-AUTH" || str === "PREAUTH_APPROVED") {
    return AbaPaymentStatus.PRE_AUTH;
  }
  if (str === "3" || str === "DECLINED" || str === "FAILED" || str === "FAIL") {
    return AbaPaymentStatus.DECLINED;
  }
  if (str === "CANCELLED" || str === "CANCELED") {
    return AbaPaymentStatus.CANCELLED;
  }
  if (str === "4" || str === "REFUNDED") {
    return AbaPaymentStatus.REFUNDED;
  }

  return AbaPaymentStatus.UNKNOWN;
}

function valueToString(val: unknown): string {
  if (val === null || val === undefined || val === false) return "";
  if (val === true) return "1";
  if (typeof val === "string" || typeof val === "number") return String(val);
  return JSON.stringify(val) ?? "";
}

export class PayWayClient {
  public readonly merchantId: string;
  private readonly apiKey: string;
  public readonly apiUrl: string;
  private readonly rsaPublicKey?: string;
  private readonly timeoutMs: number;

  constructor(config: PayWayConfig) {
    if (!config.merchantId || !config.apiKey) {
      throw new SobinPayError(
        "PayWayClient requires both `merchantId` and `apiKey`",
        "MISSING_CREDENTIALS",
      );
    }
    this.merchantId = config.merchantId.trim();
    this.apiKey = config.apiKey.trim();
    this.apiUrl = (config.apiUrl || DEFAULT_SANDBOX_API_URL).replace(/\/+$/, "");
    this.rsaPublicKey = config.rsaPublicKey?.trim();
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  /**
   * Generates a collision-resistant ABA transaction reference (max 20 characters).
   */
  public generateTransactionId(prefix = "sb"): string {
    const timestamp = Date.now().toString(36).slice(-6);
    const random = randomBytes(3).toString("hex");
    return `${prefix}-${timestamp}${random}`.slice(0, 20);
  }

  /**
   * Creates an ABA PayWay purchase session returning signed parameters, checkout URL, and HTML form.
   */
  public createPurchase(options: CreatePurchaseOptions): CreatePurchaseResult {
    const tranId = options.tranId || this.generateTransactionId();
    const money = createMoneyAmount(options.amount, options.currency);
    const reqTime = formatCompactUtcTimestamp();
    const paymentOption = options.paymentOption || AbaPaymentOption.ABAPAY_KHQR;
    const base64ReturnUrl = options.returnUrl ? Buffer.from(options.returnUrl).toString("base64") : "";
    const cancelUrl = options.cancelUrl?.trim() || "";
    const continueSuccessUrl = options.continueSuccessUrl?.trim() || "";
    const lifetime = options.lifetimeMinutes ?? 10;
    const skipSuccessPage = 1;

    // Optional items and customer details
    const items = options.items && options.items.length > 0 ? Buffer.from(JSON.stringify(options.items)).toString("base64") : "";
    const shipping = options.shipping !== undefined && options.shipping !== null ? String(options.shipping) : "";
    const firstname = options.customer?.firstName?.trim() || "";
    const lastname = options.customer?.lastName?.trim() || "";
    const email = options.customer?.email?.trim() || "";
    const phone = options.customer?.phone?.trim() || "";
    const type = options.type || "";
    const returnDeeplink = options.returnDeeplink || "";
    const customFields = options.customFields || "";
    const returnParams = options.returnParams || "";
    const payout = options.payout || "";
    const lifetimeStr = lifetime ? String(lifetime) : "";
    const additionalParams = options.additionalParams || "";
    const googlePayToken = options.googlePayToken || "";
    const skipSuccessPageStr = skipSuccessPage ? String(skipSuccessPage) : "";

    // Official ABA PayWay purchase hash concatenation order:
    // $req_time . $merchant_id . $tran_id . $amount . $items . $shipping . $firstname . $lastname . $email . $phone . $type . $payment_option . $return_url . $cancel_url . $continue_success_url . $return_deeplink . $currency . $custom_fields . $return_params . $payout . $lifetime . $additional_params . $google_pay_token . $skip_success_page;
    const hashFields: string[] = [
      reqTime,
      this.merchantId,
      tranId,
      money.formatted,
      items,
      shipping,
      firstname,
      lastname,
      email,
      phone,
      type,
      paymentOption,
      base64ReturnUrl,
      cancelUrl,
      continueSuccessUrl,
      returnDeeplink,
      money.currency,
      customFields,
      returnParams,
      payout,
      lifetimeStr,
      additionalParams,
      googlePayToken,
      skipSuccessPageStr,
    ];

    const hash = createHmacSha512Base64(hashFields.join(""), this.apiKey);
    const actionUrl = `${this.apiUrl}/api/payment-gateway/v1/payments/purchase`;

    const payload: Record<string, string | number> = {
      actionUrl,
      req_time: reqTime,
      merchant_id: this.merchantId,
      tran_id: tranId,
      amount: money.formatted,
      currency: money.currency,
      payment_option: paymentOption,
      return_url: base64ReturnUrl,
      cancel_url: cancelUrl,
      continue_success_url: continueSuccessUrl,
      view_type: options.viewType || AbaViewType.POPUP,
      lifetime,
      payment_gate: 0,
      skip_success_page: skipSuccessPage,
      hash,
    };

    if (items) payload.items = items;
    if (shipping) payload.shipping = shipping;
    if (firstname) payload.firstname = firstname;
    if (lastname) payload.lastname = lastname;
    if (email) payload.email = email;
    if (phone) payload.phone = phone;
    if (type) payload.type = type;
    if (returnDeeplink) payload.return_deeplink = returnDeeplink;
    if (customFields) payload.custom_fields = customFields;
    if (returnParams) payload.return_params = returnParams;

    const formInputs = Object.entries(payload)
      .map(
        ([key, val]) =>
          `<input type="hidden" name="${key}" value="${String(val)}" />`,
      )
      .join("\n  ");

    const formHtml = `<form method="POST" action="${actionUrl}" target="aba_webservice">\n  ${formInputs}\n</form>`;

    return {
      actionUrl,
      payload,
      checkoutUrl: actionUrl,
      formHtml,
      hash,
      tranId,
    };
  }

  /**
   * Alias for createPurchase (backward compatibility alias)
   */
  public createTransaction(options: CreatePurchaseOptions): CreatePurchaseResult {
    return this.createPurchase(options);
  }

  /**
   * Generates a direct Bakong KHQR code and mobile deeplink via PayWay's purchase API.
   */
  public async createQR(options: CreateQROptions): Promise<CreateQRResult> {
    const tranId = options.tranId || this.generateTransactionId();
    const purchase = this.createPurchase({
      ...options,
      tranId,
      paymentOption: AbaPaymentOption.ABAPAY_KHQR_DEEPLINK,
    });

    const formData = new URLSearchParams();
    for (const [key, val] of Object.entries(purchase.payload)) {
      if (key !== "actionUrl" && val !== undefined && val !== null) {
        formData.append(key, valueToString(val));
      }
    }

    try {
      const response = await fetch(purchase.actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      const json = (await response.json()) as Record<string, unknown>;
      const statusObj = (json.status as Record<string, unknown>) || {};
      const statusCode =
        statusObj.code !== undefined && statusObj.code !== null
          ? String(statusObj.code).trim()
          : undefined;
      const statusMessage =
        typeof statusObj.message === "string" ? statusObj.message.trim() : undefined;
      const description =
        typeof json.description === "string" ? json.description.trim() : undefined;

      const isSuccess =
        statusCode === AbaStatusCode.SUCCESS ||
        statusCode === "0" ||
        statusCode === "00";

      return {
        isSuccess,
        tranId,
        qrString: typeof json.qr_string === "string" ? json.qr_string : undefined,
        abapayDeeplink: typeof json.abapay_deeplink === "string" ? json.abapay_deeplink : undefined,
        checkoutQrUrl: typeof json.checkout_qr_url === "string" ? json.checkout_qr_url : undefined,
        statusCode,
        statusMessage,
        description,
        rawResponse: json,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isSuccess: false,
        tranId,
        statusMessage: message,
        rawResponse: { error: message },
      };
    }
  }

  /**
   * Alias for createQR
   */
  public async generateQR(options: CreateQROptions): Promise<CreateQRResult> {
    return this.createQR(options);
  }

  /**
   * Quick status check querying ABA's check-transaction-2 API directly.
   */
  public async checkTransaction(tranId: string): Promise<CheckTransactionResult> {
    if (!tranId) {
      throw new SobinPayError("Transaction ID is required", "INVALID_TRANSACTION_ID");
    }

    const reqTime = formatCompactUtcTimestamp();
    const body = {
      req_time: reqTime,
      merchant_id: this.merchantId,
      tran_id: tranId,
    };
    const hash = createHmacSha512Base64(
      `${body.req_time}${body.merchant_id}${body.tran_id}`,
      this.apiKey,
    );

    const checkUrl = `${this.apiUrl}/api/payment-gateway/v1/payments/check-transaction-2`;
    const response = await fetch(checkUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, hash }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new ProviderApiError(
        `PayWay check-transaction HTTP ${response.status}`,
        response.status,
      );
    }

    const json = (await response.json()) as Record<string, unknown>;
    const statusObj = (json.status as Record<string, unknown>) || {};
    const dataObj = (json.data as Record<string, unknown>) || {};

    const apiCode =
      statusObj.code !== undefined && statusObj.code !== null
        ? String(statusObj.code).trim()
        : undefined;
    const apiMessage =
      typeof statusObj.message === "string" ? statusObj.message.trim() : undefined;
    const paymentStatusRaw = String(
      dataObj.payment_status || dataObj.payment_status_code || "",
    );
    const status = normalizeAbaStatus(paymentStatusRaw);
    const isApproved =
      apiCode === AbaStatusCode.SUCCESS && status === AbaPaymentStatus.APPROVED;

    return {
      isApproved,
      status,
      tranId: String(dataObj.transaction_id || statusObj.tran_id || tranId),
      statusCode: apiCode,
      statusMessage: apiMessage,
      originalAmount:
        typeof dataObj.original_amount === "string" ? dataObj.original_amount : undefined,
      originalCurrency:
        typeof dataObj.original_currency === "string" ? dataObj.original_currency : undefined,
      rawResponse: json,
    };
  }

  /**
   * Retrieves comprehensive transaction details including history and bank reference.
   */
  public async getTransactionDetail(tranId: string): Promise<TransactionDetailResult> {
    if (!tranId) {
      throw new SobinPayError("Transaction ID is required", "INVALID_TRANSACTION_ID");
    }

    const reqTime = formatCompactUtcTimestamp();
    const body = {
      req_time: reqTime,
      merchant_id: this.merchantId,
      tran_id: tranId,
    };
    const hash = createHmacSha512Base64(
      `${body.req_time}${body.merchant_id}${body.tran_id}`,
      this.apiKey,
    );

    const url = `${this.apiUrl}/api/payment-gateway/v1/payments/transaction-detail`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, hash }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const json = (await response.json()) as Record<string, unknown>;
    const statusObj = (json.status as Record<string, unknown>) || {};
    const dataObj = (json.data as Record<string, unknown>) || {};
    const isSuccess = String(statusObj.code).trim() === AbaStatusCode.SUCCESS;

    return {
      isSuccess,
      tranId,
      paymentStatus: normalizeAbaStatus(dataObj.payment_status),
      amount: typeof dataObj.payment_amount === "string" ? dataObj.payment_amount : undefined,
      currency: typeof dataObj.payment_currency === "string" ? dataObj.payment_currency : undefined,
      bankRef: typeof dataObj.bank_ref === "string" ? dataObj.bank_ref : undefined,
      rawResponse: json,
    };
  }

  /**
   * Cancels a pending transaction.
   */
  public async closeTransaction(tranId: string): Promise<CloseTransactionResult> {
    if (!tranId) {
      throw new SobinPayError("Transaction ID is required", "INVALID_TRANSACTION_ID");
    }

    const reqTime = formatCompactUtcTimestamp();
    const body = {
      req_time: reqTime,
      merchant_id: this.merchantId,
      tran_id: tranId,
    };
    const hash = createHmacSha512Base64(
      `${body.req_time}${body.merchant_id}${body.tran_id}`,
      this.apiKey,
    );

    const url = `${this.apiUrl}/api/payment-gateway/v1/payments/close-transaction`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, hash }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const json = (await response.json()) as Record<string, unknown>;
    const statusObj = (json.status as Record<string, unknown>) || {};
    const code = String(statusObj.code || "").trim();
    const message = String(statusObj.message || "");

    return {
      isSuccess: code === AbaStatusCode.SUCCESS,
      code,
      message,
      rawResponse: json,
    };
  }

  /**
   * Retrieves official bank USD to KHR exchange rates.
   */
  public async getExchangeRate(): Promise<ExchangeRateResult> {
    const reqTime = formatCompactUtcTimestamp();
    const body = {
      req_time: reqTime,
      merchant_id: this.merchantId,
    };
    const hash = createHmacSha512Base64(
      `${body.req_time}${body.merchant_id}`,
      this.apiKey,
    );

    const url = `${this.apiUrl}/api/payment-gateway/v1/payments/exchange-rate`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, hash }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const json = (await response.json()) as Record<string, unknown>;
    const statusObj = (json.status as Record<string, unknown>) || {};
    const dataObj = (json.data as Record<string, unknown>) || {};
    const isSuccess = String(statusObj.code).trim() === AbaStatusCode.SUCCESS;
    const usdToKhr = Number(dataObj.usd_to_khr || dataObj.rate || 4100);

    return {
      isSuccess,
      usdToKhr,
      rawResponse: json,
    };
  }

  /**
   * Queries paginated transaction list with optional date filters.
   */
  public async listTransactions(
    filter: ListTransactionsFilter = {},
  ): Promise<ListTransactionsResult> {
    const reqTime = formatCompactUtcTimestamp();
    const body: Record<string, unknown> = {
      req_time: reqTime,
      merchant_id: this.merchantId,
      from_date: filter.fromDate || "",
      to_date: filter.toDate || "",
      page: filter.page ?? 1,
      limit: filter.limit ?? 20,
    };

    const hash = createHmacSha512Base64(
      `${body.req_time}${body.merchant_id}${body.from_date}${body.to_date}`,
      this.apiKey,
    );

    const url = `${this.apiUrl}/api/payment-gateway/v1/payments/transaction-list`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, hash }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const json = (await response.json()) as Record<string, unknown>;
    const statusObj = (json.status as Record<string, unknown>) || {};
    const dataObj = (json.data as Record<string, unknown>) || {};
    const isSuccess = String(statusObj.code).trim() === AbaStatusCode.SUCCESS;
    const items = Array.isArray(dataObj.items)
      ? (dataObj.items as Array<Record<string, unknown>>)
      : [];
    const total = Number(dataObj.total || items.length);

    return {
      isSuccess,
      total,
      items,
      rawResponse: json,
    };
  }

  /**
   * Verifies the cryptographic HMAC-SHA512 authenticity of incoming pushback callbacks.
   */
  public verifyWebhook(
    payload: Record<string, unknown>,
    receivedSignature?: string,
  ): WebhookVerificationResult {
    const tranId = String(payload.tran_id || "").trim();
    const status = normalizeAbaStatus(payload.status);

    if (!receivedSignature) {
      return {
        isValid: false,
        tranId,
        status,
        rawPayload: payload,
        errorMessage: "Missing signature header (X-PayWay-HMAC-SHA512)",
      };
    }

    // Sort all payload keys alphabetically and concatenate values
    const dataToHash = Object.keys(payload)
      .sort()
      .map((key) => valueToString(payload[key]))
      .join("");

    const expectedHash = createHmacSha512Base64(dataToHash, this.apiKey);

    if (!timingSafeEqualString(receivedSignature, expectedHash)) {
      return {
        isValid: false,
        tranId,
        status,
        rawPayload: payload,
        errorMessage: "Cryptographic signature mismatch",
      };
    }

    return {
      isValid: true,
      tranId,
      status,
      rawPayload: payload,
    };
  }

  /**
   * Automated full or partial refund using RSA chunk encryption.
   */
  public async refundTransaction(
    tranId: string,
    amount: number,
  ): Promise<{ isSuccess: boolean; rawResponse: Record<string, unknown> }> {
    if (!this.rsaPublicKey) {
      throw new SobinPayError(
        "RSA public key is required for refunds. Provide `rsaPublicKey` in config.",
        "MISSING_RSA_KEY",
      );
    }

    const money = createMoneyAmount(amount, PaymentCurrency.USD);
    const reqTime = formatCompactUtcTimestamp();
    const dataString = JSON.stringify({
      tran_id: tranId,
      refund_amount: money.formatted,
    });

    const encryptedData = rsaEncryptChunks(dataString, this.rsaPublicKey);
    const hash = createHmacSha512Base64(
      `${reqTime}${this.merchantId}${encryptedData}`,
      this.apiKey,
    );

    const refundUrl = `${this.apiUrl}/api/payment-gateway/v1/payments/refund`;
    const response = await fetch(refundUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        req_time: reqTime,
        merchant_id: this.merchantId,
        data: encryptedData,
        hash,
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const json = (await response.json()) as Record<string, unknown>;
    const statusObj = (json.status as Record<string, unknown>) || {};
    const isSuccess = String(statusObj.code).trim() === AbaStatusCode.SUCCESS;

    return { isSuccess, rawResponse: json };
  }
}

// Export both standard names
export { PayWayClient as PayWayProvider, PayWayClient as PayWay };
