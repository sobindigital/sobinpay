/**
 * @file SobinPay Playground - Webhook Debugger & Signature Verifier API
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
import { createHmacSha512Base64, timingSafeEqualString } from "@sobin/pay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = (body.payload as Record<string, unknown>) || {};
    const apiKey = (body.apiKey as string) || process.env.ABA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing API Key. Please enter an API key or configure ABA_API_KEY in .env.local to verify HMAC signatures.",
        },
        { status: 400 },
      );
    }
    const receivedSignature =
      (body.receivedSignature as string) ||
      (payload.hash as string) ||
      "";

    // Replicate ABA canonical string concatenation:
    // Sort all payload keys alphabetically (excluding hash if present) and concatenate values
    const keys = Object.keys(payload)
      .filter((k) => k !== "hash")
      .sort();

    const canonicalParts: Array<{ key: string; value: string }> = [];
    let canonicalString = "";

    for (const key of keys) {
      const val = payload[key];
      const strVal =
        val === undefined || val === null
          ? ""
          : typeof val === "object"
            ? JSON.stringify(val)
            : String(val);
      canonicalParts.push({ key, value: strVal });
      canonicalString += strVal;
    }

    const calculatedSignature = createHmacSha512Base64(canonicalString, apiKey);
    const isValid = Boolean(
      receivedSignature &&
        timingSafeEqualString(receivedSignature.trim(), calculatedSignature.trim()),
    );

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        canonicalString,
        canonicalParts,
        calculatedSignature,
        receivedSignature,
        testedWithApiKey: `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`,
        tranId: payload.tran_id,
        status: payload.status,
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

