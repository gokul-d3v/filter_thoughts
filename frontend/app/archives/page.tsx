"use client";

import Link from "next/link";

export default function Archives() {
  return (
    <div className="min-h-screen bg-ivory-bg text-on-surface font-body-md flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-soft text-center max-w-md w-full mx-4">
        <div className="w-16 h-16 rounded-full bg-soft-clay/30 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl text-muted-sage">inventory_2</span>
        </div>
        <h2 className="font-headline-sm font-bold text-primary mb-2">Archives</h2>
        <p className="text-muted-sage mb-8">Archived securely and encrypted.</p>
        <Link href="/" className="bg-surface-variant text-on-surface-variant px-6 py-3 rounded-full font-label-md hover:bg-soft-clay transition-colors inline-flex items-center space-x-2">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
