/**
 * @file SobinPay Core - Domain Exceptions and Hierarchy
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

export class SobinPayError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code = "SOBINPAY_ERROR", details?: unknown) {
    super(message);
    this.name = "SobinPayError";
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SignatureVerificationError extends SobinPayError {
  constructor(message = "Cryptographic signature verification failed") {
    super(message, "SIGNATURE_VERIFICATION_FAILED");
    this.name = "SignatureVerificationError";
  }
}

export class InvalidAmountError extends SobinPayError {
  constructor(message = "Transaction amount must be a positive finite number") {
    super(message, "INVALID_AMOUNT");
    this.name = "InvalidAmountError";
  }
}

export class ProviderApiError extends SobinPayError {
  public readonly statusCode?: number;
  public readonly responseData?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    responseData?: unknown,
  ) {
    super(message, "PROVIDER_API_ERROR", { statusCode, responseData });
    this.name = "ProviderApiError";
    this.statusCode = statusCode;
    this.responseData = responseData;
  }
}
