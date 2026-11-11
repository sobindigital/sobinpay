/**
 * @file SobinPay Bakong KHQR - EMVCo Tag-Length-Value Parser
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
import { PaymentCurrency } from "@sobin/core";
import type { ParsedKhqr } from "./types.js";

export class KhqrParser {
  /**
   * Parses and validates any standard Bakong KHQR string.
   */
  public static parse(qrString: string): ParsedKhqr {
    if (!qrString || qrString.length < 12) {
      return { isValid: false, crc: "", tags: {} };
    }

    const tags: Record<string, string> = {};
    let cursor = 0;

    while (cursor < qrString.length) {
      const tag = qrString.substring(cursor, cursor + 2);
      const lengthStr = qrString.substring(cursor + 2, cursor + 4);
      const length = parseInt(lengthStr, 10);

      if (isNaN(length) || cursor + 4 + length > qrString.length) {
        break;
      }

      const value = qrString.substring(cursor + 4, cursor + 4 + length);
      tags[tag] = value;
      cursor += 4 + length;
    }

    const providedCrc = tags["63"] || "";
    const payloadWithoutCrc = qrString.slice(0, -4);
    const expectedCrc = calculateCrc16(payloadWithoutCrc);
    const isValid =
      Boolean(providedCrc) &&
      providedCrc.toUpperCase() === expectedCrc.toUpperCase();

    // Parse currency
    let currency: PaymentCurrency | undefined;
    if (tags["53"] === "840") currency = PaymentCurrency.USD;
    else if (tags["53"] === "116") currency = PaymentCurrency.KHR;

    // Parse amount
    const amount = tags["54"] ? parseFloat(tags["54"]) : undefined;

    // Parse Bakong account id from Tag 29 or Tag 30 subtag 00
    let bakongAccountId: string | undefined;
    if (tags["29"] && tags["29"].startsWith("00")) {
      const len = parseInt(tags["29"].substring(2, 4), 10);
      bakongAccountId = tags["29"].substring(4, 4 + len);
    } else if (tags["30"] && tags["30"].startsWith("00")) {
      const len = parseInt(tags["30"].substring(2, 4), 10);
      bakongAccountId = tags["30"].substring(4, 4 + len);
    }

    return {
      isValid,
      bakongAccountId,
      merchantName: tags["59"],
      merchantCity: tags["60"],
      amount,
      currency,
      crc: providedCrc,
      tags,
    };
  }
}
