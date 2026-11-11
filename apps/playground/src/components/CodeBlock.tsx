/**
 * @file SobinPay Playground - CodeBlock Component with Package Tabs & Copy
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
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  packageTabs?: boolean;
  packageCommand?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  title,
  showLineNumbers = false,
  packageTabs = false,
  packageCommand = "@sobin/pay",
}: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState<"npm" | "pnpm" | "yarn" | "bun">("npm");
  const [copied, setCopied] = useState(false);

  const getPackageCode = (pm: "npm" | "pnpm" | "yarn" | "bun") => {
    switch (pm) {
      case "npm":
        return `npm install ${packageCommand}`;
      case "pnpm":
        return `pnpm add ${packageCommand}`;
      case "yarn":
        return `yarn add ${packageCommand}`;
      case "bun":
        return `bun add ${packageCommand}`;
    }
  };

  const currentCode = packageTabs ? getPackageCode(activeTab) : code;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/70 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {packageTabs ? (
            <div className="flex items-center gap-1">
              {(["npm", "pnpm", "yarn", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setActiveTab(pm)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                    activeTab === pm
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-slate-300">{title || language}</span>
            </>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 hover:text-white transition-all text-xs font-mono"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed text-slate-200 selection:bg-blue-600/40">
        <pre className="flex">
          {showLineNumbers && (
            <span className="select-none pr-4 text-slate-600 text-right font-mono border-r border-slate-800/80 mr-4">
              {currentCode
                .split("\n")
                .map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
            </span>
          )}
          <code className="flex-1 whitespace-pre">{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}

