"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Web Speech API event types (not in default TypeScript DOM lib)
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: { length: number; [index: number]: { transcript: string } };
}
interface SpeechRecognitionEventType {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEventType {
  error: string;
}

const SpeechRecognition =
  typeof window !== "undefined"
    ? // @ts-expect-error: Web Speech API types are available at runtime in supported browsers
      (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
    : undefined;

export function AboutMeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const voiceBaseRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-SG";
    rec.onresult = (event: SpeechRecognitionEventType) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript + " ";
      }
      const prefix = voiceBaseRef.current.trim();
      const base = prefix ? prefix + " " : "";
      setInput(base + combined.trim());
    };
    rec.onerror = (event: SpeechRecognitionErrorEventType) => {
      if (event.error !== "aborted") setVoiceError("Voice input failed. Try again.");
      setIsListening(false);
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* noop */
      }
      recognitionRef.current = null;
    };
  }, []);

  const toggleVoice = () => {
    if (!SpeechRecognition || !recognitionRef.current) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }
    setVoiceError(null);
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        voiceBaseRef.current = input;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setVoiceError("Could not start microphone.");
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    setVoiceError(null);

    try {
      const res = await fetch("/api/about-me-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Failed to reach the profile assistant.");
      }

      const data = (await res.json()) as { reply?: string };
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong talking to the profile assistant."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:max-w-5xl">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-ai-accent-soft">
          Ask about me
        </p>
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl">
          Chat with an AI that only talks about my work
        </h1>
        <p className="text-base text-slate-300/90 sm:text-lg">
          Ask about my projects, skills, trips, or certificates. Guard‑railed to this site only.
        </p>
      </motion.div>

      <motion.div
        className="relative flex min-h-[55vh] flex-col gap-5 rounded-3xl border border-ai-border/70 bg-ai-surface/85 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.2),0_0_40px_rgba(34,211,238,0.1)] sm:p-8"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-ai-accent-soft/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-ai-accent/15 blur-3xl" />

        <div className="relative flex max-h-[50vh] min-h-[280px] flex-1 flex-col gap-3 overflow-y-auto pr-2 text-[0.9rem] sm:min-h-[320px] sm:text-base">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ai-border/60 bg-black/30 px-4 py-3 text-slate-300/90 sm:px-5 sm:py-4">
              Try: &quot;What is SnapRent?&quot; or &quot;What trips have you been on?&quot; — or use the mic to speak.
            </div>
          )}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 ${
                  m.role === "user"
                    ? "bg-ai-accent-soft/80 text-slate-950"
                    : "bg-black/50 text-slate-100"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {(error || voiceError) && (
          <div className="text-[0.8rem] text-red-400/90">{error || voiceError}</div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-center gap-3 pt-2">
          <div className="relative flex flex-1 items-center gap-2">
            <input
              className="h-12 w-full rounded-2xl border border-ai-border/60 bg-black/40 pl-4 pr-12 text-[0.9rem] text-slate-100 outline-none placeholder:text-slate-500 focus:border-ai-accent-soft/80 focus:ring-2 focus:ring-ai-accent-soft/40 sm:h-14 sm:text-base"
              placeholder="Ask something about my work... or use the mic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleVoice}
              disabled={isLoading}
              title={
                SpeechRecognition
                  ? isListening
                    ? "Stop listening"
                    : "Voice input"
                  : "Voice not supported"
              }
              className={`absolute right-2 flex h-9 w-9 items-center justify-center rounded-full border transition sm:right-3 sm:h-10 sm:w-10 ${
                isListening
                  ? "border-red-400 bg-red-500/90 text-white shadow-[0_0_18px_rgba(248,113,113,0.6)]"
                  : "border-ai-accent-soft/60 bg-black/40 text-ai-accent-soft hover:bg-ai-accent-soft/15 hover:shadow-[0_0_16px_rgba(34,211,238,0.4)]"
              } ${!SpeechRecognition ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5a3 3 0 10-6 0v6c0 1.66 1.34 3 3 3zm4.28-3a.75.75 0 00-.74.64C15.3 13.94 13.79 15 12 15s-3.3-1.06-3.54-3.36a.75.75 0 00-1.49.16C7.3 14.61 9.28 16.39 12 16.72V19H9.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H12v-2.28c2.72-.33 4.7-2.11 5.03-4.92a.75.75 0 00-.75-.64z" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex h-12 w-24 items-center justify-center rounded-2xl bg-ai-accent-soft px-4 text-[0.9rem] font-medium text-slate-950 shadow-ai-soft transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-ai-accent hover:shadow-[0_0_24px_rgba(34,211,238,0.4)] sm:h-14 sm:w-28 sm:text-base"
          >
            {isLoading ? "..." : "Ask"}
          </button>
        </form>
      </motion.div>

      <motion.p
        className="text-center text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/" className="text-ai-accent-soft underline-offset-2 hover:underline">
          ← Back to home
        </Link>
      </motion.p>
    </div>
  );
}
