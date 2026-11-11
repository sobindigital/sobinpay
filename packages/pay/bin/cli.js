#!/usr/bin/env node

/**
 * @file SobinPay CLI & AI Agent Skills Installer
 * @author Sobin Digital
 * @license MIT
 *
 * Copyright (c) 2026 Sobin Digital. All rights reserved.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const VERSION = "0.1.1";

const SKILL_CONTENT = `# SobinPay Payment Integration Guide & Best Practices
# Engineered by Sobin Digital (https://pay.sobindigital.com)

You are an expert engineer integrating Cambodia payments with @sobindigital/pay.
SobinPay is the official TypeScript payment engine combining ABA PayWay and NBC Bakong KHQR.

## Critical Security Rules
1. Webhook Verification: ALWAYS verify PayWay pushback webhooks using \`verifyPayWayWebhook(payload, apiKey)\`. NEVER use string equality \`===\`; SobinPay uses constant-time \`crypto.timingSafeEqual\` to prevent timing attacks.
2. Credentials: Store \`ABA_PAYWAY_API_KEY\` and \`ABA_PAYWAY_MERCHANT_ID\` strictly in server-side environment variables. Never expose them to browser bundles.
3. Monetary Precision: Work with integer cents (BigInt) to eliminate IEEE-754 floating-point rounding bugs.

## Common Recipes

### 1. ABA PayWay Web Checkout (Next.js / Node.js)
\`\`\`typescript
import { PayWayClient } from "@sobindigital/provider-payway";

const payway = new PayWayClient({
  merchantId: process.env.ABA_PAYWAY_MERCHANT_ID!,
  apiKey: process.env.ABA_PAYWAY_API_KEY!,
  mode: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

const checkout = await payway.createTransaction({
  tranId: "INV-" + Date.now(),
  amount: 25.00,
  reqTime: PayWayClient.formatReqTime(new Date()),
  paymentOption: "cards",
  returnUrl: "https://yourdomain.com/checkout/success",
});
\`\`\`

### 2. Standalone Bakong KHQR Generation (EMVCo)
\`\`\`typescript
import { generateMerchantKhqr, parseKhqr } from "@sobindigital/provider-khqr";

const khqr = generateMerchantKhqr({
  bakongAccountId: "sobindigital@aba",
  merchantName: "Sobin Digital Store",
  merchantCity: "Phnom Penh",
  currency: "USD",
  amount: 15.50,
  billNumber: "INV-1001",
});

// khqr.qr contains the official 29-tag EMVCo string with CRC-16
// khqr.md5 contains the payment tracking hash
\`\`\`

### 3. Timing-Safe Webhook Route Handler (Next.js App Router)
\`\`\`typescript
// app/api/webhooks/payway/route.ts
import { NextResponse } from "next/server";
import { verifyPayWayWebhook } from "@sobindigital/provider-payway";

export async function POST(req: Request) {
  const payload = await req.json();
  const isValid = verifyPayWayWebhook(payload, process.env.ABA_PAYWAY_API_KEY!);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Idempotently process confirmed payment
  const { tran_id, status } = payload;
  return NextResponse.json({ status: "success" });
}
\`\`\`
`;

const CURSOR_MDC_HEADER = `---
description: SobinPay SDK rules and Cambodia payment patterns (ABA PayWay & Bakong KHQR)
globs: **/*.{ts,tsx,js,jsx}
alwaysApply: false
---

`;

function printBanner() {
  console.log(`
\x1b[36m⚡️ SobinPay CLI v${VERSION} — by Sobin Digital\x1b[0m
Official TypeScript Payment Gateway SDK for Cambodia (ABA PayWay & Bakong KHQR)
`);
}

function showHelp() {
  printBanner();
  console.log(`Usage:
  npx @sobindigital/pay skills add <agent...>    Install skill rules for AI assistants
  npx @sobindigital/pay skills list              List installed AI agent skills
  npx @sobindigital/pay skills remove <agent...> Remove installed skills
  npx @sobindigital/pay doctor                   Verify installation and environment

Supported AI Agents:
  cursor     Cursor IDE (.cursor/rules/sobinpay.mdc)
  claude     Claude Code & Claude Desktop (.claude/skills/sobinpay.md)
  copilot    GitHub Copilot (.github/copilot-instructions.md)
  windsurf   Windsurf IDE (.windsurfrules)
  codex      OpenAI Codex / ChatGPT (.agent/sobinpay.md)

Examples:
  npx @sobindigital/pay skills add cursor
  npx @sobindigital/pay skills add cursor claude copilot
`);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function addSkill(agent) {
  const root = process.cwd();

  switch (agent.toLowerCase()) {
    case "cursor": {
      const dir = path.join(root, ".cursor", "rules");
      ensureDir(dir);
      const file = path.join(dir, "sobinpay.mdc");
      fs.writeFileSync(file, CURSOR_MDC_HEADER + SKILL_CONTENT, "utf-8");
      console.log(`\x1b[32m✅ Installed Cursor rule:\x1b[0m .cursor/rules/sobinpay.mdc`);
      break;
    }
    case "claude": {
      const dir = path.join(root, ".claude", "skills");
      ensureDir(dir);
      const file = path.join(dir, "sobinpay.md");
      fs.writeFileSync(file, SKILL_CONTENT, "utf-8");
      console.log(`\x1b[32m✅ Installed Claude skill:\x1b[0m .claude/skills/sobinpay.md`);
      break;
    }
    case "copilot": {
      const dir = path.join(root, ".github");
      ensureDir(dir);
      const file = path.join(dir, "copilot-instructions.md");
      let existing = "";
      if (fs.existsSync(file)) {
        existing = fs.readFileSync(file, "utf-8") + "\n\n";
      }
      if (!existing.includes("SobinPay Payment Integration Guide")) {
        fs.writeFileSync(file, existing + SKILL_CONTENT, "utf-8");
      }
      console.log(`\x1b[32m✅ Configured GitHub Copilot instructions:\x1b[0m .github/copilot-instructions.md`);
      break;
    }
    case "windsurf": {
      const file = path.join(root, ".windsurfrules");
      let existing = "";
      if (fs.existsSync(file)) {
        existing = fs.readFileSync(file, "utf-8") + "\n\n";
      }
      if (!existing.includes("SobinPay Payment Integration Guide")) {
        fs.writeFileSync(file, existing + SKILL_CONTENT, "utf-8");
      }
      console.log(`\x1b[32m✅ Configured Windsurf rules:\x1b[0m .windsurfrules`);
      break;
    }
    case "codex":
    case "chatgpt": {
      const dir = path.join(root, ".agent");
      ensureDir(dir);
      const file = path.join(dir, "sobinpay.md");
      fs.writeFileSync(file, SKILL_CONTENT, "utf-8");
      console.log(`\x1b[32m✅ Installed AI Agent instructions:\x1b[0m .agent/sobinpay.md`);
      break;
    }
    default:
      console.log(`\x1b[33m⚠️  Unknown agent '${agent}'. Supported: cursor, claude, copilot, windsurf, codex\x1b[0m`);
  }
}

function listSkills() {
  printBanner();
  console.log("Checking installed AI Agent Skills in current workspace:\n");
  const checks = [
    { name: "Cursor IDE", file: ".cursor/rules/sobinpay.mdc" },
    { name: "Claude Code", file: ".claude/skills/sobinpay.md" },
    { name: "GitHub Copilot", file: ".github/copilot-instructions.md" },
    { name: "Windsurf IDE", file: ".windsurfrules" },
    { name: "AI Agent (Codex)", file: ".agent/sobinpay.md" },
  ];

  let found = 0;
  for (const c of checks) {
    const exists = fs.existsSync(path.join(process.cwd(), c.file));
    if (exists) {
      console.log(`  \x1b[32m● Installed:\x1b[0m ${c.name} (${c.file})`);
      found++;
    } else {
      console.log(`  \x1b[90m○ Not installed: ${c.name} (${c.file})\x1b[0m`);
    }
  }

  if (found === 0) {
    console.log(`\n\x1b[33mNo AI skills installed yet. Run:\x1b[0m`);
    console.log(`  npx @sobindigital/pay skills add cursor claude copilot`);
  }
}

function runDoctor() {
  printBanner();
  console.log("Running SobinPay Environment Check:\n");
  console.log(`  Node.js version: ${process.version}`);
  console.log(`  SobinPay SDK:    v${VERSION}`);
  console.log(`  Workspace:       ${process.cwd()}`);

  const hasAbaKey = Boolean(process.env.ABA_PAYWAY_API_KEY || process.env.ABA_API_KEY);
  const hasAbaMerchant = Boolean(process.env.ABA_PAYWAY_MERCHANT_ID || process.env.ABA_MERCHANT_ID);

  console.log(`  ABA_API_KEY:     ${hasAbaKey ? "\x1b[32mConfigured\x1b[0m" : "\x1b[33mMissing (Set in .env)\x1b[0m"}`);
  console.log(`  ABA_MERCHANT_ID: ${hasAbaMerchant ? "\x1b[32mConfigured\x1b[0m" : "\x1b[33mMissing (Set in .env)\x1b[0m"}`);
  console.log(`\nDocumentation: https://pay.sobindigital.com`);
  console.log(`Telegram:      https://t.me/sobindigital`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h" || command === "help") {
    showHelp();
    return;
  }

  if (command === "--version" || command === "-v") {
    console.log(`v${VERSION}`);
    return;
  }

  if (command === "doctor") {
    runDoctor();
    return;
  }

  if (command === "skills" || command === "skill") {
    const sub = args[1];
    if (sub === "add") {
      const agents = args.slice(2);
      if (agents.length === 0) {
        console.log("\x1b[31mError: Please specify at least one agent (e.g. cursor, claude, copilot)\x1b[0m");
        console.log("Example: npx @sobindigital/pay skills add cursor claude");
        return;
      }
      printBanner();
      for (const a of agents) {
        addSkill(a);
      }
      console.log(`\n\x1b[32m✨ Done! Your AI assistants are now configured with SobinPay intelligence.\x1b[0m`);
      return;
    }

    if (sub === "list" || sub === "ls") {
      listSkills();
      return;
    }

    if (sub === "help" || !sub) {
      showHelp();
      return;
    }
  }

  console.log(`\x1b[31mUnknown command '${command}'\x1b[0m`);
  showHelp();
}

main();
