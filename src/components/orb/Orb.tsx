"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrbStore } from "@/stores/orb-store";
import { cn } from "@/lib/utils";

export function Orb() {
  const { isOpen, openOrb, closeOrb } = useOrbStore();

  return (
    <>
      {/* Orb button (visible when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={openOrb}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center group"
            aria-label="Open AI Orb"
          >
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--neon-blue)]/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Inner orb */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon-blue)] to-[var(--cosmic-purple)] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.5)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.7)] transition-shadow">
              <span className="text-xl">🔮</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Orb overlay */}
      <AnimatePresence>
        {isOpen && <OrbOverlay onClose={closeOrb} />}
      </AnimatePresence>
    </>
  );
}

function OrbOverlay({ onClose }: { onClose: () => void }) {
  const { messages, inputValue, setInputValue, sendMessage, isLoading } = useOrbStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(messages.length === 0);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    setShowIntro(false);
    await sendMessage(inputValue);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[var(--deep-space)]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Orb dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 flex flex-col rounded-2xl bg-[var(--dark-gray)] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-blue)] to-[var(--cosmic-purple)] flex items-center justify-center">
              <span className="text-lg">🔮</span>
            </div>
            <div>
              <h2 className="font-bold text-white">NEXUS</h2>
              <p className="text-xs text-[var(--light-gray)]/60">AI Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Intro message */}
          {showIntro && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--cosmic-purple)]/20 flex items-center justify-center">
                <span className="text-4xl">🔮</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Welcome to NEXUS</h3>
              <p className="text-[var(--light-gray)]/60 max-w-sm mx-auto">
                I&apos;m your AI guide to ProjectX OS. Ask me about missions, features, or just say hello!
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {["What can I do?", "Tell me about missions", "Any secrets?"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInputValue(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-[var(--light-gray)] hover:bg-white/10 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message history */}
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-[var(--neon-blue)] to-[var(--cosmic-purple)]"
                    : "bg-[var(--molten-orange)]"
                )}
              >
                {message.role === "assistant" ? "🔮" : "👤"}
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-2xl",
                  message.role === "assistant"
                    ? "bg-white/5 text-[var(--light-gray)]"
                    : "bg-[var(--molten-orange)] text-[var(--deep-space)]"
                )}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-blue)] to-[var(--cosmic-purple)] flex items-center justify-center text-sm">
                🔮
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/5">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[var(--neon-blue)]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask NEXUS anything..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--neon-blue)]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-[var(--neon-blue)] text-[var(--deep-space)] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-shadow"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-center mt-2 text-[var(--light-gray)]/40">
            Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Esc</kbd> to close
          </p>
        </form>
      </motion.div>
    </>
  );
}
