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

  // Don't show on chat pages (they have their own header)
  if (pathname.startsWith("/chat/")) return null;

  return (
    <header className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-12 h-24 w-full sticky top-0 z-30 bg-ivory-bg/90 backdrop-blur-md">
      <div className="w-4" />
      <nav className="flex space-x-8 bg-white/50 px-8 py-3 rounded-full shadow-soft backdrop-blur-sm border border-soft-clay/20">
        {navLinks.map(({ href, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`font-body-md text-body-md transition-all duration-200 ${
                active
                  ? "text-primary font-semibold border-b-2 border-deep-olive pb-0.5"
                  : "text-on-surface-variant hover:text-deep-olive"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center space-x-4 text-primary">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-sage text-sm">search</span>
          <input
            className="pl-11 pr-5 py-2.5 bg-white shadow-soft border-none rounded-full focus:ring-2 focus:ring-muted-sage/30 font-label-md text-label-md w-56 transition-all duration-300 focus:w-64 outline-none"
            placeholder="Search network..."
            type="text"
          />
        </div>
        <Link
          href="/notifications"
          className={`w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:text-deep-olive transition-all hover:-translate-y-0.5 ${isActive("/notifications") ? "text-deep-olive ring-2 ring-soft-clay" : "text-muted-sage"}`}
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </Link>
        <Link
          href="/settings"
          className={`w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:text-deep-olive transition-all hover:-translate-y-0.5 ${isActive("/settings") ? "text-deep-olive ring-2 ring-soft-clay" : "text-muted-sage"}`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </Link>
      </div>
    </header>
  );
}
