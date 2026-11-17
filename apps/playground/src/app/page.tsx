/**
 * @file SobinPay Documentation & Developer Portal - Main Page
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
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SearchModal } from "../components/SearchModal";
import { OverviewDocs } from "../components/docs/OverviewDocs";
import { PayWayDocs } from "../components/docs/PayWayDocs";
import { KhqrDocs } from "../components/docs/KhqrDocs";
import { ReferenceDocs } from "../components/docs/ReferenceDocs";
import { FrameworkRecipes } from "../components/docs/FrameworkRecipes";
import { FaqSection } from "../components/docs/FaqSection";
import { PlaygroundTester } from "../components/PlaygroundTester";
import { WebhookDebugger } from "../components/WebhookDebugger";
import { KhqrInspector } from "../components/KhqrInspector";
import {
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  Copy,
  Search,
} from "lucide-react";
import {
  TikTokIcon,
  TelegramIcon,
  GithubIcon,
  NpmIcon,
  SobinPayLogo,
  VerifiedBadgeIcon,
} from "../components/Icons";
import { DOCS_NAV_SECTIONS } from "../lib/docs-data";

export default function DocsPortalPage() {
  const [activeSection, setActiveSection] = useState("overview-intro");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedQuickInstall, setCopiedQuickInstall] = useState(false);
  const isProgrammaticScrollRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Global keydown for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // IntersectionObserver to sync active sidebar section as user scrolls
  useEffect(() => {
    const sectionIds: string[] = [];
    for (const group of DOCS_NAV_SECTIONS) {
      for (const item of group.items) {
        sectionIds.push(item.id);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Suppress intermediate observer triggers while smooth scrolling
        if (isProgrammaticScrollRef.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0,
      },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);

    const element = document.getElementById(sectionId);
    if (!element) return;

    // Suppress observer so menu doesn't flicker when jumping across sections (e.g. 1 to 5)
    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const headerHeight = 84;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 850);
  };

  const copyQuickInstall = () => {
    navigator.clipboard.writeText("npm i @sobindigital/pay");
    setCopiedQuickInstall(true);
    setTimeout(() => setCopiedQuickInstall(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigateSection={handleNavigateSection}
      />

      {/* Command Palette Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleNavigateSection}
      />

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-[#07090e]/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto lg:hidden flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-5">
            {/* Quick Search Trigger in Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-xl active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">Search documentation...</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                ⌘K
              </span>
            </button>

            {/* Sidebar Sections */}
            <Sidebar
              activeSection={activeSection}
              onSelectSection={handleNavigateSection}
              isMobile
            />
          </div>

          {/* Social Links & Info at Drawer Bottom */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <a
                href="https://t.me/sobindigital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 active:text-sky-400"
              >
                <TelegramIcon className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Telegram</span>
              </a>
              <a
                href="https://www.tiktok.com/@sobindigital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 active:text-pink-400"
              >
                <TikTokIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <span>TikTok</span>
              </a>
              <a
                href="https://github.com/sobindigital/sobinpay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 active:text-white"
              >
                <GithubIcon className="w-4 h-4 text-slate-200 shrink-0" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.npmjs.com/package/@sobindigital/pay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 active:text-red-400"
              >
                <NpmIcon className="w-4 h-4 text-red-400 shrink-0" />
                <span>NPM v0.1.1</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              SobinPay by Sobin Digital • MIT License
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-w-0">
          {/* Left Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3 border-r border-slate-800/80">
            <Sidebar
              activeSection={activeSection}
              onSelectSection={handleNavigateSection}
            />
          </div>

          {/* Right Main Content */}
          <main className="col-span-1 lg:col-span-9 min-w-0 w-full py-6 sm:py-8 lg:py-10 space-y-12 sm:space-y-16">
            {/* Hero Quick Banner */}
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-blue-950/20 via-slate-900/40 to-slate-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-wider">
                  <VerifiedBadgeIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Engineering Standard 10/10 • Sobin Digital</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Cambodia&apos;s Modern{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                    Payment Gateway Engine
                  </span>
                </h1>

                <p className="text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
                  Type-safe, timing-safe TypeScript monorepo combining ABA PayWay popup/direct checkout and National Bank of Cambodia’s Bakong KHQR EMVCo generator.
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">npm i @sobindigital/pay</span>
                    </div>
                    <button
                      onClick={copyQuickInstall}
                      className="ml-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy install command"
                    >
                      {copiedQuickInstall ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleNavigateSection("interactive-tester")}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>Launch Live Sandbox</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleNavigateSection("interactive-webhook-debugger")}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold active:scale-98 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Webhook Debugger</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <OverviewDocs />

            {/* Interactive Tools Section 1: Live Sandbox */}
            <PlaygroundTester />

            {/* ABA PayWay Section */}
            <PayWayDocs />

            {/* Interactive Tools Section 2: Webhook Debugger */}
            <WebhookDebugger />

            {/* Bakong KHQR Section */}
            <KhqrDocs />

            {/* Interactive Tools Section 3: KHQR Tag Inspector */}
            <KhqrInspector />

            {/* Reference Section */}
            <ReferenceDocs />

            {/* Framework Recipes Section */}
            <FrameworkRecipes />

            {/* AEO Frequently Asked Questions */}
            <FaqSection />
          </main>
        </div>
      </div>

      {/* Enterprise Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0A0E1A] border border-white/10 flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10">
                <SobinPayLogo className="w-full h-full" />
              </div>
              <div className="text-left">
                <span className="font-bold text-sm text-white">SobinPay</span>
                <span className="text-xs text-slate-400 ml-2">by Sobin Digital</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <span>llms.txt (AI Spec)</span>
              </a>
              <a
                href="https://t.me/sobindigital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-sky-400 transition-colors"
              >
                <TelegramIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram: @sobindigital</span>
              </a>
              <a
                href="https://www.tiktok.com/@sobindigital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
              >
                <TikTokIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>TikTok: @sobindigital</span>
              </a>
              <a
                href="https://github.com/sobindigital/sobinpay"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500 font-mono">MIT License</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-600" suppressHydrationWarning>
            &copy; 2026 Sobin Digital. All rights reserved. SobinPay is not officially affiliated with Advanced Bank of Asia Ltd (ABA) or the National Bank of Cambodia (NBC).
          </div>
        </div>
      </footer>
    </div>
  );
}
