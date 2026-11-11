/**
 * @file SobinPay Documentation - Framework Recipes (Next.js, Express, NestJS)
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

"use client";

import React from "react";
import { CodeBlock } from "../CodeBlock";
import { Badge } from "../Badge";

export function FrameworkRecipes() {
  return (
    <div className="space-y-16">
      {/* 1. Next.js App Router */}
      <section id="recipe-nextjs" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Next.js 15 / 16</Badge>
          <Badge variant="blue">App Router & Server Actions</Badge>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Next.js App Router Recipe
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Production recipe for Next.js App Router utilizing Server Actions for purchase generation and Route Handlers for pushback webhooks.
        </p>

        <CodeBlock
          language="typescript"
          title="app/actions/checkout.ts (Server Action)"
          showLineNumbers
          code={`"use server";

import { SobinPay, AbaPaymentOption, AbaViewType } from "@sobin/pay";

const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_MERCHANT_ID!,
    apiKey: process.env.ABA_API_KEY!,
    apiUrl: process.env.ABA_API_URL,
  },
});

export async function createCheckoutSession(amount: number) {
  const purchase = sobin.aba.createPurchase({
    amount,
    currency: "USD",
    returnUrl: \`\${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success\`,
    cancelUrl: \`\${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel\`,
    paymentOption: AbaPaymentOption.ABAPAY_KHQR,
    viewType: AbaViewType.POPUP,
  });

  return {
    actionUrl: purchase.actionUrl,
    payload: purchase.payload,
  };
}`}
        />

        <CodeBlock
          language="typescript"
          title="app/api/webhooks/payway/route.ts (Webhook Route Handler)"
          showLineNumbers
          code={`import { NextResponse } from "next/server";
import { SobinPay } from "@sobin/pay";

const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_MERCHANT_ID!,
    apiKey: process.env.ABA_API_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-payway-hmac-sha512") || payload.hash;

    const verification = sobin.aba.verifyWebhook(payload, signature);

    if (!verification.isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (verification.status === "APPROVED") {
      // Perform database update in constant time
      console.log("Order paid:", verification.tranId);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Webhook processing error" }, { status: 400 });
  }
}`}
        />
      </section>

      {/* 2. Express.js Recipe */}
      <section id="recipe-express" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Express.js</Badge>
          <Badge variant="blue">REST API</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Express.js Recipe
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Standard Node.js / Express integration with pushback webhook verification.
        </p>

        <CodeBlock
          language="typescript"
          title="server.ts (Express)"
          showLineNumbers
          code={`import express from "express";
import { SobinPay, AbaPaymentOption } from "@sobin/pay";

const app = express();
app.use(express.json());

const sobin = new SobinPay({
  aba: {
    merchantId: process.env.ABA_MERCHANT_ID!,
    apiKey: process.env.ABA_API_KEY!,
  },
});

// Create checkout
app.post("/api/checkout", (req, res) => {
  const purchase = sobin.aba.createPurchase({
    amount: req.body.amount,
    currency: "USD",
    returnUrl: "https://example.com/success",
    paymentOption: AbaPaymentOption.ABAPAY_KHQR,
  });
  res.json(purchase);
});

// Receive Pushback Webhook
app.post("/api/payway/webhook", (req, res) => {
  const signature = req.headers["x-payway-hmac-sha512"] as string;
  const verification = sobin.aba.verifyWebhook(req.body, signature);

  if (!verification.isValid) {
    return res.status(401).send("Unauthorized Webhook");
  }

  // Handle successful transaction
  res.status(200).send("OK");
});

app.listen(4000, () => console.log("Server listening on port 4000"));`}
        />
      </section>

      {/* 3. NestJS Recipe */}
      <section id="recipe-nestjs" className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="rose">NestJS</Badge>
          <Badge variant="purple">Dependency Injection</Badge>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          NestJS Recipe (Service & Guard)
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Enterprise NestJS provider injection and custom canActivate guard.
        </p>

        <CodeBlock
          language="typescript"
          title="sobinpay.service.ts (NestJS Injectable)"
          showLineNumbers
          code={`import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SobinPay } from "@sobin/pay";

@Injectable()
export class SobinPayService {
  public readonly client: SobinPay;

  constructor(private configService: ConfigService) {
    this.client = new SobinPay({
      aba: {
        merchantId: this.configService.getOrThrow<string>("ABA_MERCHANT_ID"),
        apiKey: this.configService.getOrThrow<string>("ABA_API_KEY"),
        apiUrl: this.configService.get<string>("ABA_API_URL"),
      },
    });
  }
}`}
        />
      </section>
    </div>
  );
}

