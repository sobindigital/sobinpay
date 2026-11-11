/**
 * @file SobinPay Playground - Clean Enterprise Header Navigation
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
import {
  Search,
  ExternalLink,
  Menu,
  X,
  Terminal,
} from "lucide-react";
import {
  TelegramIcon,
  TikTokIcon,
  NpmIcon,
  GithubIcon,
  SobinPayLogo,
} from "./Icons";

interface HeaderProps {
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function Header({
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigateSection,
}: HeaderProps) {
  const handleNavClick = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Company Info */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick("overview-intro")}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 p-[1px] shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
              <div className="w-full h-full bg-[#07090e] rounded-[7px] flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <SobinPayLogo className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-300 transition-colors">
                SobinPay
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                v0.1.0
              </span>
            </div>
          </button>

          <div className="hidden sm:block h-3.5 w-px bg-slate-800" />
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
            Sobin Digital
          </span>
        </div>

        {/* Center Navigation Links (Clean & Spacious) */}
        <nav className="hidden lg:flex items-center gap-1 text-[13px] text-slate-300 font-medium">
          <button
            onClick={() => handleNavClick("overview-intro")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick("payway-quickstart")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            ABA PayWay
          </button>
          <button
            onClick={() => handleNavClick("khqr-individual")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Bakong KHQR
          </button>
          <button
            onClick={() => handleNavClick("reference-enums")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Reference
          </button>
          <button
            onClick={() => handleNavClick("interactive-tester")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>
        </nav>

        {/* Right Action Bar (Search + Unified Social Group) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Bar */}
          <button
            onClick={onOpenSearch}
            className="flex items-center justify-between gap-3 px-3 py-1.5 w-36 sm:w-44 text-xs text-slate-400 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer shadow-sm"
            title="Search documentation (⌘K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded">
              ⌘K
            </kbd>
          </button>

          <div className="hidden sm:block h-4 w-px bg-slate-800/80 mx-0.5" />

          {/* Socials & Community Icons (Clean unified monochrome buttons) */}
          <div className="flex items-center gap-1">
            {/* Telegram */}
            <a
              href="https://t.me/sobindigital"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
              title="Join Sobin Digital on Telegram (@sobindigital)"
              aria-label="Telegram"
            >
              <TelegramIcon className="w-4 h-4" />
            </a>

            {/* TikTok (Authentic TikTok Note Logo) */}
            <a
              href="https://www.tiktok.com/@sobindigital"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
              title="Follow Sobin Digital on TikTok (@sobindigital)"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>

            {/* NPM Link */}
            <a
              href="https://www.npmjs.com/package/@sobindigital/pay"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
              title="View on NPM Registry"
            >
              <NpmIcon className="w-3.5 h-3.5" />
              <span>npm</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            {/* GitHub Star */}
            <a
              href="https://github.com/sobindigital/sobinpay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              title="Star SobinPay on GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Star</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
