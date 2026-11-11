/**
 * @file SobinPay Playground - ABA PayWay Exchange Rate API
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

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Allow empty body
    }

    const merchantId =
      (body.merchantId as string) || process.env.ABA_MERCHANT_ID;
    const apiKey = (body.apiKey as string) || process.env.ABA_API_KEY;
    const apiUrl =
      (body.apiUrl as string) ||
      process.env.ABA_API_URL ||
      "https://checkout-sandbox.payway.com.kh";

    if (!merchantId || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing ABA PayWay credentials. Please configure ABA_MERCHANT_ID and ABA_API_KEY in .env.local or provide them in the request.",
        },
        { status: 400 },
      );
    }

    const sobin = new SobinPay({
      aba: { merchantId, apiKey, apiUrl },
    });

    const rates = await sobin.aba.getExchangeRate();
    return NextResponse.json({ success: true, data: rates });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}

