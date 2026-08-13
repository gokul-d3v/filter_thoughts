"use client";

import { motion } from "framer-motion";

export default function RoomsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-soft-clay/30 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-muted-sage text-3xl">domain</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-4 tracking-tight">Public Rooms</h1>
      <p className="font-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
        The complete directory of all public Verita Chat rooms is currently being indexed. Please check back later or use the Discovery Hub.
      </p>
    </motion.div>
  );
}
