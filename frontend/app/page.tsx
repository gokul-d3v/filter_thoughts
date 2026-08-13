"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const [session, setSession] = useState<{ user_id: string; display_name: string } | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsCreatingNode(true);
      // Remove the query param so it doesn't trigger again on refresh
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function initSession() {
      try {
        // Try to fetch rooms to see if we have a valid session cookie
        const res = await fetch("/api/v1/rooms");
        if (res.status === 401) {
          // If unauthorized, create a session
          const sessionRes = await fetch("/api/v1/sessions", { method: "POST" });
          if (sessionRes.ok) {
            const data = await sessionRes.json();
            setSession(data);
            fetchRooms(); // fetch rooms after session creation
          }
        } else if (res.ok) {
          const data = await res.json();
          setRooms(data);
          setIsLoadingRooms(false);
          // Just set a mock session state for UI display since we didn't save it locally
          setSession({ user_id: "Existing", display_name: "Anonymous User" });
        }
      } catch (err) {
        console.error("Error initializing session:", err);
      }
    }

    initSession();
  }, []);

  async function fetchRooms() {
    try {
      setIsLoadingRooms(true);
      const res = await fetch("/api/v1/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRooms(false);
    }
  }

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    try {
      const res = await fetch("/api/v1/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNodeName, description: "A secure channel." }),
      });
      if (res.ok) {
        setNewNodeName("");
        setIsCreatingNode(false);
        fetchRooms();
      }
    } catch (err) {
      console.error("Failed to create room", err);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="min-h-screen bg-ivory-bg text-on-surface font-body-md"
    >
      
      {/*  Main Content Area  */}
      <main className="flex-1 p-6 md:p-12 transition-all duration-300">
        {/*  TopNavBar (Desktop)  */}
        <header className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-12 h-24 w-full sticky top-0 z-30 bg-ivory-bg/90 backdrop-blur-md">
          <div className="flex items-center space-x-8">
            <div className="w-4"></div>
          </div>
          <nav className="flex space-x-8 bg-white/50 px-8 py-3 rounded-full shadow-soft backdrop-blur-sm border border-soft-clay/20">
<Link className="font-body-md text-body-md text-primary font-medium border-b-2 border-deep-olive pb-0.5 transition-opacity" href="/">Discover</Link>
<Link className="font-body-md text-body-md text-on-surface-variant hover:text-deep-olive transition-colors duration-200" href="/rooms">Rooms</Link>
<Link className="font-body-md text-body-md text-on-surface-variant hover:text-deep-olive transition-colors duration-200" href="/private">Private</Link>
</nav>
<div className="flex items-center space-x-6 text-primary">
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-sage text-sm">search</span>
<input className="pl-11 pr-5 py-2.5 bg-white shadow-soft border-none rounded-full focus:ring-2 focus:ring-muted-sage/30 font-label-md text-label-md w-64 transition-all duration-300 focus:w-72" placeholder="Search network..." type="text"/>
</div>
<Link href="/notifications" className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:text-deep-olive transition-colors duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">notifications</span>
</Link>
<Link href="/settings" className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:text-deep-olive transition-colors duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">settings</span>
</Link>
</div>
</header>
{/*  TopAppBar (Mobile)  */}
<header className="md:hidden flex items-center justify-between px-6 h-20 sticky top-0 z-50 bg-ivory-bg/90 backdrop-blur-md">
<h1 className="font-headline-lg-mobile text-[28px] font-bold text-primary tracking-tight">Discovery Hub</h1>
<button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-deep-olive">
<span className="material-symbols-outlined">search</span>
</button>
</header>
{/*  Content Canvas  */}
<div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16">
<div className="mb-section-gap max-w-3xl">
<h1 className="hidden md:block font-headline-lg text-headline-lg text-primary mb-6 tracking-tight">Discovery Hub</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant/90 leading-relaxed">Explore active network nodes and secure communication channels. All metrics are anonymized and end-to-end encrypted.</p>
</div>
{/*  Dashboard Grid Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
{/*  Main Content Column  */}
<div className="lg:col-span-8 space-y-12">
{/*  Search/Filter Bar  */}
<div className="bg-white p-3 border-none shadow-soft rounded-2xl flex items-center space-x-4">
<div className="pl-4">
<span className="material-symbols-outlined text-muted-sage">filter_list</span>
</div>
<input className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-primary placeholder-muted-sage/70" placeholder="Filter nodes by topic, encryption level, or activity..." type="text"/>
<button className="bg-deep-olive text-ivory-bg px-6 py-3 rounded-xl font-label-md text-[15px] font-medium hover:bg-muted-sage hover:shadow-float transition-all duration-300">Search</button>
</div>
{/*  Section Header  */}
<div className="flex items-center justify-between pt-6">
<h2 className="font-headline-md text-headline-md text-primary tracking-tight">Trending Nodes</h2>
<span className="font-label-sm text-[11px] text-muted-sage font-bold uppercase tracking-widest bg-soft-clay/30 px-3 py-1 rounded-full">Live Updates</span>
</div>
{/*  Bento Grid for Nodes  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {isLoadingRooms ? (
    <div className="col-span-full py-12 text-center text-muted-sage">
      <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
      <p>Scanning network...</p>
    </div>
  ) : isCreatingNode ? (
    <div className="col-span-full bg-white border-none shadow-soft rounded-3xl p-12 text-center flex flex-col items-center justify-center">
      <h3 className="font-body-lg text-[22px] font-bold text-primary mb-4">Initialize New Node</h3>
      <form onSubmit={handleCreateRoom} className="flex flex-col w-full max-w-sm space-y-4">
        <input 
          autoFocus
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
          placeholder="Enter Node Name..." 
          className="bg-soft-clay/30 border-none rounded-xl px-4 py-3 font-body-md text-primary focus:ring-2 focus:ring-deep-olive outline-none"
        />
        <div className="flex space-x-3 w-full">
          <button type="button" onClick={() => setIsCreatingNode(false)} className="flex-1 bg-surface-variant text-on-surface-variant px-4 py-3 rounded-xl font-label-md hover:bg-soft-clay transition-all duration-300">
            Cancel
          </button>
          <button type="submit" disabled={!newNodeName.trim()} className="flex-1 bg-deep-olive text-ivory-bg px-4 py-3 rounded-xl font-label-md hover:bg-muted-sage transition-all duration-300 disabled:opacity-50">
            Create Node
          </button>
        </div>
      </form>
    </div>
  ) : rooms.length === 0 ? (
    <div className="col-span-full bg-white border-none shadow-soft rounded-3xl p-12 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-soft-clay/30 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-muted-sage text-3xl">search_off</span>
      </div>
      <h3 className="font-body-lg text-[22px] font-bold text-primary mb-2">No Active Nodes</h3>
      <p className="font-body-md text-[15px] text-on-surface-variant/80 max-w-md">There are currently no active discussion rooms matching your criteria.</p>
      <button onClick={() => setIsCreatingNode(true)} className="mt-8 bg-deep-olive text-ivory-bg px-6 py-3 rounded-xl font-label-md text-[15px] font-medium hover:bg-muted-sage transition-all duration-300">
        Create Node
      </button>
    </div>
  ) : (
    rooms.map((room, idx) => (
      <motion.div 
        variants={itemVariants}
        key={room.id} 
        className={`group bg-white rounded-3xl p-8 hover:shadow-soft transition-all duration-500 cursor-pointer border ${idx === 0 ? 'md:col-span-2 md:row-span-2 border-deep-olive/20' : 'border-soft-clay/30'} flex flex-col h-full`}
      >
        {idx === 0 ? (
          <>
            <div className="mb-6 md:mb-0 md:pr-10 md:w-2/3">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-deep-olive">
                  <span className="material-symbols-outlined text-[20px]">star</span>
                </div>
                <h3 className="font-body-lg text-[24px] font-bold text-primary group-hover:text-deep-olive transition-colors">{room.name}</h3>
              </div>
              <p className="font-body-md text-[16px] text-on-surface-variant/80 leading-relaxed">{room.description}</p>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-end space-y-0 md:space-y-6 md:w-1/3 md:border-l md:border-soft-clay/30 md:pl-8 mt-auto">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-soft-clay border-2 border-white flex items-center justify-center font-label-md font-bold text-deep-olive shadow-sm">A</div>
                <div className="w-10 h-10 rounded-full bg-surface-variant border-2 border-white flex items-center justify-center font-label-md font-bold text-deep-olive shadow-sm">B</div>
              </div>
              <Link href={`/chat/${room.id}`} className="bg-white border-2 border-deep-olive text-deep-olive px-6 py-2.5 rounded-full font-label-md text-[15px] font-medium hover:bg-deep-olive hover:text-white hover:shadow-float transition-all duration-300 w-full md:w-auto text-center block">
                Enter Node
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-soft-clay/40 px-3 py-1.5 rounded-lg font-label-sm text-[13px] font-medium text-deep-olive">Global Chat</div>
              <div className="flex items-center space-x-1.5 text-muted-sage bg-white px-2 py-1 rounded-full border border-soft-clay/30">
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span className="font-label-md text-[13px] font-medium">--</span>
              </div>
            </div>
            <h3 className="font-body-lg text-[22px] font-bold text-primary mb-3 group-hover:text-deep-olive transition-colors">{room.name}</h3>
            <p className="font-body-md text-[15px] text-on-surface-variant/80 mb-8 flex-grow leading-relaxed">{room.description || "A secure channel."}</p>
            <div className="flex items-center justify-between border-t border-soft-clay/30 pt-6 mt-auto">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deep-olive opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-deep-olive"></span>
                </span>
                <span className="font-label-sm text-[13px] font-medium text-muted-sage">Live</span>
              </div>
              <Link href={`/chat/${room.id}`} className="text-deep-olive font-label-md text-[14px] font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Join Node</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    ))
  )}
</div>
</div>
{/*  Sidebar / Network Status Column  */}
<div className="lg:col-span-4 space-y-8 pt-2">
{/*  Network Status Card  */}
<div className="bg-white border-none shadow-soft rounded-3xl p-8">
<h3 className="font-headline-sm text-[20px] font-bold text-primary mb-6">Network Status</h3>
<div className="space-y-5">
<div className="flex items-center justify-between pb-5 border-b border-soft-clay/30">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center">
<span className="material-symbols-outlined text-muted-sage text-[20px]">router</span>
</div>
<span className="font-label-md text-[15px] font-medium text-primary">Connection</span>
</div>
<span className="font-label-sm text-[12px] font-bold tracking-wider bg-secondary-fixed/50 text-deep-olive px-3 py-1.5 rounded-full">SECURE</span>
</div>
<div className="flex items-center justify-between pb-5 border-b border-soft-clay/30">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center">
<span className="material-symbols-outlined text-muted-sage text-[20px]">speed</span>
</div>
<span className="font-label-md text-[15px] font-medium text-primary">Latency</span>
</div>
<span className="font-label-md text-[15px] font-bold text-deep-olive">24ms</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center">
<span className="material-symbols-outlined text-muted-sage text-[20px]">vpn_key</span>
</div>
<span className="font-label-md text-[15px] font-medium text-primary">Protocol</span>
</div>
<span className="font-label-md text-[15px] font-bold text-deep-olive">RSA-4096</span>
</div>
</div>
</div>
{/*  Recommended Connections List  */}
<div className="bg-white border-none shadow-soft rounded-3xl p-8">
<h3 className="font-headline-sm text-[20px] font-bold text-primary mb-6">Suggested Nodes</h3>
<div className="py-6 text-center text-muted-sage/80">
  <span className="material-symbols-outlined text-3xl mb-2">blur_off</span>
  <p className="font-label-md text-[14px]">No suggestions available</p>
</div>
</div>
</div>
</div>
</div>
</main>
    </motion.div>
  );
}