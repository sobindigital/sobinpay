/**
 * @file SobinPay Playground - Webhook Debugger & Signature Verifier
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

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Code2,
} from "lucide-react";
import { Badge } from "./Badge";

const SAMPLE_APPROVED_USD = {
  tran_id: "sb-982341",
  payment_option: "abapay_khqr",
  status: "APPROVED",
  currency: "USD",
  original_amount: "15.50",
  apv: "098124",
  bank_ref: "ABA-20261110-876123",
  req_time: "20261110153022",
  merchant_id: "sandbox_merchant",
};

const SAMPLE_APPROVED_KHR = {
  tran_id: "sb-441209",
  payment_option: "abapay_khqr",
  status: "APPROVED",
  currency: "KHR",
  original_amount: "62000",
  apv: "119842",
  bank_ref: "ABA-20261110-449102",
  req_time: "20261110154011",
  merchant_id: "sandbox_merchant",
};

const SAMPLE_DECLINED = {
  tran_id: "sb-771923",
  payment_option: "cards",
  status: "DECLINED",
  currency: "USD",
  original_amount: "50.00",
  bank_ref: "ABA-20261110-001294",
  req_time: "20261110154500",
  merchant_id: "sandbox_merchant",
};

export function WebhookDebugger() {
  const [apiKey, setApiKey] = useState("sandbox_secret_key_demo");
  const [payloadJson, setPayloadJson] = useState(() =>
    JSON.stringify(SAMPLE_APPROVED_USD, null, 2),
  );
  const [receivedSignature, setReceivedSignature] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    canonicalString: string;
    calculatedSignature: string;
    receivedSignature: string;
    canonicalParts?: Array<{ key: string; value: string }>;
  } | null>(null);

  // Cross-tool listener: automatically load payload from playground tester
  React.useEffect(() => {
    const handleCustomDebug = (e: Event) => {
      const customEvent = e as CustomEvent<{ payload?: Record<string, unknown> }>;
      if (customEvent.detail?.payload) {
        const payloadObj = customEvent.detail.payload;
        setPayloadJson(JSON.stringify(payloadObj, null, 2));
        loadPreset(payloadObj);
      }
    };

    window.addEventListener("debug-webhook", handleCustomDebug);
    return () => window.removeEventListener("debug-webhook", handleCustomDebug);
  }, [apiKey]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadPreset = async (
    sample: Record<string, unknown>,
    tamper = false,
  ) => {
    const jsonStr = JSON.stringify(sample, null, 2);
    setPayloadJson(jsonStr);

    // Compute signature for preset automatically
    try {
      const res = await fetch("/api/payway/verify-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: sample,
          apiKey,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const sig = tamper
          ? `${data.data.calculatedSignature.slice(0, -6)}XYZ==`
          : data.data.calculatedSignature;
        setReceivedSignature(sig);

        // Verify with the signature
        const verifyRes = await fetch("/api/payway/verify-webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payload: sample,
            receivedSignature: sig,
            apiKey,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setVerificationResult(verifyData.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      let parsedPayload: Record<string, unknown> = {};
      try {
        parsedPayload = JSON.parse(payloadJson);
      } catch {
        alert("Invalid JSON format in Webhook Payload");
        setVerifying(false);
        return;
      }

      const res = await fetch("/api/payway/verify-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: parsedPayload,
          receivedSignature: receivedSignature || undefined,
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.data);
        if (!receivedSignature) {
          setReceivedSignature(data.data.calculatedSignature);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div id="interactive-webhook-debugger" className="scroll-mt-24 space-y-8 my-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Webhook Signature Debugger
            </h2>
            <Badge variant="purple">HMAC-SHA512</Badge>
            <Badge variant="rose">Constant-Time</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Paste any ABA PayWay pushback webhook payload to inspect the canonical normalization string and verify the signature in constant time.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2 uppercase">
          Quick Presets:
        </span>
        <button
          onClick={() => loadPreset(SAMPLE_APPROVED_USD)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
        >
          ✓ Approved (USD $15.50)
        </button>
        <button
          onClick={() => loadPreset(SAMPLE_APPROVED_KHR)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
        >
          ✓ Approved (KHR 62,000)
        </button>
        <button
          onClick={() => loadPreset(SAMPLE_DECLINED)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
        >
          ✕ Declined Payment
        </button>
        <button
          onClick={() => loadPreset(SAMPLE_APPROVED_USD, true)}
          className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs text-rose-300 font-mono transition-colors"
        >
          ⚠ Simulate Tampered Signature
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Webhook Request Body (JSON)
            </h3>
            <button
              onClick={() => handleCopy(payloadJson, "payload")}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
            >
              {copied === "payload" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied === "payload" ? "Copied" : "Copy JSON"}
            </button>
          </div>

          <textarea
            rows={11}
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            placeholder="Paste raw JSON webhook payload..."
          />

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
              Received Signature (Header: X-PayWay-HMAC-SHA512)
            </label>
            <input
              type="text"
              value={receivedSignature}
              onChange={(e) => setReceivedSignature(e.target.value)}
              placeholder="Leave blank to auto-compute or paste incoming header..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
              Secret API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-mono"
          >
            {verifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Hash...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Compute & Verify Signature</span>
              </>
            )}
          </button>
        </div>

        {/* Diagnostic Output Column */}
        <div className="lg:col-span-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Cryptographic Trace
              </h3>
              {verificationResult && (
                <div className="flex items-center gap-1.5">
                  {verificationResult.isValid ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      SIGNATURE VALID
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/15 border border-rose-500/30 text-rose-400">
                      <XCircle className="w-4 h-4" />
                      SIGNATURE MISMATCH
                    </span>
                  )}
                </div>
              )}
            </div>

            {verificationResult ? (
              <div className="space-y-4">
                {/* Step 1: Canonical string */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Step 1: Canonical String (Sorted Keys + Values)</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          verificationResult.canonicalString,
                          "canonical",
                        )
                      }
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copied === "canonical" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 break-all select-all">
                    {verificationResult.canonicalString}
                  </div>
                </div>

                {/* Step 2: Computed Hash */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Step 2: Computed HMAC-SHA512 (Base64)</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          verificationResult.calculatedSignature,
                          "computed",
                        )
                      }
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copied === "computed" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 break-all select-all">
                    {verificationResult.calculatedSignature}
                  </div>
                </div>

                {/* Step 3: Comparison */}
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-mono text-slate-400">
                    Step 3: Constant-Time Comparison
                  </span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Provided:</span>
                      <span className="truncate max-w-[280px]">
                        {verificationResult.receivedSignature || "(none provided)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected:</span>
                      <span className="truncate max-w-[280px]">
                        {verificationResult.calculatedSignature}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-500">timingSafeEqual:</span>
                      <span
                        className={
                          verificationResult.isValid
                            ? "text-emerald-400 font-bold"
                            : "text-rose-400 font-bold"
                        }
                      >
                        {verificationResult.isValid ? "true (PASS)" : "false (FAIL)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                <Code2 className="w-12 h-12 mb-3 text-slate-600" />
                <p className="text-sm text-slate-400 font-medium">Ready to Verify Webhook</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Click a quick preset above or paste your payload to inspect canonical string generation and verify HMAC signatures.
                </p>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Timing Attack Protection
            </span>
            <p className="leading-relaxed">
              SobinPay strictly uses Node.js <code>crypto.timingSafeEqual</code> under the hood to ensure execution time does not leak cryptographic digest bytes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

