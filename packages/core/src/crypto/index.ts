/**
 * @file SobinPay Core - High-Performance Cryptography & Constant-Time Utilities
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
  createHmac,
  timingSafeEqual,
  publicEncrypt,
  constants,
} from "node:crypto";

/**
 * Performs timing-safe comparison to prevent timing attacks on signatures.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");

  if (bufA.length !== bufB.length) {
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}

/**
 * Computes Base64-encoded HMAC-SHA512.
 */
export function createHmacSha512Base64(data: string, secret: string): string {
  return createHmac("sha512", secret).update(data, "utf-8").digest("base64");
}

/**
 * Computes Hex-encoded HMAC-SHA256.
 */
export function createHmacSha256Hex(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data, "utf-8").digest("hex");
}

/**
 * Encrypts an arbitrary string payload in RSA chunks using standard PKCS1 padding.
 */
export function rsaEncryptChunks(
  plaintext: string,
  publicKeyPem: string,
  chunkSize = 117,
): string {
  const buffer = Buffer.from(plaintext, "utf-8");
  const encryptedChunks: Buffer[] = [];

  for (let offset = 0; offset < buffer.length; offset += chunkSize) {
    const chunk = buffer.subarray(
      offset,
      Math.min(offset + chunkSize, buffer.length),
    );
    const encrypted = publicEncrypt(
      {
        key: publicKeyPem,
        padding: constants.RSA_PKCS1_PADDING,
      },
      chunk,
    );
    encryptedChunks.push(encrypted);
  }

  return Buffer.concat(encryptedChunks).toString("base64");
}
