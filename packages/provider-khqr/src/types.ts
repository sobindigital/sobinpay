/**
 * @file SobinPay Bakong KHQR - Interface Definitions
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

import { PaymentCurrency } from "@sobin/core";

export type { PaymentCurrency };

export interface IndividualKhqrOptions {
  readonly bakongAccountId: string; // e.g. "sobin_digital@aclb" or "developer@devb"
  readonly merchantName: string;
  readonly merchantCity?: string;
  readonly amount?: number;
  readonly currency?: PaymentCurrency | "USD" | "KHR";
  readonly billNumber?: string;
  readonly storeLabel?: string;
  readonly terminalLabel?: string;
}

export interface MerchantKhqrOptions {
  readonly bakongAccountId: string;
  readonly merchantId: string;
  readonly acquiringBank: string;
  readonly merchantName: string;
  readonly merchantCity?: string;
  readonly amount?: number;
  readonly currency?: PaymentCurrency | "USD" | "KHR";
  readonly billNumber?: string;
  readonly storeLabel?: string;
  readonly terminalLabel?: string;
}

export interface KhqrTagValue {
  readonly tag: string;
  readonly length: number;
  readonly value: string;
}

export interface ParsedKhqr {
  readonly isValid: boolean;
  readonly bakongAccountId?: string;
  readonly merchantName?: string;
  readonly merchantCity?: string;
  readonly amount?: number;
  readonly currency?: PaymentCurrency;
  readonly billNumber?: string;
  readonly crc: string;
  readonly tags: Record<string, string>;
}
