/**
 * @file SobinPay Playground - Bakong KHQR Generator API
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

import { NextResponse } from "next/server";
import { SobinPay } from "@sobin/pay";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode || "individual"; // "individual" | "merchant"
    const bakongAccountId = body.bakongAccountId || "sobin_digital@aclb";
    const merchantName = body.merchantName || "Sobin Digital";
    const amount = body.amount !== undefined && body.amount !== "" ? Number(body.amount) : undefined;
    const currency = body.currency || "USD";
    const billNumber = body.billNumber || `INV-${Date.now().toString().slice(-4)}`;
    const merchantCity = body.merchantCity || "Phnom Penh";
    const storeLabel = body.storeLabel || "Store 01";
    const terminalLabel = body.terminalLabel || "POS 01";

    let qrString = "";

    if (mode === "merchant") {
      qrString = SobinPay.khqr.generateMerchant({
        bakongAccountId,
        merchantId: body.merchantId || "000000001",
        acquiringBank: body.acquiringBank || "Bakong Bank",
        merchantName,
        merchantCity,
        amount,
        currency,
        billNumber,
        storeLabel,
        terminalLabel,
      });
    } else {
      qrString = SobinPay.khqr.generateIndividual({
        bakongAccountId,
        merchantName,
        merchantCity,
        amount,
        currency,
        billNumber,
        storeLabel,
        terminalLabel,
      });
    }

    const qrDataUrl = await QRCode.toDataURL(qrString, {
      margin: 1,
      width: 360,
      color: {
        dark: "#0a0e17",
        light: "#ffffff",
      },
    });

    const deeplink = SobinPay.khqr.deeplink(qrString);
    const parsed = SobinPay.khqr.parse(qrString);

    return NextResponse.json({
      success: true,
      data: {
        qrString,
        qrDataUrl,
        deeplink,
        amount,
        currency,
        merchantName,
        billNumber,
        mode,
        parsed,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
