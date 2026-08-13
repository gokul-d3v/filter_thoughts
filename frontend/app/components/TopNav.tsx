"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Discover", exact: true },
  { href: "/rooms", label: "Rooms" },
  { href: "/private", label: "Private" },
];

export default function TopNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  // Hide on chat pages — they have their own full-screen layout
  if (pathname.startsWith("/chat/")) return null;

  return (
    <header className="w-full sticky top-0 z-50 bg-surface-bright/80 backdrop-blur-xl border-b border-surface-container-highest/40 hidden md:flex justify-between items-center px-8 h-20">
      <div className="flex items-center gap-10">
        <Link href="/" className="font-bold text-[20px] text-primary-container tracking-tight hover:opacity-80 transition-opacity">
          Veritas Chat
        </Link>
        <nav className="flex gap-2">
          {navLinks.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`text-[15px] px-4 py-2 rounded-full transition-all duration-200 ${
                  active
                    ? "bg-primary-container text-white font-semibold"
                    : "text-on-surface-variant hover:text-primary-container hover:bg-surface-container-highest/20"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className={`p-2 rounded-full transition-colors ${isActive("/notifications") ? "text-primary-container bg-surface-container" : "text-outline hover:text-primary-container hover:bg-surface-container-highest/20"}`}
        >
          <span className="material-symbols-outlined">notifications</span>
        </Link>
        <Link
          href="/settings"
          className={`p-2 rounded-full transition-colors ${isActive("/settings") ? "text-primary-container bg-surface-container" : "text-outline hover:text-primary-container hover:bg-surface-container-highest/20"}`}
        >
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-surface-container-highest/50 overflow-hidden flex items-center justify-center shadow-sm ml-1">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
        </div>
      </div>
    </header>
  );
}
