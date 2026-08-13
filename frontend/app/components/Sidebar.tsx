"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const sidebarLinks = [
  { href: "/", icon: "explore", label: "Discovery Hub", exact: true },
  { href: "/active", icon: "chat", label: "Active Chats" },
  { href: "/rooms", icon: "domain", label: "Rooms" },
  { href: "/private", icon: "lock", label: "Private" },
  { href: "/archives", icon: "inventory_2", label: "Archives" },
];

const mobileLinks = [
  { href: "/", icon: "explore", label: "Discovery", exact: true },
  { href: "/active", icon: "chat", label: "Chat" },
  { href: "/private", icon: "lock", label: "Private" },
  { href: "/rooms", icon: "domain", label: "Rooms" },
  { href: "/profile", icon: "person", label: "Me" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col p-8 space-y-6 h-[calc(100vh-4rem)] w-24 xl:w-72 fixed left-6 top-8 rounded-3xl border border-soft-clay/50 bg-white/80 backdrop-blur-xl shadow-soft z-40">
        <Link href="/" className="flex items-center space-x-3 mb-4 group">
          <span className="material-symbols-outlined text-deep-olive text-3xl xl:hidden">spa</span>
          <h1 className="hidden xl:block font-headline-md text-[24px] text-primary font-bold tracking-tight group-hover:text-deep-olive transition-colors">Veritas Chat</h1>
        </Link>

        <nav className="flex-1 space-y-2 flex flex-col items-center xl:items-start xl:w-full xl:pl-4">
          {sidebarLinks.map(({ href, icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-4 p-4 rounded-2xl w-14 xl:w-full transition-all group ${
                  active
                    ? "text-primary bg-soft-clay/40 font-semibold"
                    : "text-muted-sage hover:text-deep-olive hover:bg-soft-clay/20"
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] transition-transform ${active ? "text-deep-olive" : "group-hover:scale-110"}`}>{icon}</span>
                <span className="font-label-md hidden xl:block">{label}</span>
                {active && <span className="hidden xl:block ml-auto w-1.5 h-1.5 rounded-full bg-deep-olive" />}
              </Link>
            );
          })}

          <div className="hidden xl:block pt-2 border-t border-soft-clay/30 w-full pl-4">
            <p className="font-label-sm text-[11px] text-muted-sage uppercase tracking-widest mb-2">Admin</p>
            <Link
              href="/admin"
              className={`flex items-center space-x-4 p-3 rounded-xl w-full transition-all group ${
                isActive("/admin") ? "text-primary bg-soft-clay/40" : "text-muted-sage hover:text-deep-olive hover:bg-soft-clay/20"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">gavel</span>
              <span className="font-label-md">Moderation</span>
            </Link>
          </div>
        </nav>

        <div className="mt-auto flex flex-col items-center xl:items-stretch">
          <Link
            href="/?action=create"
            className="w-12 h-12 xl:w-full bg-deep-olive text-ivory-bg xl:py-3.5 xl:px-6 rounded-full font-label-md text-label-md mb-6 hover:bg-muted-sage hover:-translate-y-0.5 hover:shadow-float transition-all duration-300 flex items-center justify-center space-x-0 xl:space-x-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden xl:block">Start New Chat</span>
          </Link>

          <div className="space-y-1 flex flex-col items-center xl:items-stretch xl:w-full xl:pl-4 mb-4 border-b border-soft-clay/30 pb-4">
            <Link
              href="/notifications"
              className={`flex items-center space-x-4 text-muted-sage hover:text-deep-olive p-2 rounded-xl transition-colors w-12 xl:w-full justify-center xl:justify-start group ${isActive("/notifications") ? "text-primary bg-soft-clay/40" : ""}`}
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">notifications</span>
              <span className="font-label-sm hidden xl:block">Notifications</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center space-x-4 text-muted-sage hover:text-deep-olive p-2 rounded-xl transition-colors w-12 xl:w-full justify-center xl:justify-start group ${isActive("/settings") ? "text-primary bg-soft-clay/40" : ""}`}
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-45 transition-transform">settings</span>
              <span className="font-label-sm hidden xl:block">Settings</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 w-full justify-center xl:justify-start xl:pl-4 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-soft-clay border-2 border-white flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:shadow-soft transition-all">
              <span className="material-symbols-outlined text-muted-sage text-[20px]">public</span>
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="font-label-sm font-bold text-primary leading-tight">Anonymous</span>
              <span className="font-label-sm text-[11px] text-muted-sage">Incognito Mode</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-soft-clay/50 p-2 z-50 flex justify-around items-center pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-around items-center w-full max-w-sm">
          {mobileLinks.map(({ href, icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 active:scale-95 ${active ? "text-deep-olive" : "text-muted-sage hover:text-deep-olive"}`}
              >
                <div className={`px-4 py-1 rounded-xl mb-1 ${active ? "bg-soft-clay/40 shadow-sm" : ""}`}>
                  <span className={`material-symbols-outlined text-[22px] ${active ? "text-deep-olive" : ""}`}>{icon}</span>
                </div>
                <span className={`font-label-sm text-[11px] ${active ? "font-bold" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
