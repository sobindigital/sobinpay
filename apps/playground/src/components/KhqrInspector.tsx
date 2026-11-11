/**
 * @file SobinPay Playground - EMVCo KHQR Tag Inspector & CRC16 Validator
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
  QrCode,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Search,
} from "lucide-react";
import { Badge } from "./Badge";

const SAMPLE_INDIVIDUAL =
  "00020101021229300018sobin_digital@aclb520459995303840540510.505802KH5913Sobin Digital6010Phnom Penh62120108INV-20416304E5F2";

const SAMPLE_MERCHANT =
  "00020101021230490018sobin_digital@aclb01090000000010211Bakong Bank5204599953031165405500005802KH5913Sobin Digital6010Phnom Penh62120108INV-990163047D3B";

const EMVCO_TAG_DESCRIPTIONS: Record<
  string,
  { name: string; description: string }
> = {
  "00": {
    name: "Payload Format Indicator",
    description: "EMVCo format version (always '01')",
  },
  "01": {
    name: "Point of Initiation Method",
    description: "11 = Static QR (Reusable), 12 = Dynamic QR (Transaction-specific)",
  },
  "29": {
    name: "Merchant Account Info (Individual)",
    description: "Contains subtag 00 with the payee Bakong Account ID",
  },
  "30": {
    name: "Merchant Account Info (Merchant)",
    description: "Contains subtag 00 (Bakong ID), 01 (Merchant ID), 02 (Acquiring Bank)",
  },
  "52": {
    name: "Merchant Category Code (MCC)",
    description: "ISO 18245 code classifying merchant business (default: 5999)",
  },
  "53": {
    name: "Transaction Currency",
    description: "ISO 4217 numeric currency code (840 = USD, 116 = KHR)",
  },
  "54": {
    name: "Transaction Amount",
    description: "Transaction amount formatted to currency standard decimals",
  },
  "58": {
    name: "Country Code",
    description: "ISO 3166-1 alpha-2 country code (always 'KH' for Cambodia)",
  },
  "59": {
    name: "Merchant Name",
    description: "Business or account holder name (max 25 characters)",
  },
  "60": {
    name: "Merchant City",
    description: "City or operational municipality (e.g. 'Phnom Penh')",
  },
  "62": {
    name: "Additional Data Template",
    description: "Contains subtag 01 (Bill Number), 03 (Store Label), 07 (Terminal Label)",
  },
  "63": {
    name: "CRC-16 Checksum",
    description: "16-bit CRC-CCITT (poly 0x1021, init 0xFFFF) across all prior bytes",
  },
};

export function KhqrInspector() {
  const [qrString, setQrString] = useState(SAMPLE_INDIVIDUAL);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Cross-tool listener: automatically load QR string from other playground tools
  React.useEffect(() => {
    const handleCustomInspect = (e: Event) => {
      const customEvent = e as CustomEvent<{ qrString?: string }>;
      if (customEvent.detail?.qrString) {
        const newStr = customEvent.detail.qrString;
        setQrString(newStr);
        handleInspect(newStr);
      }
    };

    window.addEventListener("inspect-khqr", handleCustomInspect);
    return () => window.removeEventListener("inspect-khqr", handleCustomInspect);
  }, []);

  const [parseResult, setParseResult] = useState<{
    isValid: boolean;
    bakongAccountId?: string;
    merchantName?: string;
    merchantCity?: string;
    amount?: number;
    currency?: string;
    crc: string;
    computedCrc: string;
    crcMatches: boolean;
    tags: Record<string, string>;
  } | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspect = async (strToParse = qrString) => {
    setLoading(true);
    try {
      const res = await fetch("/api/khqr/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrString: strToParse.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setParseResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: string) => {
    setQrString(sample);
    handleInspect(sample);
  };

  return (
    <div id="interactive-khqr-inspector" className="scroll-mt-24 space-y-8 my-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <QrCode className="w-4 h-4" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              EMVCo KHQR Tag Inspector & CRC16 Validator
            </h2>
            <Badge variant="blue">Tag-Length-Value</Badge>
            <Badge variant="emerald">CRC-16/CCITT</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Deconstruct any raw Bakong KHQR EMVCo string down to individual TLV tags and verify the 16-bit CRC checksum.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2 uppercase">
          Sample Codes:
        </span>
        <button
          onClick={() => loadSample(SAMPLE_INDIVIDUAL)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
        >
          Individual KHQR (USD $10.50)
        </button>
        <button
          onClick={() => loadSample(SAMPLE_MERCHANT)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
        >
          Merchant KHQR (KHR 50,000)
        </button>
      </div>

      {/* Input */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Raw Bakong EMVCo String
          </label>
          <button
            onClick={() => handleCopy(qrString)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy String"}
          </button>
        </div>

        <textarea
          rows={3}
          value={qrString}
          onChange={(e) => setQrString(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 resize-none break-all"
          placeholder="000201010212..."
        />

        <div className="flex justify-end">
          <button
            onClick={() => handleInspect()}
            disabled={loading || !qrString.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-mono"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Parsing TLV Tags...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Inspect EMVCo Tags</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {parseResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                CRC-16 Checksum
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-semibold">
                {parseResult.crcMatches ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">
                      0x{parseResult.crc} (MATCH)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-rose-400">
                      0x{parseResult.crc} ≠ 0x{parseResult.computedCrc}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Bakong Account
              </span>
              <div className="font-mono text-sm font-semibold text-slate-200 truncate">
                {parseResult.bakongAccountId || "N/A"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Merchant Name
              </span>
              <div className="text-sm font-semibold text-slate-200 truncate">
                {parseResult.merchantName || "N/A"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Amount & Currency
              </span>
              <div className="font-mono text-sm font-semibold text-blue-400">
                {parseResult.amount !== undefined
                  ? `${parseResult.amount} ${parseResult.currency || ""}`
                  : "Static QR (Any Amount)"}
              </div>
            </div>
          </div>

          {/* TLV Breakdown Table */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Parsed Tag-Length-Value (TLV) Data Elements
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {Object.keys(parseResult.tags).length} tags parsed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3">Tag</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Len</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Specification Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-slate-300">
                  {Object.entries(parseResult.tags).map(([tag, val]) => {
                    const info = EMVCO_TAG_DESCRIPTIONS[tag] || {
                      name: `Tag ${tag}`,
                      description: "Custom / Proprietary data element",
                    };
                    return (
                      <tr
                        key={tag}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-3.5 text-blue-400 font-bold">
                          {tag}
                        </td>
                        <td className="px-6 py-3.5 text-slate-200 font-sans font-medium">
                          {info.name}
                        </td>
                        <td className="px-6 py-3.5 text-slate-400">{val.length}</td>
                        <td className="px-6 py-3.5 text-amber-300 font-mono break-all max-w-xs">
                          {val}
                        </td>
                        <td className="px-6 py-3.5 text-slate-400 font-sans">
                          {info.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

