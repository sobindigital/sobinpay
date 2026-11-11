/**
 * @file SobinPay Playground - Authentic Pixel-Perfect SVG Icons
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

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Official TikTok Note Icon
 */
export function TikTokIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74l-.07-.1a2.89 2.89 0 0 1 2.37-4.51c.29 0 .56.04.83.12V9.43a6.34 6.34 0 0 0-.83-.05A6.34 6.34 0 0 0 3.14 15.7a6.34 6.34 0 0 0 10.74 4.54l.09-.09a6.3 6.3 0 0 0 1.84-4.5V8.51a8.17 8.17 0 0 0 4.78 1.53V6.69a4.83 4.83 0 0 1-1-.01z" />
    </svg>
  );
}

/**
 * Official Telegram Paper-Plane in Circle
 */
export function TelegramIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.6 7.53c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.18-2.51 4.57-4.13c.2-.18-.04-.27-.31-.1l-5.65 3.56-2.43-.76c-.53-.17-.54-.53.11-.78l9.5-3.66c.44-.16.82.1.68.86z" />
    </svg>
  );
}

/**
 * Official NPM Registry Logo
 */
export function NpmIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M0 0v256h256V0H0zm55.6 55.6h144.8v144.8h-36.2V91.8h-36.2v108.6H55.6V55.6z" />
    </svg>
  );
}

/**
 * Official GitHub Octocat
 */
export function GithubIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

/**
 * Authentic Bakong KHQR Emblem
 */
export function BakongKhqrIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" className="text-red-600 fill-current opacity-20" />
      <path
        d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 4.5h2v3h3v2h-3v3h-2v-3H8v-2h3v-3z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * SobinPay Brand Emblem - Fintech Digital Node Shield
 */
export function SobinPayLogo({ className = "w-5 h-5", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2L4 6v6c0 5.25 3.4 10.15 8 11.35 4.6-1.2 8-6.1 8-11.35V6l-8-4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.5l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Verified Engineering Badge (Replacement for generic sparkles)
 */
export function VerifiedBadgeIcon({ className = "w-3.5 h-3.5", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

