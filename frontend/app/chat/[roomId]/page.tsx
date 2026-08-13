"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  room_id: string;
  content: string;
  sender_id: string;
  display_name: string;
  created_at: string;
}

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/v1/rooms/${roomId}/messages`);
        if (res.ok) {
          const data = await res.json();
          // The API returns latest first due to ORDER BY created_at DESC, so we reverse it
          setMessages(data.reverse() || []);
        }
      } catch (err) {
        console.error("Failed to fetch message history", err);
      }
    }

    let reconnectTimer: NodeJS.Timeout;
    let backoffTime = 1000;
    let isComponentMounted = true;

    async function connect() {
      if (!isComponentMounted) return;
      
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const socket = new WebSocket(`${protocol}//${window.location.host}/api/v1/ws`);
      ws.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        backoffTime = 1000; // Reset backoff on successful connect
        socket.send(JSON.stringify({
          type: "join_room",
          payload: { room_id: roomId }
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "message") {
            setMessages((prev) => [...prev, data.payload]);
          }
        } catch (err) {
          console.error("Error parsing message", err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (isComponentMounted) {
          // Reconnect with exponential backoff
          reconnectTimer = setTimeout(() => {
            backoffTime = Math.min(backoffTime * 2, 30000); // max 30s
            fetchHistory().then(connect); // Re-fetch history to get missed messages then reconnect
          }, backoffTime);
        }
      };
    }

    fetchHistory().then(connect);

    return () => {
      isComponentMounted = false;
      clearTimeout(reconnectTimer);
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: "leave_room",
          payload: { room_id: roomId }
        }));
      }
      ws.current?.close();
    };
  }, [roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    ws.current.send(JSON.stringify({
      type: "message",
      payload: { room_id: roomId, content: input }
    }));
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-ivory-bg max-w-5xl mx-auto md:py-8 md:px-6">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between border-b border-soft-clay/30 md:rounded-t-3xl shadow-sm z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center hover:bg-soft-clay transition-colors text-deep-olive">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-sm font-bold text-primary">{roomId}</h1>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-deep-olive animate-pulse' : 'bg-red-500'}`}></span>
              <span className="font-label-sm text-muted-sage">{isConnected ? 'Connected securely' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-muted-sage hover:text-deep-olive">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      {/* Messages Canvas */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/50 backdrop-blur-sm md:border-x md:border-soft-clay/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-sage/70">
            <span className="material-symbols-outlined text-4xl mb-3">lock</span>
            <p className="font-label-md">Messages are end-to-end encrypted.</p>
            <p className="font-label-sm mt-1">This is the start of your secure session.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              msg.sender_id === "system" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`msg-${idx}`} 
                  className="flex justify-center my-4"
                >
                  <span className="bg-soft-clay/30 text-muted-sage px-4 py-1.5 rounded-full font-label-sm text-[12px] shadow-sm">
                    {msg.content}
                  </span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={`msg-${idx}`} 
                  className="flex flex-col"
                >
                  <span className="font-label-sm font-bold text-muted-sage mb-1 pl-2">{msg.display_name}</span>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-soft-clay/20 self-start max-w-[85%]">
                    <p className="font-body-md text-primary">{msg.content}</p>
                    <span className="font-label-sm text-muted-sage/60 mt-2 block text-right text-[10px]">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white p-4 border-t border-soft-clay/30 md:rounded-b-3xl shadow-sm z-10 pb-safe">
        <form onSubmit={sendMessage} className="flex items-center space-x-3 bg-surface-variant/40 p-2 rounded-full border border-soft-clay/40 focus-within:border-deep-olive/50 transition-colors">
          <button type="button" className="w-10 h-10 rounded-full flex items-center justify-center text-muted-sage hover:text-deep-olive transition-colors flex-shrink-0">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isConnected}
            placeholder={isConnected ? "Type a secure message..." : "Connecting..."}
            className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-primary placeholder-muted-sage/70 outline-none"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || !isConnected}
            className="w-10 h-10 rounded-full bg-deep-olive text-white flex items-center justify-center hover:bg-muted-sage transition-all duration-300 disabled:opacity-50 disabled:hover:bg-deep-olive flex-shrink-0 shadow-soft"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </footer>
    </div>
  );
}
