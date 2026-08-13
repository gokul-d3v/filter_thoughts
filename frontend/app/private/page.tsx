"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PrivatePage() {
  const [mode, setMode] = useState<"join" | "create">("join");
  const [joinCode, setJoinCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/v1/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join_code: joinCode.trim() })
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Invalid join code. Room not found.");
        } else {
          setError("An error occurred while joining the room.");
        }
        return;
      }
      
      const data = await res.json();
      router.push(`/chat/${data.room_id}`);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!roomName.trim() || !joinCode.trim()) {
      setError("Room name and join code are required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: roomName.trim(), 
          description: "",
          is_private: true,
          join_code: joinCode.trim() 
        })
      });
      
      if (!res.ok) {
        setError("Failed to create room. The join code might already be in use.");
        return;
      }
      
      const data = await res.json();
      router.push(`/chat/${data.id}`);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-8 md:p-12 flex flex-col items-center justify-center bg-ivory-bg"
    >
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-soft p-10 border border-soft-clay/50 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-soft-clay/30 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-muted-sage text-3xl">lock</span>
          </div>
          <h1 className="font-headline-md text-[24px] text-primary font-bold tracking-tight">Private Network</h1>
          <p className="font-body-sm text-on-surface-variant text-center mt-2">
            Access hidden nodes using cryptographic join codes.
          </p>
        </div>

        <div className="flex bg-ivory-bg rounded-full p-1 mb-8 shadow-inner">
          <button 
            onClick={() => setMode("join")}
            className={`flex-1 py-2.5 rounded-full font-label-md text-sm transition-all duration-300 ${mode === "join" ? "bg-white text-primary shadow-soft" : "text-muted-sage hover:text-primary"}`}
          >
            Join Room
          </button>
          <button 
            onClick={() => setMode("create")}
            className={`flex-1 py-2.5 rounded-full font-label-md text-sm transition-all duration-300 ${mode === "create" ? "bg-white text-primary shadow-soft" : "text-muted-sage hover:text-primary"}`}
          >
            Create Room
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-label-md flex items-center space-x-2 border border-red-100">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {mode === "join" ? (
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block font-label-sm text-muted-sage mb-2 ml-2">Join Code</label>
              <input 
                type="text" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter secret code..."
                className="w-full px-5 py-3.5 bg-ivory-bg border-none rounded-2xl focus:ring-2 focus:ring-muted-sage/30 font-body-md text-primary transition-all shadow-inner"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !joinCode.trim()}
              className="w-full py-3.5 bg-deep-olive hover:bg-muted-sage text-white rounded-2xl font-label-md shadow-soft hover:shadow-float transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span>Access Node</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block font-label-sm text-muted-sage mb-2 ml-2">Room Name</label>
              <input 
                type="text" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Project Apollo"
                className="w-full px-5 py-3.5 bg-ivory-bg border-none rounded-2xl focus:ring-2 focus:ring-muted-sage/30 font-body-md text-primary transition-all shadow-inner"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block font-label-sm text-muted-sage mb-2 ml-2">Custom Join Code</label>
              <input 
                type="text" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. apollo-secret-123"
                className="w-full px-5 py-3.5 bg-ivory-bg border-none rounded-2xl focus:ring-2 focus:ring-muted-sage/30 font-body-md text-primary transition-all shadow-inner"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !roomName.trim() || !joinCode.trim()}
              className="w-full py-3.5 bg-deep-olive hover:bg-muted-sage text-white rounded-2xl font-label-md shadow-soft hover:shadow-float transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Deploy Private Node</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
