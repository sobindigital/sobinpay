/**
 * @file SobinPay - Interactive KHQR Customer Checkout Modal
 * @description Authentic customer-facing KHQR payment modal matching ABA PayWay popup specification
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

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  X,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import { KhqrCard } from "./KhqrCard";

export interface KhqrCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrString: string;
  orderNo: string;
  amount: number | string;
  currency?: string;
  merchantName?: string;
  deeplink?: string;
  merchantId?: string;
  apiKey?: string;
  apiUrl?: string;
  isAbaPayway?: boolean;
}

export function KhqrCheckoutModal({
  isOpen,
  onClose,
  qrString,
  orderNo,
  amount,
  currency = "USD",
  merchantName = "Sobin Digital",
  deeplink,
  merchantId,
  apiKey,
  apiUrl,
  isAbaPayway = true,
}: KhqrCheckoutModalProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "failed">("pending");
  const [isPolling, setIsPolling] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);

  // Reset states on modal open
  useEffect(() => {
    if (isOpen) {
      setStatus("pending");
      setIsPolling(true);
      setIsSimulated(false);
    }
  }, [isOpen, orderNo]);

  // Real-time status polling for ABA PayWay transactions
  useEffect(() => {
    if (!isOpen || !isPolling || !orderNo || !isAbaPayway || status === "approved") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/payway/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tranId: orderNo,
            merchantId,
            apiKey,
            apiUrl,
          }),
        });
        const data = await res.json();

        if (data.success && data.data) {
          const result = data.data as { isApproved?: boolean; status?: string };
          if (
            result.isApproved ||
            result.status === "APPROVED" ||
            result.status === "completed"
          ) {
            setStatus("approved");
            setIsPolling(false);
          }
        }
      } catch (err) {
        console.warn("[KhqrCheckoutModal] Polling error:", err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, isPolling, orderNo, isAbaPayway, status, merchantId, apiKey, apiUrl]);

  if (!isOpen) return null;

  const numAmount = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
  const displayAmount =
    currency.toUpperCase() === "KHR"
      ? `${Math.round(numAmount).toLocaleString()} KHR`
      : `$${numAmount.toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md sm:max-w-[490px] bg-white rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-900 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header matching official ABA popup */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
          <h3 className="text-xl font-bold text-[#0a1b39]">
            ABA KHQR
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#00bcd4] hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {status === "approved" ? (
          /* Payment Confirmed Celebration State */
          <div className="py-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Payment Confirmed!
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Transaction has been verified and settled via Bakong KHQR.
            </p>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-left space-y-2 mb-6">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-900">{orderNo}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-700">{displayAmount}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Settlement Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  APPROVED (00)
                </span>
              </div>
              {isSimulated && (
                <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-700/80 italic">
                  Note: Verified via developer sandbox simulation.
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* Active Payment Card View */
          <div>
            <KhqrCard
              qrString={qrString}
              merchantName={merchantName}
              amount={amount}
              currency={currency}
              billNumber={orderNo}
              deeplink={deeplink}
              showActions={false}
              className="w-full max-w-full"
            />

            {/* Mobile Deeplink Button inside modal */}
            {deeplink && (
              <a
                href={deeplink}
                className="mt-3.5 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
              >
                <span>📲 Tap to Pay in ABA Mobile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Developer Sandbox Simulator Action */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Live Polling: 2.5s
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSimulated(true);
                  setStatus("approved");
                  setIsPolling(false);
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer underline underline-offset-2"
                title="Simulate receiving successful payment callback"
              >
                Simulate Payment Success →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KhqrCheckoutModal;
