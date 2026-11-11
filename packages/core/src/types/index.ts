/**
 * @file SobinPay Core - Domain Types and Normalized Interfaces
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

export enum PaymentCurrency {
  USD = "USD",
  KHR = "KHR",
}

export enum PaymentProviderType {
  ABA_PAYWAY = "ABA_PAYWAY",
  BAKONG_KHQR = "BAKONG_KHQR",
  WING = "WING",
  ACLEDA = "ACLEDA",
}

export enum PaymentStatus {
  APPROVED = "APPROVED",
  SUCCEEDED = "SUCCEEDED",
  PENDING = "PENDING",
  PRE_AUTH = "PRE-AUTH",
  DECLINED = "DECLINED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  EXPIRED = "EXPIRED",
  UNKNOWN = "UNKNOWN",
}

export enum PaymentViewType {
  POPUP = "popup",
  HOSTED = "hosted",
}

export interface MoneyAmount {
  readonly amount: number;
  readonly currency: PaymentCurrency;
  readonly minorUnits: number;
  readonly formatted: string;
}

export interface BaseCustomerInfo {
  readonly name?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly phone?: string;
}

export interface BasePaymentItem {
  readonly name: string;
  readonly quantity: number;
  readonly price: number;
}
