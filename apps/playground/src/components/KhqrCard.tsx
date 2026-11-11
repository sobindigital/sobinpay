/**
 * @file SobinPay - Standard ABA Popup KHQR Card Component
 * @description Pixel-perfect replication of official ABA PayWay Popup KHQR specification
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

import React, { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode,
} from "lucide-react";

export interface KhqrCardProps {
  qrString: string;
  merchantName?: string;
  amount?: number | string;
  currency?: string;
  billNumber?: string;
  accountNumber?: string;
  storeLabel?: string;
  terminalLabel?: string;
  deeplink?: string;
  showActions?: boolean;
  onInspect?: () => void;
  className?: string;
}

// Official NBC KHQR vector paths (166 x 40 viewBox)
const KHQR_SVG_PATHS = [
  "M107.798 14.5844V26.9495H95.4329C94.1647 26.9495 93.2136 25.9191 93.2136 24.7301V14.5844C93.2136 13.3162 94.244 12.3651 95.4329 12.3651H105.499C106.847 12.3651 107.798 13.3162 107.798 14.5844Z",
  "M165.739 19.578H159.557C159.557 12.2065 153.533 6.18253 146.161 6.18253C140.296 6.18253 135.144 9.98717 133.4 15.5356C133.004 16.8831 132.766 18.2305 132.766 19.578V39.2353H132.607C129.278 39.2353 126.583 36.5404 126.583 33.2113V19.578H126.663C126.663 14.1881 128.882 9.03601 132.845 5.31064C136.491 1.90232 141.247 0 146.241 0C157.02 0 165.739 8.79822 165.739 19.578Z",
  "M165.819 39.2353L157.1 39.3145L154.96 37.1744L150.204 32.4186L143.625 25.8398H152.344L165.819 39.2353Z",
  "M109.859 33.132H91.232C88.9334 33.132 87.1103 31.309 87.1103 29.0103V10.3042C87.1103 8.00559 88.9334 6.18253 91.232 6.18253H109.859C112.158 6.18253 113.981 8.00559 113.981 10.3042V28.9311L120.163 35.1136V6.02401C120.163 2.69495 117.468 0 114.139 0H86.9518C83.6227 0 80.9278 2.69495 80.9278 6.02401V33.2113C80.9278 36.5404 83.6227 39.2353 86.9518 39.2353H116.041L109.859 33.132Z",
  "M34.1625 39.3146H25.4435L7.21295 21.0048V39.3146H0V0H7.21295V17.5172L24.6509 0H33.2906L14.2674 18.8647L34.1625 39.3146Z",
  "M66.7397 0H73.7941V39.3146H66.7397V22.1937H46.6068V39.2353H39.5524V0H46.6068V16.4075H66.7397V0Z",
];

/**
 * Draws the authentic vector KHQR logo onto a canvas using exact Path2D paths
 */
function drawVectorKhqrLogo(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
) {
  const origWidth = 166;
  const origHeight = 40;
  const height = (width / origWidth) * origHeight;
  const scale = width / origWidth;
  const x = centerX - width / 2;
  const y = centerY - height / 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  for (const pathStr of KHQR_SVG_PATHS) {
    if (typeof Path2D !== "undefined") {
      ctx.fill(new Path2D(pathStr));
    }
  }
  ctx.restore();
}

export function KhqrCard({
  qrString,
  merchantName = "Sobin Digital",
  amount,
  currency = "USD",
  billNumber,
  deeplink,
  showActions = true,
  onInspect,
  className = "",
}: KhqrCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Format currency amount cleanly (e.g. 25.00 or 100,000)
  const formattedAmount =
    amount !== undefined && amount !== null && amount !== ""
      ? typeof amount === "number"
        ? currency.toUpperCase() === "KHR"
          ? Math.round(amount).toLocaleString()
          : amount.toFixed(2)
        : String(amount)
      : null;

  // Render QR Code onto the Canvas with center Bakong circular emblem
  const renderQrCode = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !qrString) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 280;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    try {
      // 1. Render base QR code with High error correction level (30%)
      await QRCode.toCanvas(canvas, qrString, {
        width: size,
        margin: 0,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // 2. Load Bakong emblem logo
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/images/logo/bakong-logo.png";

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      const centerX = size / 2;
      const centerY = size / 2;

      // 3. Draw circular white disk behind logo to cleanly mask modules
      const diskRadius = Math.round(size * 0.115); // ~32px
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, diskRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#e2e8f0";
      ctx.stroke();
      ctx.restore();

      // 4. Draw Bakong circular emblem
      if (img.complete && img.naturalWidth > 0) {
        const logoSize = Math.round(size * 0.185); // ~52px
        ctx.save();
        ctx.drawImage(
          img,
          centerX - logoSize / 2,
          centerY - logoSize / 2,
          logoSize,
          logoSize,
        );
        ctx.restore();
      }

      setIsRendered(true);
    } catch (err) {
      console.error("[KhqrCard] Failed to render canvas QR:", err);
    }
  }, [qrString]);

  useEffect(() => {
    renderQrCode();
  }, [renderQrCode]);

  const handleCopy = async () => {
    if (!qrString) return;
    try {
      await navigator.clipboard.writeText(qrString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  /**
   * Downloads the complete standard ABA KHQR Card matching the official popup format:
   * - Red header banner with 45° slope and real vector KHQR logo
   * - Payee name and amount formatted in authentic ABA style
   * - Delicate dashed line
   * - Center Bakong QR code
   * - Instruction: "Scan with ABA Mobile, or other Mobile Banking App supporting KHQR"
   * - "Powered by Sobin Digital" branding
   */
  const handleDownloadCard = async () => {
    if (!canvasRef.current || downloading) return;
    setDownloading(true);

    try {
      // Dimensions matching standard ABA Popup Card (480 x 650 at 2x retina = 960 x 1300)
      const exportCanvas = document.createElement("canvas");
      const scale = 2;
      const cardW = 480;
      const cardH = 650;
      exportCanvas.width = cardW * scale;
      exportCanvas.height = cardH * scale;

      const ctx = exportCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D context");

      ctx.scale(scale, scale);

      // 1. Draw Card Background with rounded corners
      const radius = 24;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, cardW, cardH, radius);
      } else {
        ctx.moveTo(radius, 0);
        ctx.lineTo(cardW - radius, 0);
        ctx.quadraticCurveTo(cardW, 0, cardW, radius);
        ctx.lineTo(cardW, cardH - radius);
        ctx.quadraticCurveTo(cardW, cardH, cardW - radius, cardH);
        ctx.lineTo(radius, cardH);
        ctx.quadraticCurveTo(0, cardH, 0, cardH - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
      }
      ctx.fill();

      // Subtle outer border
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#e2e8f0";
      ctx.stroke();

      // Clip subsequent elements inside the rounded card
      ctx.clip();

      // 2. Red Header Banner with iconic 45-degree slope on right
      const bannerLeftH = 74;
      const bannerSlopeW = 34;
      const bannerRightH = 108;

      ctx.fillStyle = "#D81A24";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(cardW, 0);
      ctx.lineTo(cardW, bannerRightH);
      ctx.lineTo(cardW - bannerSlopeW, bannerLeftH);
      ctx.lineTo(0, bannerLeftH);
      ctx.closePath();
      ctx.fill();

      // 3. Official Vector White KHQR Logo (Real vector paths, NO text fonts)
      drawVectorKhqrLogo(
        ctx,
        cardW / 2,
        bannerLeftH / 2,
        136,
      );

      // 4. Payee / Merchant Name (Exact ABA style: medium font, clean slate)
      ctx.fillStyle = "#334155";
      ctx.font = "600 15px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(merchantName || "Sobin Digital", 36, 126);

      // 5. Amount & Currency (Exact ABA style: bold amount, currency beside it)
      if (formattedAmount) {
        ctx.fillStyle = "#0a1b39";
        ctx.font = "800 32px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(formattedAmount, 36, 172);

        const amountWidth = ctx.measureText(formattedAmount).width;
        ctx.fillStyle = "#475569";
        ctx.font = "600 14px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(currency, 36 + amountWidth + 8, 172);
      }

      // 6. Delicate dashed divider line across the card (NO black cutouts)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(36, 196);
      ctx.lineTo(cardW - 36, 196);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 7. Composite the QR Code
      const qrCanvas = canvasRef.current;
      const qrTargetSize = 320;
      const qrX = (cardW - qrTargetSize) / 2;
      const qrY = 216;
      ctx.drawImage(qrCanvas, qrX, qrY, qrTargetSize, qrTargetSize);

      // 8. ABA Official Message:
      // "Scan with ABA Mobile, or other Mobile"
      // "Banking App supporting KHQR"
      ctx.fillStyle = "#64748b";
      ctx.font = "500 13px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scan with ABA Mobile, or other Mobile", cardW / 2, 574);
      ctx.fillText("Banking App supporting KHQR", cardW / 2, 594);

      // 9. Subtle Footer Attribution: "Powered by Sobin Digital"
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Powered by Sobin Digital", cardW / 2, 626);

      ctx.restore(); // Restore clipping

      // 10. Export PNG blob and trigger download
      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `khqr-${billNumber || "payment"}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("[KhqrCard] Card download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-[390px] sm:max-w-[420px] mx-auto ${className}`}>
      {/* Official Standard ABA Popup KHQR Card */}
      <div className="relative w-full bg-white text-slate-900 rounded-[24px] shadow-lg shadow-slate-300/40 border border-slate-200/70 transition-all select-none overflow-hidden">
        
        {/* Top Red Header Banner with iconic 45-degree slope on right */}
        <div className="relative w-full bg-[#D81A24] pt-3.5 pb-3.5 px-5">
          {/* Sloped angle triangle decoration on the right edge */}
          <div
            className="absolute top-full right-0 w-0 h-0 border-solid"
            style={{
              borderTopWidth: "28px",
              borderTopColor: "#D81A24",
              borderLeftWidth: "28px",
              borderLeftColor: "transparent",
            }}
          />

          {/* Official White Vector KHQR Logo */}
          <div className="flex items-center justify-center">
            <svg
              className="h-7 w-auto text-white"
              viewBox="0 0 166 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {KHQR_SVG_PATHS.map((d, idx) => (
                <path key={idx} d={d} fill="#ffffff" />
              ))}
            </svg>
          </div>
        </div>

        {/* Payee / Merchant Info & Amount (Exact ABA Typography) */}
        <div className="px-6 pt-4 pb-1 text-left">
          <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">
            {merchantName}
          </p>

          {formattedAmount ? (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0a1b39] tracking-tight font-sans">
                {formattedAmount}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                {currency}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">Dynamic Open Amount</p>
          )}
        </div>

        {/* Clean Delicate Dashed Line (NO black cutouts) */}
        <div className="border-b border-dashed border-slate-200 mx-6 my-2" />

        {/* Centered QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-3 pt-1 pb-2">
          <div className="p-2 bg-white rounded-xl flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg transition-opacity duration-300"
              style={{ opacity: isRendered ? 1 : 0.4 }}
            />
          </div>
        </div>

        {/* Official ABA Scan Instruction Message */}
        <div className="text-center px-4 pt-1 pb-3 text-slate-500 text-xs sm:text-[13px] leading-relaxed font-medium">
          <p>Scan with ABA Mobile, or other Mobile</p>
          <p>Banking App supporting KHQR</p>
        </div>

        {/* Clean Minimalist Powered By Footer */}
        <div className="pt-2 pb-3.5 border-t border-slate-100/80 text-center text-[11px] font-medium text-slate-400">
          <span>Powered by </span>
          <span className="text-slate-600 font-semibold">Sobin Digital</span>
        </div>
      </div>

      {/* Action Controls below Card (Only rendered when showActions is true) */}
      {showActions && (
        <div className="w-full mt-4 space-y-2.5">
          {/* Mobile Banking Deeplink Button */}
          {deeplink && (
            <a
              href={deeplink}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
            >
              <span>📲 Tap to Pay in ABA Mobile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Action Button Pills */}
          <div className="grid grid-cols-3 gap-2">
            {/* Download Official KHQR Card as PNG */}
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={downloading}
              className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              title="Download official KHQR card (PNG)"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>{downloading ? "Saving..." : "Save Card"}</span>
            </button>

            {/* Copy Raw EMVCo Payload */}
            <button
              type="button"
              onClick={handleCopy}
              className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Copy raw EMVCo payload string to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span>Copy Raw</span>
                </>
              )}
            </button>

            {/* Inspect TLV Tags */}
            <button
              type="button"
              onClick={onInspect}
              className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Inspect TLV tags with interactive KHQR parser"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Parse TLV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KhqrCard;
