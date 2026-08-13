import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

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
        {/* Sidebar + Mobile Nav */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 md:ml-36 xl:ml-80 pb-20 md:pb-0 w-full flex flex-col">
          {/* Shared Top Navigation */}
          <TopNav />
          {children}
        </div>
      </body>
    </html>
  );
}
