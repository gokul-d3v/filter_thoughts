"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const sidebarLinks = [
  { href: "/", icon: "explore", label: "Discovery", exact: true },
  { href: "/active", icon: "chat_bubble", label: "Active Chats" },
  { href: "/archives", icon: "archive", label: "Archives" },
  { href: "/private", icon: "lock", label: "Private" },
  { href: "/rooms", icon: "domain", label: "Rooms" },
  { href: "/admin", icon: "shield", label: "Moderation" },
];

const mobileLinks = [
  { href: "/", icon: "search", label: "Discover", exact: true },
  { href: "/active", icon: "chat", label: "Chat" },
  { href: "/rooms", icon: "groups", label: "Rooms" },
  { href: "/profile", icon: "person", label: "Me" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  // Hide on chat pages — they use a different full-screen layout
  if (pathname.startsWith("/chat/")) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="h-screen w-72 fixed left-0 top-0 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-surface-container-highest/40 hidden md:flex flex-col p-8 z-40">
        {/* User Profile */}
        <div className="mb-8 mt-20 pt-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center border border-surface-container-highest/50 shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">public</span>
            </div>
            <div>
              <div className="text-[15px] font-semibold text-primary-container tracking-tight">Anonymous User</div>
              <div className="text-[12px] text-outline mt-0.5">Incognito Mode</div>
            </div>
          </div>
          <Link
            href="/?action=create"
            className="w-full bg-primary-container text-white text-[14px] font-semibold py-3.5 rounded-2xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Start New Chat
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 space-y-1">
          {sidebarLinks.map(({ href, icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 text-[14px] rounded-xl transition-all ${
                  active
                    ? "bg-primary-container/10 text-primary-container font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-highest/30 hover:text-primary-container"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${active ? "text-primary-container" : "text-outline"}`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="mt-auto space-y-1 pt-6 border-t border-surface-container-highest/40">
          <Link href="/notifications" className="flex items-center gap-4 px-4 py-3 text-[14px] text-on-surface-variant hover:bg-surface-container-highest/30 rounded-xl transition-all">
            <span className="material-symbols-outlined text-outline text-[20px]">notifications</span>
            Notifications
          </Link>
          <Link href="/settings" className="flex items-center gap-4 px-4 py-3 text-[14px] text-on-surface-variant hover:bg-surface-container-highest/30 rounded-xl transition-all">
            <span className="material-symbols-outlined text-outline text-[20px]">help</span>
            Help & Settings
          </Link>
          <button className="flex items-center gap-4 px-4 py-3 text-[14px] text-on-surface-variant hover:bg-surface-container-highest/30 rounded-xl transition-all w-full">
            <span className="material-symbols-outlined text-outline text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface-bright/90 backdrop-blur-xl border-t border-surface-container-highest/40 flex justify-around items-center px-4 py-3 md:hidden">
        {mobileLinks.map(({ href, icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-95 ${
                active ? "text-primary-container font-bold" : "text-outline hover:text-primary-container"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span className="text-[10px] mt-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
