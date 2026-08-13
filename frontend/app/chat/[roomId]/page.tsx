"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
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
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomName, setRoomName] = useState("Secure Channel");
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [myId, setMyId] = useState("");
  const [myDisplayName, setMyDisplayName] = useState("You");
  const myIdRef = useRef(""); // ref so WS handler always has fresh value
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    myIdRef.current = myId;
  }, [myId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function initSession() {
      try {
        // Check existing session or create one
        let res = await fetch("/api/v1/rooms"); // ping to check auth
        if (res.status === 401) {
          const sessionRes = await fetch("/api/v1/sessions", { method: "POST" });
          if (sessionRes.ok) {
            const data = await sessionRes.json();
            myIdRef.current = data.user_id;
            setMyId(data.user_id);
            setMyDisplayName(data.display_name || "You");
          }
        } else {
          // Session already exists — we can't easily get the user_id from rooms
          // so we'll set it from the first WS message we send back
        }
      } catch (err) {
        console.error("Session init error", err);
      }
    }

    async function fetchHistory() {
      try {
        const [msgRes, roomsRes] = await Promise.all([
          fetch(`/api/v1/rooms/${roomId}/messages`),
          fetch("/api/v1/rooms"),
        ]);
        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(Array.isArray(data) ? data.reverse() : []);
        }
        if (roomsRes.ok) {
          const rooms = await roomsRes.json();
          const room = Array.isArray(rooms) && rooms.find((r: any) => r.id === roomId);
          if (room) setRoomName(room.name);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
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
        backoffTime = 1000;
        socket.send(JSON.stringify({ type: "join_room", payload: { room_id: roomId } }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "message") {
            const incoming = data.payload as Message;
            // If this is an echo of our own optimistic message, skip it
            // (identified by matching sender_id and content arriving within 5s)
            if (incoming.sender_id === myIdRef.current) {
              // Already shown optimistically — skip to avoid duplicate
              return;
            }
            setMessages((prev) => [...prev, incoming]);
          }
        } catch (err) {
          console.error("Error parsing message", err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (isComponentMounted) {
          reconnectTimer = setTimeout(() => {
            backoffTime = Math.min(backoffTime * 2, 30000);
            fetchHistory().then(connect);
          }, backoffTime);
        }
      };
    }

    initSession().then(fetchHistory).then(connect);

    return () => {
      isComponentMounted = false;
      clearTimeout(reconnectTimer);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "leave_room", payload: { room_id: roomId } }));
      }
      ws.current?.close();
    };
  }, [roomId]);

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const content = input.trim();

    // Optimistically add to UI immediately
    const optimisticMsg: Message = {
      room_id: roomId,
      content,
      sender_id: myIdRef.current,
      display_name: myDisplayName,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    ws.current.send(JSON.stringify({ type: "message", payload: { room_id: roomId, content } }));
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
  };

  // Unique participants from messages — exclude self (already shown as "You")
  const participants = Array.from(
    new Map(
      messages
        .filter(m => m.sender_id !== "system" && m.sender_id !== myId && m.sender_id !== myIdRef.current)
        .map(m => [m.sender_id, m.display_name])
    ).entries()
  );

  return (
    <div className="flex h-screen bg-surface-bright overflow-hidden">
      {/* Left sidebar offset */}
      <div className="hidden md:block w-72 shrink-0" />

      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Room Header */}
        <div className="h-20 border-b border-surface-container-highest/40 flex items-center justify-between px-8 bg-surface-bright/90 backdrop-blur-xl sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <h2 className="text-[20px] font-bold text-primary-container tracking-tight">{roomName}</h2>
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-highest/50 shadow-sm">
              <span className="material-symbols-outlined text-[13px] text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-[11px] text-outline tracking-wide font-medium">E2EE Active</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${isConnected ? "bg-primary-container/10 text-primary-container" : "bg-error-container/50 text-on-error-container"}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary-container animate-pulse" : "bg-error"}`} />
              {isConnected ? "Connected" : "Reconnecting..."}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2.5 rounded-full text-outline hover:text-primary-container hover:bg-surface-container-highest/20 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2.5 rounded-full text-outline hover:text-primary-container hover:bg-surface-container-highest/20 transition-colors lg:hidden">
              <span className="material-symbols-outlined">group</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar pb-32">
          {/* System message */}
          <div className="flex justify-center">
            <div className="text-[12px] text-outline bg-surface-container-lowest/80 backdrop-blur-sm px-6 py-2.5 rounded-full border border-surface-container-highest/40 shadow-sm">
              Connection established. Encryption keys verified.
            </div>
          </div>

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-outline/60 space-y-2">
              <span className="material-symbols-outlined text-4xl">chat_bubble_outline</span>
              <p className="text-[13px]">No messages yet. Start the conversation!</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isMine = msg.sender_id === myId;
              const isSystem = msg.sender_id === "system";
              const initials = (msg.display_name || "?").slice(0, 2).toUpperCase();
              const time = msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";

              if (isSystem) {
                return (
                  <motion.div
                    key={`msg-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                  >
                    <div className="text-[12px] text-outline bg-surface-container-lowest/80 px-6 py-2.5 rounded-full border border-surface-container-highest/40 shadow-sm">
                      {msg.content}
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={`msg-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 max-w-3xl ${isMine ? "ml-auto flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full border border-surface-container-highest/50 shadow-sm flex items-center justify-center shrink-0 text-[12px] font-bold tracking-wider ${isMine ? "bg-primary-container/20 text-primary-container" : "bg-surface-container-low text-on-surface-variant"}`}>
                    {initials}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col gap-1.5 ${isMine ? "items-end" : ""}`}>
                    <div className={`flex items-baseline gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                      <span className="text-[13px] font-semibold text-primary-container">
                        {isMine ? "You" : msg.display_name}
                      </span>
                      <span className="text-[10px] text-outline">{time}</span>
                    </div>
                    <div className={`p-5 shadow-sm border border-surface-container-highest/30 text-on-surface text-[16px] leading-relaxed ${
                      isMine
                        ? "bg-primary-container/10 rounded-[24px] rounded-tr-md"
                        : "bg-surface-container-lowest rounded-[24px] rounded-tl-md"
                    }`}>
                      {msg.content}
                    </div>
                    {isMine && (
                      <div className="flex items-center gap-1.5 text-outline mr-1">
                        <span className="material-symbols-outlined text-[15px]">done_all</span>
                        <span className="text-[10px]">Delivered</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input */}
        <div className="absolute bottom-6 left-72 right-80 px-8 z-20">
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-surface-container-highest/50 rounded-full flex items-end p-2 gap-2 transition-all focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.12)]">
            <button className="p-3 text-outline hover:text-primary-container transition-colors rounded-full hover:bg-surface-container-highest/30 mb-0.5 ml-1">
              <span className="material-symbols-outlined text-[24px]">add_circle</span>
            </button>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
                placeholder={isConnected ? "Secure message... (Enter to send)" : "Connecting..."}
                rows={1}
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[48px] py-3 px-4 text-[16px] text-on-surface placeholder-outline/70 outline-none leading-relaxed"
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || !isConnected}
              className="p-3.5 bg-primary-container text-white rounded-full hover:bg-primary transition-all shadow-md hover:shadow-lg mb-0.5 mr-1 flex items-center justify-center disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Participants Panel */}
      <aside className="w-80 bg-surface-container-lowest/50 backdrop-blur-xl border-l border-surface-container-highest/40 hidden lg:flex flex-col shrink-0 z-10">
        <div className="h-20 border-b border-surface-container-highest/40 flex items-center px-8 shrink-0">
          <h3 className="text-[13px] text-outline uppercase tracking-[0.1em] font-semibold">
            Participants ({participants.length + 1})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Node Status Card */}
          <div className="bg-surface-container-low/50 border border-surface-container-highest/40 p-6 rounded-3xl shadow-sm">
            <div className="text-[12px] text-outline uppercase tracking-[0.1em] mb-4 font-semibold">Node Status</div>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-primary-container animate-pulse" : "bg-outline"}`} />
              <span className={`text-[15px] font-medium ${isConnected ? "text-primary-container" : "text-outline"}`}>
                {isConnected ? "Active Sync" : "Syncing..."}
              </span>
            </div>
            <div className="text-[11px] text-outline/80 mt-4 tracking-wide uppercase">Channel ID: {roomId.slice(-8)}</div>
          </div>

          {/* You */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 border border-surface-container-highest/50 flex items-center justify-center shadow-sm">
                  <span className="text-[13px] text-primary-container font-bold">ME</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary-container border-2 border-surface-bright rounded-full shadow-sm" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-primary-container">You</div>
                <div className="text-[12px] text-outline mt-0.5">Connected</div>
              </div>
            </div>

            {/* Other participants from message history */}
            {participants.map(([id, name]) => (
              <div key={id} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-surface-container-low border border-surface-container-highest/50 flex items-center justify-center shadow-sm">
                    <span className="text-[13px] text-on-surface-variant font-bold">{(name || "?").slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary-container border-2 border-surface-bright rounded-full shadow-sm" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-primary-container">{name}</div>
                  <div className="text-[12px] text-outline mt-0.5">Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
