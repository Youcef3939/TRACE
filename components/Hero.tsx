"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Link2, ImageIcon, ArrowRight, Loader2, UploadCloud, Send } from "lucide-react";
import { IdleAccentGlyph } from "./illustrations/StageIcons";

type Mode = "text" | "url" | "screenshot";
type ChatMessage = { role: "user" | "ai"; content: string };

const PLACEHOLDERS: Record<Mode, string[]> = {
  text: [
    "Paste a claim...",
    "\"Drinking celery juice reverses diabetes\"",
    "\"5G towers cause health problems\"",
  ],
  url: [
    "Paste a URL...",
    "https://example.com/news/breaking-story",
    "https://example.com/article/health-claim",
  ],
  screenshot: [
    "Paste an image (Ctrl+V)",
    "Click here to upload a screenshot",
    "Drag and drop an image of a claim",
  ],
};

const EXAMPLE_CHIPS = [
  "Coffee cures cancer",
  "Government bans electric cars",
  "This photo shows last week's flood",
];

const MODES: { id: Mode; label: string; icon: typeof FileText; disabled?: boolean }[] = [
  { id: "text", label: "Text", icon: FileText },
  { id: "url", label: "URL", icon: Link2 },
  { id: "screenshot", label: "Screenshot", icon: ImageIcon },
];

export default function Hero({
  onInvestigate,
  loading = false,
}: { onInvestigate?: (text: string, mode: "text" | "url") => void; loading?: boolean } = {}) {
  const [mode, setMode] = useState<Mode>("text");
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeImageBase64, setActiveImageBase64] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatQuery, setChatQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const placeholders = useMemo(() => PLACEHOLDERS[mode], [mode]);
  const safePlaceholderIndex = placeholderIndex % placeholders.length;

  useEffect(() => {
    if (placeholders.length <= 1) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [placeholders]);

  const handleInvestigate = () => {
    if (!value.trim() || loading || extracting || mode === "screenshot") return;
    onInvestigate?.(value, mode);
  };

  const handleChip = (text: string) => {
    setMode("text");
    setValue(text);
    setActiveImageBase64(null);
    setChatHistory([]);
    textareaRef.current?.focus();
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode !== "screenshot" && newMode !== "text") {
      setActiveImageBase64(null);
      setChatHistory([]);
    }
  };

  const handleImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setExtracting(true);
    setMode("text"); 
    setValue("");
    setActiveImageBase64(null);
    setChatHistory([]);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setActiveImageBase64(base64);
        
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 })
        });
        
        const data = await res.json();
        if (data.text) {
          setValue(data.text);
        } else {
          setValue("[Error extracting visual context. Please try again.]");
        }
        setExtracting(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setValue("[Error extracting visual context. Please try again.]\n\nDetails: " + (err instanceof Error ? err.message : String(err)));
      setExtracting(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || !activeImageBase64 || chatLoading) return;
    
    const query = chatQuery;
    setChatQuery("");
    setChatHistory((prev) => [...prev, { role: "user", content: query }]);
    setChatLoading(true);
    
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: activeImageBase64, query })
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: "ai", content: data.text || "Failed to analyze." }]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "ai", content: "Error connecting to vision engine." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleImage(file);
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleImage(file);
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #0F6E56 0%, transparent 70%)" }}
        aria-hidden
      />
      <IdleAccentGlyph size={150} className="pointer-events-none absolute right-8 top-24 hidden opacity-[0.07] sm:block" />
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl"
        >
          Your guide through the{" "}
          <span className="text-teal">information noise</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-ink/70 sm:text-xl"
        >
          TRACE walks you through the evidence so you can investigate a claim
          yourself, instead of just being handed a verdict.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl text-left"
        >
          <div className="mb-3 flex items-center gap-1.5" role="tablist" aria-label="Input mode">
            {MODES.map(({ id, label, icon: Icon, disabled }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                disabled={disabled}
                onClick={() => !disabled && handleModeChange(id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  mode === id
                    ? "bg-ink text-cream"
                    : disabled
                    ? "cursor-not-allowed text-ink/35"
                    : "text-ink/60 hover:bg-ink/5 hover:text-ink cursor-pointer"
                }`}
              >
                <Icon size={15} />
                {label}
                {disabled && (
                  <span className="ml-1 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/50">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          <div 
            className="relative rounded-2xl border-2 border-ink/10 bg-white p-3 shadow-[0_2px_0_0_rgba(20,35,29,0.06)] transition-colors focus-within:border-teal sm:p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {extracting ? (
              <div className="flex h-[120px] w-full flex-col items-center justify-center gap-3 text-ink/60">
                <Loader2 size={24} className="animate-spin text-teal" />
                <span className="text-sm font-medium">Analyzing visual scene and extracting text...</span>
              </div>
            ) : mode === "screenshot" ? (
              <div 
                className="flex h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 bg-cream/50 transition-colors hover:border-teal/50 hover:bg-teal/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={24} className="text-teal" />
                <span className="text-sm font-medium text-ink/60">
                  {placeholders[safePlaceholderIndex]}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onPaste={handlePaste}
                rows={mode === "url" ? 2 : activeImageBase64 ? 6 : 4}
                placeholder={placeholders[safePlaceholderIndex]}
                className="w-full resize-none bg-transparent text-lg text-ink placeholder:text-ink/35 focus:outline-none"
              />
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-ink/40">
                {mode === "screenshot"
                  ? "We'll analyze your screenshot so you can review it first."
                  : "Press Investigate to start, nothing is submitted until you click."}
              </span>
              <button
                type="button"
                onClick={handleInvestigate}
                disabled={!value.trim() || loading || extracting || mode === "screenshot"}
                className="flex shrink-0 items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-[#c14e26] disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Investigating
                  </>
                ) : (
                  <>
                    Investigate
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {activeImageBase64 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border-2 border-ink/10 bg-white p-4 shadow-sm flex flex-col gap-3">
                  {chatHistory.length > 0 && (
                    <div className="flex max-h-48 flex-col gap-3 overflow-y-auto pr-2 pb-2">
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                            msg.role === "user" ? "bg-teal text-cream" : "bg-cream text-ink/80"
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-2xl bg-cream px-4 py-3 text-ink/80">
                            <Loader2 size={14} className="animate-spin text-teal" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <form onSubmit={handleChatSubmit} className="relative flex items-center">
                    <input
                      type="text"
                      value={chatQuery}
                      onChange={(e) => setChatQuery(e.target.value)}
                      placeholder="Ask TRACE a question about this image..."
                      disabled={chatLoading}
                      className="w-full rounded-xl border-2 border-ink/10 bg-cream/30 px-4 py-3 pr-12 text-sm text-ink focus:border-teal focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!chatQuery.trim() || chatLoading}
                      className="absolute right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-teal text-cream transition-colors hover:bg-[#0c5c48] disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/40"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink/45">Try:</span>
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChip(chip)}
                className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-sm text-ink/70 transition-colors hover:border-teal hover:text-teal cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
