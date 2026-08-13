import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

export const metadata: Metadata = {
  title: "Veritas Chat",
  description: "Anonymous Secure Real-Time Chat Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface h-full flex flex-col antialiased">
        <TopNav />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 md:ml-72 pb-16 md:pb-0 w-full flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
