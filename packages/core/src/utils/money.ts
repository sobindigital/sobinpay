/**
 * @file SobinPay Core - Safe Decimal & Financial Money Utilities
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

import { InvalidAmountError } from "../errors/index.js";
import { PaymentCurrency, type MoneyAmount } from "../types/index.js";

const USD_DECIMALS = 2;

/**
 * Validates and converts amounts safely without binary floating-point inaccuracy.
 */
export function createMoneyAmount(
  amount: number,
  currency: PaymentCurrency | "USD" | "KHR" = PaymentCurrency.USD,
): MoneyAmount {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new InvalidAmountError("Payment amount must be a positive finite number");
  }

  const normalizedCurrency =
    typeof currency === "string" && currency.toUpperCase() === "KHR"
      ? PaymentCurrency.KHR
      : PaymentCurrency.USD;

  if (normalizedCurrency === PaymentCurrency.KHR) {
    const roundedRiel = Math.round(amount);
    return {
      amount: roundedRiel,
      currency: PaymentCurrency.KHR,
      minorUnits: roundedRiel,
      formatted: String(roundedRiel),
    };
  }

  // USD: Round safely to 2 decimal places
  const fixedUsd = Number(amount.toFixed(USD_DECIMALS));
  const minorUnits = Math.round(fixedUsd * 100);

  return {
    amount: fixedUsd,
    currency: PaymentCurrency.USD,
    minorUnits,
    formatted: fixedUsd.toFixed(USD_DECIMALS),
  };
}

/**
 * Formats a Date object to UTC compact format YYYYMMDDHHmmss required by bank APIs.
 */
export function formatCompactUtcTimestamp(date: Date = new Date()): string {
  const yyyy = date.getUTCFullYear();
  const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const HH = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}
