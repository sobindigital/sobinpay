/**
 * @file SobinPay Bakong KHQR - EMVCo Specification String Generator
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

import { calculateCrc16 } from "./crc16.js";
import type { IndividualKhqrOptions, MerchantKhqrOptions } from "./types.js";

function formatTag(tag: string, value: string): string {
  const len = String(value.length).padStart(2, "0");
  return `${tag}${len}${value}`;
}

export class KhqrGenerator {
  /**
   * Generates a standard Bakong KHQR string for an Individual account.
   */
  public static generateIndividual(options: IndividualKhqrOptions): string {
    const isDynamic = options.amount !== undefined && options.amount > 0;
    const pointOfInitiation = isDynamic ? "12" : "11";

    let payload = "";
    payload += formatTag("00", "01"); // Format indicator
    payload += formatTag("01", pointOfInitiation); // 11=Static, 12=Dynamic

    // Tag 29: Individual account info
    const tag29Value = formatTag("00", options.bakongAccountId);
    payload += formatTag("29", tag29Value);

    payload += formatTag("52", "5999"); // Merchant Category Code

    // Currency: 840 = USD, 116 = KHR
    const currencyCode =
      typeof options.currency === "string" && options.currency.toUpperCase() === "KHR"
        ? "116"
        : "840";
    payload += formatTag("53", currencyCode);

    if (isDynamic && options.amount !== undefined) {
      const amountStr =
        currencyCode === "116"
          ? String(Math.round(options.amount))
          : options.amount.toFixed(2);
      payload += formatTag("54", amountStr);
    }

    payload += formatTag("58", "KH"); // Country code
    payload += formatTag("59", options.merchantName.slice(0, 25)); // Merchant name
    payload += formatTag("60", (options.merchantCity || "Phnom Penh").slice(0, 15));

    // Tag 62: Additional data template
    let tag62Content = "";
    if (options.billNumber) {
      tag62Content += formatTag("01", options.billNumber.slice(0, 25));
    }
    if (options.storeLabel) {
      tag62Content += formatTag("03", options.storeLabel.slice(0, 25));
    }
    if (options.terminalLabel) {
      tag62Content += formatTag("07", options.terminalLabel.slice(0, 25));
    }
    if (tag62Content) {
      payload += formatTag("62", tag62Content);
    }

    // Tag 63: CRC calculation
    const payloadForCrc = payload + "6304";
    const crc = calculateCrc16(payloadForCrc);

    return payloadForCrc + crc;
  }

  /**
   * Generates a standard Bakong KHQR string for a Merchant account.
   */
  public static generateMerchant(options: MerchantKhqrOptions): string {
    const isDynamic = options.amount !== undefined && options.amount > 0;
    const pointOfInitiation = isDynamic ? "12" : "11";

    let payload = "";
    payload += formatTag("00", "01");
    payload += formatTag("01", pointOfInitiation);

    // Tag 30: Merchant account info
    let tag30Content = "";
    tag30Content += formatTag("00", options.bakongAccountId);
    tag30Content += formatTag("01", options.merchantId);
    tag30Content += formatTag("02", options.acquiringBank);
    payload += formatTag("30", tag30Content);

    payload += formatTag("52", "5999");

    const currencyCode =
      typeof options.currency === "string" && options.currency.toUpperCase() === "KHR"
        ? "116"
        : "840";
    payload += formatTag("53", currencyCode);

    if (isDynamic && options.amount !== undefined) {
      const amountStr =
        currencyCode === "116"
          ? String(Math.round(options.amount))
          : options.amount.toFixed(2);
      payload += formatTag("54", amountStr);
    }

    payload += formatTag("58", "KH");
    payload += formatTag("59", options.merchantName.slice(0, 25));
    payload += formatTag("60", (options.merchantCity || "Phnom Penh").slice(0, 15));

    let tag62Content = "";
    if (options.billNumber) tag62Content += formatTag("01", options.billNumber.slice(0, 25));
    if (options.storeLabel) tag62Content += formatTag("03", options.storeLabel.slice(0, 25));
    if (options.terminalLabel) tag62Content += formatTag("07", options.terminalLabel.slice(0, 25));
    if (tag62Content) {
      payload += formatTag("62", tag62Content);
    }

    const payloadForCrc = payload + "6304";
    const crc = calculateCrc16(payloadForCrc);

    return payloadForCrc + crc;
  }
}
