/**
 * @file SobinPay Bakong KHQR - Mobile App Universal Deeplink Helper
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
 * Generates universal mobile deep links for Bakong and partner banking apps.
 */
export function createBakongDeeplink(qrString: string): string {
  const encodedQr = encodeURIComponent(qrString);
  return `bakong://khqr?qr=${encodedQr}`;
}
