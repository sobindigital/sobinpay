/**
 * @file SobinPay Playground - Live Sandbox & QR Code Tester
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

import { useState, useEffect } from "react";
import {
  CreditCard,
  QrCode,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "./Badge";
import openABAPopup, { openHostedCheckout, type CheckoutPayload } from "../lib/open-aba-popup";
import { KhqrCard } from "./KhqrCard";
import { KhqrCheckoutModal } from "./KhqrCheckoutModal";

export function PlaygroundTester() {
  const [mode, setMode] = useState<
    "payway-popup" | "payway-qr" | "khqr-individual" | "khqr-merchant"
  >("payway-popup");

  // Credentials
  const [showConfig, setShowConfig] = useState(false);
  const [merchantId, setMerchantId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("https://checkout-sandbox.payway.com.kh");

  // Transaction fields
  const [amount, setAmount] = useState<number>(1.5);
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  // Use hyphen, strictly alphanumeric & hyphen (no underscores allowed by ABA PayWay)
  const [tranId, setTranId] = useState("sb-100001");
  const [firstName, setFirstName] = useState("Sok");
  const [lastName, setLastName] = useState("Chan");
  const [phone, setPhone] = useState("012 345 678");
  const [email, setEmail] = useState("customer@example.com");

  // ABA PayWay Options
  const [paymentOption, setPaymentOption] = useState<
    "abapay_khqr" | "cards" | "abapay_khqr_deeplink" | "alipay" | "wechat"
  >("abapay_khqr");
  const [viewType, setViewType] = useState<"popup" | "hosted">("popup");

  // KHQR specific
  const [bakongAccountId, setBakongAccountId] = useState("sobin_digital@aclb");
  const [merchantName, setMerchantName] = useState("Sobin Digital");

  // Generate dynamic client-side transaction id after initial hydration
  useEffect(() => {
    const randomSuffix = Math.floor(Math.random() * 8999 + 1000);
    setTranId(`sb-${Date.now().toString(36).slice(-5)}${randomSuffix}`);
  }, []);

  // States
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Results
  const [popupPayload, setPopupPayload] = useState<CheckoutPayload | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [qrResult, setQrResult] = useState<{
    qrString: string;
    qrDataUrl?: string;
    deeplink?: string;
    tranId?: string;
    amount?: number | string;
    currency?: string;
    merchantName?: string;
  } | null>(null);

  // Status check state
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<Record<string, unknown> | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCredentials = () => {
    setMerchantId("");
    setApiKey("");
    setApiUrl("https://checkout-sandbox.payway.com.kh");
  };

  const handleExecute = async () => {
    setLoading(true);
    setErrorMsg(null);
    setStatusResult(null);

    // Collision-resistant ID strictly matching ABA rules (no underscores, max 20 chars)
    const randomSuffix = Math.floor(Math.random() * 8999 + 1000);
    const freshTranId = `sb-${Date.now().toString(36).slice(-5)}${randomSuffix}`;
    setTranId(freshTranId);

    try {
      if (mode === "payway-popup") {
        const res = await fetch("/api/payway/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchantId,
            apiKey,
            apiUrl,
            tranId: freshTranId,
            amount,
            currency,
            paymentOption,
            viewType,
            firstName,
            lastName,
            email,
            phone,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to create popup purchase");

        const payload = data.data.payload as CheckoutPayload;
        setPopupPayload(payload);
        setCheckoutUrl(data.data.checkoutUrl || payload.actionUrl);

        if (viewType === "popup") {
          // Open popup modal using exact ABA PayWay SDK integration matching openABAPopup
          await openABAPopup(payload);
        } else {
          // Open hosted page via HTTP POST form in new tab (avoids HTTP 405 Method Not Allowed)
          openHostedCheckout(payload);
        }
      } else if (mode === "payway-qr") {
        const res = await fetch("/api/payway/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchantId,
            apiKey,
            apiUrl,
            tranId: freshTranId,
            amount,
            currency,
            firstName,
            lastName,
            email,
            phone,
            directKhqr: true,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to create direct QR");

        const qrData = data.data;
        const qrString = qrData.qrString || "";
        const deeplink = qrData.abapayDeeplink || qrData.deeplink || "";

        setQrResult({
          qrString,
          deeplink,
          tranId: qrData.tranId || freshTranId,
          amount,
          currency,
          merchantName: qrData.merchantName || "KAS Play",
        });
      } else {
        // Bakong KHQR individual or merchant
        const res = await fetch("/api/khqr/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: mode === "khqr-merchant" ? "merchant" : "individual",
            amount,
            currency,
            bakongAccountId,
            merchantName,
            billNumber: freshTranId,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to generate KHQR");

        setQrResult({
          qrString: data.data.qrString,
          deeplink: data.data.deeplink,
          tranId: freshTranId,
          amount,
          currency,
          merchantName,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    const targetId = qrResult?.tranId || popupPayload?.tran_id || tranId;
    if (!targetId) return;

    setCheckingStatus(true);
    try {
      const res = await fetch("/api/payway/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tranId: String(targetId),
          merchantId,
          apiKey,
          apiUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusResult(data.data);
      } else {
        setStatusResult({ error: data.error });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusResult({ error: msg });
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div id="interactive-tester" className="scroll-mt-24 space-y-8 my-10">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Terminal className="w-4 h-4" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Live Sandbox & QR Tester
            </h2>
            <Badge variant="emerald">Live Execution</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Interactive multi-provider sandbox. Test ABA PayWay popups and render scannable Bakong KHQR codes in real time.
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors self-start sm:self-center cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>{showConfig ? "Hide API Credentials" : "Custom Credentials"}</span>
        </button>
      </div>

      {/* Config Drawer */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              ABA PayWay Sandbox Credentials
            </h4>
            <button
              onClick={resetCredentials}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Clear Inputs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Merchant ID
              </label>
              <input
                type="text"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="e.g. sandbox_merchant_id"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                API Key (Hash Secret)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter secret API key..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                API Gateway URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://checkout-sandbox.payway.com.kh"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/70 border border-slate-800 rounded-xl">
        <button
          onClick={() => setMode("payway-popup")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${mode === "payway-popup"
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          ABA PayWay Checkout (Popup/Hosted)
        </button>
        <button
          onClick={() => setMode("payway-qr")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${mode === "payway-qr"
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          ABA Direct QR (REST API)
        </button>
        <button
          onClick={() => setMode("khqr-individual")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${mode === "khqr-individual"
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Bakong KHQR (Individual)
        </button>
        <button
          onClick={() => setMode("khqr-merchant")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${mode === "khqr-merchant"
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Bakong KHQR (Merchant)
        </button>
      </div>

      {/* Main Grid: Controls vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span>Transaction Parameters</span>
            <span className="text-[11px] font-mono text-slate-400 lowercase font-normal">
              {currency === "USD" ? "decimal: 2" : "decimal: 0"}
            </span>
          </h3>

          <div className="space-y-4">
            {/* Amount & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wide">
                  Amount ({currency})
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 font-mono text-sm select-none pointer-events-none">
                    {currency === "USD" ? "$" : "៛"}
                  </span>
                  <input
                    type="number"
                    step={currency === "USD" ? "0.1" : "100"}
                    min={currency === "USD" ? "0.1" : "100"}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex items-center gap-1.5 mt-2">
                  {(currency === "USD" ? [1, 5, 25, 100] : [4000, 20000, 60000, 200000]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors cursor-pointer ${amount === preset
                        ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      {currency === "USD" ? `$${preset}` : `${(preset / 1000).toFixed(0)}k៛`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wide">
                  Currency Rail
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency("USD");
                      if (amount > 100) setAmount(1.5);
                    }}
                    className={`py-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${currency === "USD"
                      ? "bg-blue-600/20 border-blue-500 text-blue-300 font-bold shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency("KHR");
                      if (amount < 100) setAmount(6000);
                    }}
                    className={`py-2 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${currency === "KHR"
                      ? "bg-blue-600/20 border-blue-500 text-blue-300 font-bold shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    KHR (៛)
                  </button>
                </div>
              </div>
            </div>

            {/* PayWay Popup/Hosted Specific Controls */}
            {mode === "payway-popup" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                {/* Checkout View Type: Popup Modal vs Hosted Redirect */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase flex items-center justify-between">
                    <span>Checkout View Mode</span>
                    <span className="text-blue-400 font-semibold">{viewType === "popup" ? "Modal Popup" : "Hosted Tab"}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setViewType("popup")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${viewType === "popup"
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Popup Modal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType("hosted")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer border ${viewType === "hosted"
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Hosted Redirect</span>
                    </button>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentOption("abapay_khqr")}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${paymentOption === "abapay_khqr"
                        ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">ABA PAY / KHQR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("cards")}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${paymentOption === "cards"
                        ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Cards (Visa/MC)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("abapay_khqr_deeplink")}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${paymentOption === "abapay_khqr_deeplink"
                        ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">Mobile Deeplink</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("alipay")}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${paymentOption === "alipay"
                        ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Alipay</span>
                    </button>
                  </div>

                  {/* Hidden inputs matching exact DOM class required by user's existing project */}
                  <input
                    type="radio"
                    name="payment_option"
                    value={paymentOption}
                    className="payment_option hidden"
                    checked
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Provider specific inputs */}
            {mode.startsWith("khqr") ? (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
                    Bakong Account ID
                  </label>
                  <input
                    type="text"
                    value={bakongAccountId}
                    onChange={(e) => setBakongAccountId(e.target.value)}
                    placeholder="account@bank"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
                    Merchant Name
                  </label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Error banner if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="break-all">{errorMsg}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              disabled={loading}
              onClick={handleExecute}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : mode === "payway-popup" ? (
                <>
                  <span>
                    {viewType === "popup"
                      ? "Launch ABA PayWay Popup"
                      : "Open Hosted Checkout Page"}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Generate Dynamic QR Code</span>
                  <QrCode className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick status check bar */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Tran ID:</span>
              <span className="font-mono text-slate-200" suppressHydrationWarning>
                {tranId}
              </span>
            </div>
            <button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              className="w-full mt-2 py-2 px-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? "animate-spin" : ""}`} />
              <span>Query check-transaction-2</span>
            </button>
          </div>
        </div>

        {/* Display / Output Column */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                {mode === "payway-popup" ? "Signed PayWay Session" : "Scannable QR & Deeplink"}
              </h3>
              {popupPayload && (
                <Badge variant="emerald">
                  <Check className="w-3 h-3" /> Signed & Verified
                </Badge>
              )}
            </div>

            {/* Content view */}
            {mode === "payway-popup" ? (
              popupPayload ? (
                <div className="space-y-4 animate-in fade-in">
                  {/* Active Popup Control Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-white">
                          Session Ready: {popupPayload.tran_id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {popupPayload.currency} {popupPayload.amount} • {popupPayload.payment_option}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openABAPopup(popupPayload)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Re-open Popup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openHostedCheckout(popupPayload)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Open full-page hosted checkout in a new tab via POST"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Hosted Tab</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto font-mono text-xs text-slate-300 max-h-80">
                    <pre>{JSON.stringify(popupPayload, null, 2)}</pre>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Cryptographic HMAC-SHA512 hash verified
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("debug-webhook", {
                              detail: { payload: popupPayload },
                            }),
                          );
                          const el = document.getElementById(
                            "interactive-webhook-debugger",
                          );
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-purple-400 hover:text-purple-300 text-xs font-mono transition-colors cursor-pointer"
                      >
                        Debug Signature →
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(JSON.stringify(popupPayload, null, 2))
                        }
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                  <CreditCard className="w-12 h-12 mb-3 text-blue-500/40" />
                  <p className="text-sm text-slate-400 font-medium">Ready to Test Popup Checkout</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Select your payment method (ABA PAY KHQR or Cards), then click &quot;Launch ABA PayWay Popup&quot; to test the native popup modal.
                  </p>
                </div>
              )
            ) : qrResult ? (
              <div className="space-y-6 flex flex-col items-center animate-in fade-in w-full">
                {/* Official Standard Bakong KHQR Physical Ticket Card */}
                <KhqrCard
                  qrString={qrResult.qrString}
                  merchantName={qrResult.merchantName || merchantName || "Sobin Digital"}
                  amount={qrResult.amount ?? amount}
                  currency={qrResult.currency || currency}
                  billNumber={qrResult.tranId || tranId}
                  accountNumber={
                    mode === "khqr-individual" || mode === "khqr-merchant"
                      ? bakongAccountId
                      : undefined
                  }
                  deeplink={qrResult.deeplink}
                  onInspect={() => {
                    window.dispatchEvent(
                      new CustomEvent("inspect-khqr", {
                        detail: { qrString: qrResult.qrString },
                      }),
                    );
                    const el = document.getElementById(
                      "interactive-khqr-inspector",
                    );
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                />

                {/* Launch Interactive Customer Checkout Modal (Popup Dialog) */}
                <div className="w-full max-w-sm sm:max-w-md">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="w-full py-3 px-4 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Launch Customer Checkout Modal (Popup Dialog)</span>
                  </button>
                </div>

                {/* Raw String */}
                <div className="w-full max-w-sm sm:max-w-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="uppercase font-semibold">Raw EMVCo Payload</span>
                    <button
                      onClick={() => handleCopy(qrResult.qrString)}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all max-h-24 overflow-y-auto">
                    {qrResult.qrString}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                <QrCode className="w-12 h-12 mb-3 text-blue-500/40" />
                <p className="text-sm text-slate-400 font-medium">Ready to Render EMVCo QR</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Click &quot;Generate Dynamic QR Code&quot; to generate an authentic Bakong KHQR with 16-bit CRC checksum.
                </p>
              </div>
            )}

            {/* Status check result banner if present */}
            {statusResult && (
              <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-semibold text-blue-400">
                    check-transaction-2 Response:
                  </span>
                  <span className="text-[10px] text-slate-500">Live API</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto text-[11px]">
                  {JSON.stringify(statusResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Integration snippet */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Clean 3-Line Node / TypeScript Call:
            </span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <span className="text-purple-400">import</span> &#123; SobinPay &#125;{" "}
              <span className="text-purple-400">from</span>{" "}
              <span className="text-emerald-400">&quot;@sobindigital/pay&quot;</span>;<br />
              <span className="text-purple-400">const</span> sobin ={" "}
              <span className="text-purple-400">new</span> SobinPay(&#123; aba: &#123; merchantId, apiKey &#125; &#125;);<br />
              <span className="text-purple-400">const</span> purchase = sobin.aba.createPurchase(&#123; amount:{" "}
              <span className="text-amber-400">{amount}</span>, currency:{" "}
              <span className="text-emerald-400">&quot;{currency}&quot;</span>, tranId:{" "}
              <span className="text-emerald-400">&quot;{tranId}&quot;</span> &#125;);
            </div>
          </div>
        </div>
      </div>

      {/* Customer Checkout Modal Dialog */}
      {qrResult && (
        <KhqrCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          qrString={qrResult.qrString}
          orderNo={qrResult.tranId || tranId}
          amount={qrResult.amount ?? amount}
          currency={qrResult.currency || currency}
          merchantName={qrResult.merchantName || merchantName || "Sobin Digital"}
          deeplink={qrResult.deeplink}
          merchantId={merchantId}
          apiKey={apiKey}
          apiUrl={apiUrl}
          isAbaPayway={mode === "payway-qr"}
        />
      )}
    </div>
  );
}
