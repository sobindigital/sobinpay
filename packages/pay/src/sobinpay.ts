/**
 * @file SobinPay - Unified Multi-Provider Payment Gateway Client
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

import {
  PayWayClient,
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
  AbaPaymentOption,
  AbaPaymentStatus,
  AbaStatusCode,
  AbaViewType,
} from "@sobindigital/provider-payway";
import {
  KhqrGenerator,
  KhqrParser,
  createBakongDeeplink,
  type IndividualKhqrOptions,
  type MerchantKhqrOptions,
  type ParsedKhqr,
} from "@sobindigital/provider-khqr";
import { SobinPayError } from "@sobindigital/core";

export interface SobinPayConfig {
  /**
   * ABA PayWay merchant credentials
   */
  readonly aba?: PayWayConfig;
  /**
   * Alias for aba credentials
   */
  readonly payway?: PayWayConfig;
}

export class SobinPay {
  /**
   * Direct ABA PayWay client instance
   */
  private readonly _aba?: PayWayClient;

  constructor(config: SobinPayConfig = {}) {
    const paywayConfig = config.aba || config.payway;
    if (paywayConfig) {
      this._aba = new PayWayClient(paywayConfig);
    }
  }

  /**
   * ABA PayWay provider instance (`sobin.aba.createQR(...)`)
   */
  public get aba(): PayWayClient {
    if (!this._aba) {
      throw new SobinPayError(
        "ABA PayWay credentials were not provided to SobinPay. Pass `aba: { merchantId, apiKey }` in the constructor.",
        "ABA_NOT_CONFIGURED",
      );
    }
    return this._aba;
  }

  /**
   * Convenient alias for `sobin.aba` (`sobin.abapay.createQR(...)`)
   */
  public get abapay(): PayWayClient {
    return this.aba;
  }

  /**
   * Convenient alias for `sobin.aba` (`sobin.payway.createQR(...)`)
   */
  public get payway(): PayWayClient {
    return this.aba;
  }

  /**
   * Static access to Bakong KHQR generator, parser, and deeplink utilities.
   */
  public static readonly khqr = {
    generateIndividual: (options: IndividualKhqrOptions): string =>
      KhqrGenerator.generateIndividual(options),
    generateMerchant: (options: MerchantKhqrOptions): string =>
      KhqrGenerator.generateMerchant(options),
    parse: (qrString: string): ParsedKhqr => KhqrParser.parse(qrString),
    deeplink: (qrString: string): string => createBakongDeeplink(qrString),
  };
}

// Re-export standalone clients and enums
export {
  PayWayClient,
  PayWayClient as PayWay,
  AbaPaymentOption,
  AbaPaymentStatus,
  AbaStatusCode,
  AbaViewType,
};

export type {
  PayWayConfig,
  CreatePurchaseOptions,
  CreatePurchaseResult,
  CreateQROptions,
  CreateQRResult,
  CheckTransactionResult,
  TransactionDetailResult,
  CloseTransactionResult,
  ExchangeRateResult,
  ListTransactionsFilter,
  ListTransactionsResult,
  WebhookVerificationResult,
  IndividualKhqrOptions,
  MerchantKhqrOptions,
  ParsedKhqr,
};
