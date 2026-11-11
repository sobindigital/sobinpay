/**
 * @file SobinPay ABA PayWay - Complete Type Definitions and Enums
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

import type { PaymentCurrency, BaseCustomerInfo, BasePaymentItem } from "@sobindigital/core";

export enum AbaPaymentOption {
  CARDS = "cards",
  ABAPAY_KHQR = "abapay_khqr",
  ABAPAY_KHQR_DEEPLINK = "abapay_khqr_deeplink",
  ALIPAY = "alipay",
  WECHAT = "wechat",
  GOOGLE_PAY = "google_pay",
}

export enum AbaPaymentStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  PRE_AUTH = "PRE-AUTH",
  DECLINED = "DECLINED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  UNKNOWN = "UNKNOWN",
}

export enum AbaStatusCode {
  SUCCESS = "00",
  INVALID_HASH = "1",
  INVALID_PARAMS = "2",
  TRANSACTION_NOT_FOUND = "5",
  INVALID_MERCHANT = "26",
  INTERNAL_ERROR = "99",
}

export enum AbaViewType {
  POPUP = "popup",
  HOSTED = "hosted",
}

export interface PayWayConfig {
  readonly merchantId: string;
  readonly apiKey: string;
  readonly apiUrl?: string;
  readonly rsaPublicKey?: string;
  readonly timeoutMs?: number;
}

export interface CreatePurchaseOptions {
  readonly amount: number;
  readonly currency?: PaymentCurrency | "USD" | "KHR";
  readonly tranId?: string;
  readonly paymentOption?: AbaPaymentOption | string;
  readonly returnUrl?: string;
  readonly cancelUrl?: string;
  readonly continueSuccessUrl?: string;
  readonly callbackUrl?: string;
  readonly viewType?: AbaViewType | "popup" | "hosted";
  readonly lifetimeMinutes?: number;
  readonly customer?: BaseCustomerInfo;
  readonly items?: BasePaymentItem[];
  readonly shipping?: number;
  readonly type?: string;
  readonly returnDeeplink?: string;
  readonly customFields?: string;
  readonly returnParams?: string;
  readonly payout?: string;
  readonly additionalParams?: string;
  readonly googlePayToken?: string;
}

export interface CreatePurchaseResult {
  readonly actionUrl: string;
  readonly payload: Record<string, string | number>;
  readonly checkoutUrl: string;
  readonly formHtml: string;
  readonly hash: string;
  readonly tranId: string;
}

export interface CreateQROptions {
  readonly amount: number;
  readonly currency?: PaymentCurrency | "USD" | "KHR";
  readonly tranId?: string;
  readonly customer?: BaseCustomerInfo;
  readonly items?: BasePaymentItem[];
  readonly returnUrl?: string;
  readonly callbackUrl?: string;
  readonly lifetimeMinutes?: number;
}

export interface CreateQRResult {
  readonly isSuccess: boolean;
  readonly tranId: string;
  readonly qrString?: string;
  readonly abapayDeeplink?: string;
  readonly checkoutQrUrl?: string;
  /**
   * Gateway response status code (e.g. "00", "0", "1", "2")
   */
  readonly statusCode?: string;
  /**
   * Human-readable status message from gateway (e.g. "Wrong Hash.", "Invalid Transaction ID.")
   */
  readonly statusMessage?: string;
  /**
   * Detailed error description if returned by gateway
   */
  readonly description?: string;
  readonly rawResponse: Record<string, unknown>;
}

export interface CheckTransactionResult {
  readonly isApproved: boolean;
  readonly status: AbaPaymentStatus;
  readonly tranId: string;
  /**
   * Gateway response status code (e.g. "00", "0", "5")
   */
  readonly statusCode?: string;
  /**
   * Human-readable status message from gateway
   */
  readonly statusMessage?: string;
  readonly originalAmount?: string;
  readonly originalCurrency?: string;
  readonly rawResponse: Record<string, unknown>;
}

export interface TransactionDetailResult {
  readonly isSuccess: boolean;
  readonly tranId: string;
  readonly paymentStatus: AbaPaymentStatus;
  readonly amount?: string;
  readonly currency?: string;
  readonly bankRef?: string;
  readonly rawResponse: Record<string, unknown>;
}

export interface CloseTransactionResult {
  readonly isSuccess: boolean;
  readonly code: string;
  readonly message: string;
  readonly rawResponse: Record<string, unknown>;
}

export interface ExchangeRateResult {
  readonly isSuccess: boolean;
  readonly usdToKhr: number;
  readonly rawResponse: Record<string, unknown>;
}

export interface ListTransactionsFilter {
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly page?: number;
  readonly limit?: number;
}

export interface ListTransactionsResult {
  readonly isSuccess: boolean;
  readonly total: number;
  readonly items: Array<Record<string, unknown>>;
  readonly rawResponse: Record<string, unknown>;
}

export interface WebhookVerificationResult {
  readonly isValid: boolean;
  readonly tranId: string;
  readonly status: AbaPaymentStatus;
  readonly rawPayload: Record<string, unknown>;
  readonly errorMessage?: string;
}
