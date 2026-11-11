/**
 * @file SobinPay Bakong KHQR - 16-bit CRC-CCITT Calculation
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

/**
 * Computes CRC16-CCITT (polynomial 0x1021, init 0xFFFF) matching EMVCo & Bakong specifications.
 */
export function calculateCrc16(data: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i);
    for (let bit = 0; bit < 8; bit++) {
      const bitVal = ((byte >> (7 - bit)) & 1) === 1;
      const c15 = ((crc >> 15) & 1) === 1;
      crc = (crc << 1) & 0xffff;
      if (c15 !== bitVal) {
        crc ^= polynomial;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}
