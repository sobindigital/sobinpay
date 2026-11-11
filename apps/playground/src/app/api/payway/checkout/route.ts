/**
 * @file SobinPay Playground - ABA PayWay Checkout Route Handler
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
import { SobinPay, AbaPaymentOption, AbaViewType } from "@sobin/pay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
            "Missing ABA PayWay credentials. Please supply `merchantId` and `apiKey` in the request, or configure ABA_MERCHANT_ID and ABA_API_KEY in .env.local",
        },
        { status: 400 },
      );
    }

    const sobin = new SobinPay({
      aba: { merchantId, apiKey, apiUrl },
    });

    const amount = Number(body.amount) || 1.0;
    const currency = body.currency === "KHR" ? "KHR" : "USD";
    const rawTranId = body.tranId
      ? String(body.tranId)
      : sobin.aba.generateTransactionId("sb");
    // Ensure tran_id adheres strictly to ABA rules (no underscores, max 20 chars)
    const tranId = rawTranId.replace(/_/g, "-").slice(0, 20);
    const returnUrl = body.returnUrl || "http://localhost:3000/success";
    const cancelUrl = body.cancelUrl || "http://localhost:3000/cancel";

    if (body.directKhqr) {
      // Direct QR generation via REST API
      const qrResult = await sobin.aba.createQR({
        tranId,
        amount,
        currency,
        returnUrl,
        customer: {
          firstName: body.firstName || "Sok",
          lastName: body.lastName || "Chan",
          email: body.email || "customer@example.com",
          phone: body.phone || "012345678",
        },
      });

      if (!qrResult.isSuccess || !qrResult.qrString) {
        const errMsg =
          qrResult.statusMessage ||
          qrResult.description ||
          (qrResult.statusCode ? `ABA Gateway Error (Code: ${qrResult.statusCode})` : null) ||
          "Failed to generate direct KHQR from ABA PayWay";
        return NextResponse.json(
          { success: false, error: errMsg, data: qrResult },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...qrResult,
          amount,
          currency,
          merchantName: body.merchantName || "Sobin Digital",
          billNumber: tranId,
        },
      });
    }

    // Checkout purchase (Popup or Hosted view)
    const viewType = body.viewType === "hosted" ? AbaViewType.HOSTED : AbaViewType.POPUP;
    const paymentOption = body.paymentOption || AbaPaymentOption.ABAPAY_KHQR;

    const purchase = sobin.aba.createPurchase({
      tranId,
      amount,
      currency,
      returnUrl,
      cancelUrl,
      paymentOption,
      viewType,
      customer: {
        firstName: body.firstName || "Sok",
        lastName: body.lastName || "Chan",
        email: body.email || "customer@example.com",
        phone: body.phone || "012345678",
      },
      items: [
        {
          name: body.itemName || "SobinPay Developer Plan",
          quantity: 1,
          price: amount,
        },
      ],
    });

    return NextResponse.json({ success: true, data: purchase });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
