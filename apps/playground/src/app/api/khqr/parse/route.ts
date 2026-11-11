/**
 * @file SobinPay Playground - Bakong KHQR Parser & CRC16 API
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
import { SobinPay, calculateCrc16 } from "@sobindigital/pay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const qrString = String(body.qrString || "").trim();

    if (!qrString) {
      return NextResponse.json(
        { success: false, error: "qrString is required" },
        { status: 400 },
      );
    }

    const parsed = SobinPay.khqr.parse(qrString);
    const payloadWithoutCrc = qrString.length >= 4 ? qrString.slice(0, -4) : qrString;
    const computedCrc = calculateCrc16(payloadWithoutCrc);

    return NextResponse.json({
      success: true,
      data: {
        ...parsed,
        computedCrc,
        crcMatches: parsed.crc.toUpperCase() === computedCrc.toUpperCase(),
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

