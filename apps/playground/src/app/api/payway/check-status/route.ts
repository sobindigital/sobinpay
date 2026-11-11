/**
 * @file SobinPay Playground - ABA PayWay Check Transaction API
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
    const body = await req.json();
    const tranId = String(body.tranId || "").trim();

    if (!tranId) {
      return NextResponse.json(
        { success: false, error: "Transaction ID (tranId) is required" },
        { status: 400 },
      );
    }

    const merchantId = body.merchantId || process.env.ABA_MERCHANT_ID;
    const apiKey = body.apiKey || process.env.ABA_API_KEY;
    const apiUrl =
      body.apiUrl ||
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

    const detailed = Boolean(body.detailed);
    if (detailed) {
      const details = await sobin.aba.getTransactionDetail(tranId);
      return NextResponse.json({ success: true, data: details });
    }

    const status = await sobin.aba.checkTransaction(tranId);
    return NextResponse.json({ success: true, data: status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}

