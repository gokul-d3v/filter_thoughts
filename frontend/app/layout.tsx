import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discovery Hub - Veritas Chat",
  description: "Anonymous Real-Time Chat Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory-bg text-on-surface min-h-screen flex font-body-md antialiased">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col p-8 space-y-6 h-[calc(100vh-4rem)] w-24 xl:w-72 fixed left-6 top-8 rounded-3xl border border-soft-clay/50 bg-white/80 backdrop-blur-xl shadow-soft z-40">
          <div className="flex items-center space-x-3 mb-8">
            <span className="material-symbols-outlined text-deep-olive text-3xl xl:hidden">spa</span>
            <h1 className="hidden xl:block font-headline-md text-[24px] text-primary font-bold tracking-tight">Veritas Chat</h1>
          </div>
          <nav className="flex-1 space-y-4 flex flex-col items-center xl:items-start xl:w-full xl:pl-4">
            <Link className="flex items-center space-x-4 text-primary bg-soft-clay/40 p-4 rounded-2xl w-14 xl:w-full transition-all" href="/">
              <span className="material-symbols-outlined text-[22px]">explore</span>
              <span className="font-label-md hidden xl:block">Discovery Hub</span>
            </Link>
            <Link className="flex items-center space-x-4 text-muted-sage hover:text-deep-olive hover:bg-soft-clay/20 p-4 rounded-2xl w-14 xl:w-full transition-all group" href="/active">
              <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">chat</span>
              <span className="font-label-md hidden xl:block">Active Chats</span>
            </Link>
            <Link className="flex items-center space-x-4 text-muted-sage hover:text-deep-olive hover:bg-soft-clay/20 p-4 rounded-2xl w-14 xl:w-full transition-all group" href="/archives">
              <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">inventory_2</span>
              <span className="font-label-md hidden xl:block">Archives</span>
            </Link>
          </nav>
          <div className="mt-auto flex flex-col items-center xl:items-stretch">
            <Link href="/?action=create" className="w-12 h-12 xl:w-full bg-deep-olive text-ivory-bg xl:py-3.5 xl:px-6 rounded-full font-label-md text-label-md mb-6 hover:bg-muted-sage hover:-translate-y-0.5 hover:shadow-float transition-all duration-300 flex items-center justify-center space-x-0 xl:space-x-2">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden xl:block">Start New Chat</span>
            </Link>
            <div className="space-y-2 flex flex-col items-center xl:items-stretch xl:w-full xl:pl-4 mb-6 border-b border-soft-clay/30 pb-6">
              <a className="flex items-center space-x-4 text-muted-sage hover:text-deep-olive p-2 rounded-xl transition-colors w-12 xl:w-full justify-center xl:justify-start group" href="#">
                <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">help</span>
                <span className="font-label-sm hidden xl:block">Help</span>
              </a>
              <a className="flex items-center space-x-4 text-muted-sage hover:text-deep-olive p-2 rounded-xl transition-colors w-12 xl:w-full justify-center xl:justify-start group" href="#">
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">logout</span>
                <span className="font-label-sm hidden xl:block">Sign Out</span>
              </a>
            </div>
            <div className="flex items-center space-x-3 w-full justify-center xl:justify-start xl:pl-4 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-soft-clay border-2 border-white flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:shadow-soft transition-all">
                <span className="material-symbols-outlined text-muted-sage text-[20px]">public</span>
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="font-label-sm font-bold text-primary leading-tight">Connecting...</span>
                <span className="font-label-sm text-[11px] text-muted-sage">Incognito Mode</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-soft-clay/50 p-2 z-50 flex justify-around items-center pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-around items-center w-full max-w-sm">
            <Link className="flex flex-col items-center justify-center text-primary p-2 rounded-2xl bg-soft-clay/20 transition-all duration-200 active:scale-95" href="/">
              <div className="px-4 py-1 bg-white rounded-xl shadow-sm mb-1">
                <span className="material-symbols-outlined text-[22px] text-deep-olive">explore</span>
              </div>
              <span className="font-label-sm text-[11px] font-bold">Discovery</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-muted-sage hover:text-deep-olive p-2 rounded-2xl transition-all duration-200 active:scale-95" href="/active">
              <div className="px-4 py-1 mb-1">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <span className="font-label-sm text-[11px]">Chat</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-muted-sage hover:text-deep-olive p-2 rounded-2xl transition-all duration-200 active:scale-95" href="/archives">
              <div className="px-4 py-1 mb-1">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <span className="font-label-sm text-[11px]">Archives</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-muted-sage hover:text-deep-olive p-2 rounded-2xl transition-all duration-200 active:scale-95" href="/profile">
              <div className="px-4 py-1 mb-1">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </div>
              <span className="font-label-sm text-[11px]">Me</span>
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-36 xl:ml-80 pb-20 md:pb-0 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
