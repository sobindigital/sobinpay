/**
 * @file SobinPay Playground - Smooth Animated Sidebar Navigation
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

import React, { useRef, useEffect } from "react";
import { DOCS_NAV_SECTIONS } from "../lib/docs-data";
import { Badge } from "./Badge";

interface SidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  isMobile?: boolean;
}

export function Sidebar({
  activeSection,
  onSelectSection,
  isMobile = false,
}: SidebarProps) {
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll sidebar if active item is out of view
  useEffect(() => {
    if (!isMobile && activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeSection, isMobile]);

  return (
    <aside
      className={`w-full ${
        isMobile
          ? ""
          : "h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-4 sticky top-16 scrollbar-thin"
      }`}
    >
      <div className="space-y-7">
        {DOCS_NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 select-none">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      ref={isActive ? activeBtnRef : null}
                      onClick={() => onSelectSection(item.id)}
                      className={`relative w-full flex items-center justify-between pl-3.5 pr-2.5 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ease-out text-left group cursor-pointer ${
                        isActive
                          ? "bg-blue-500/10 text-blue-400 font-semibold shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      {/* Smooth vertical active bar */}
                      <span
                        className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-blue-500 transition-all duration-300 ease-out ${
                          isActive
                            ? "opacity-100 scale-y-100"
                            : "opacity-0 scale-y-50 group-hover:opacity-40 group-hover:scale-y-75"
                        }`}
                      />

                      <span className="truncate">{item.title}</span>

                      {item.badge && (
                        <Badge
                          variant={
                            item.badge === "Live"
                              ? "emerald"
                              : item.badge === "Security"
                                ? "rose"
                                : item.badge === "Recipe"
                                  ? "purple"
                                  : "blue"
                          }
                          size="sm"
                          className="ml-2 shrink-0 text-[10px] py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
