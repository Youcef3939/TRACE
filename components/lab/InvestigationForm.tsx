"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const VERDICTS = ["True", "False", "Misleading", "Not enough evidence"];

export default function InvestigationForm({ 
  onSubmit, 
  loading 
}: { 
  onSubmit: (source: string, v: string) => void, 
  loading: boolean 
}) {
  const [source, setSource] = useState("");
  const [verdict, setVerdict] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !verdict) return;
    onSubmit(source, verdict);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-ink">1. Provide your evidence</h3>
        <p className="text-sm text-ink/60">Find one credible source that helped you investigate this claim.</p>
        <input 
          type="url" 
          required 
          placeholder="Source URL (e.g., https://reuters.com/...)" 
          value={source} 
          onChange={(e) => setSource(e.target.value)}
          className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 text-ink focus:border-teal focus:outline-none bg-white"
        />
      </div>

      <div className="space-y-4 mt-2">
        <h3 className="text-lg font-bold text-ink">2. What is your verdict?</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {VERDICTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVerdict(v)}
              className={`rounded-xl border-2 px-3 py-4 text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                verdict === v ? "border-coral bg-coral/10 text-coral" : "border-ink/10 bg-white text-ink/60 hover:border-ink/30 hover:bg-ink/5"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !source || !verdict}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-4 text-base font-bold text-cream transition-all cursor-pointer hover:bg-[#0c5c48] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 disabled:hover:scale-100 disabled:active:scale-100"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Submit Investigation
      </button>
    </form>
  );
}
