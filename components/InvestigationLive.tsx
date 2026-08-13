"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, HelpCircle, Search, FileSearch, Scale, Loader2, Sparkles } from "lucide-react";
import type { Assessment, Claim, Evidence, SourceTrace } from "@/types/trace";

export type StageState<T> =
  | { status: "pending" }
  | { status: "done"; data: T }
  | { status: "error"; error: string };

export type Guess = "true" | "misleading";

export interface ClaimRunState {
  text: string;
  originalContext: string;
  traceSource: StageState<SourceTrace>;
  retrieveEvidence: StageState<number>; // just the count of sources found
  assess: StageState<Claim>;
  guess: Guess | "skipped" | null;
}

export interface RunState {
  phase: "idle" | "extracting" | "processing" | "complete" | "fatal";
  claims: ClaimRunState[];
  totalClaimsFound: number | null;
  capNotice: string | null;
  fatalError: string | null;
  elapsedMs: number;
}

const LABEL_STYLE: Record<Assessment["label"], { badge: string; text: string; icon: typeof CheckCircle2 }> = {
  well_supported: { badge: "bg-teal/10 text-teal", text: "Well supported", icon: CheckCircle2 },
  misleading: { badge: "bg-coral/10 text-coral", text: "Misleading", icon: AlertTriangle },
  questionable: { badge: "bg-coral/10 text-coral", text: "Questionable", icon: AlertTriangle },
  unverifiable: { badge: "bg-ink/10 text-ink/60", text: "Unverifiable", icon: HelpCircle },
  insufficient_evidence: { badge: "bg-ink/10 text-ink/60", text: "Insufficient evidence", icon: HelpCircle },
};

const STANCE_STYLE: Record<Evidence["stance"], string> = {
  supports: "bg-teal/10 text-teal",
  contradicts: "bg-coral/10 text-coral",
  context: "bg-ink/10 text-ink/60",
  unrelated: "bg-ink/10 text-ink/40",
};

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${s}s`;
}

function StepShell({
  icon: Icon,
  title,
  locked,
  children,
}: {
  icon: typeof Search;
  title: string;
  locked: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`relative transition-opacity ${locked ? "opacity-40" : "opacity-100"}`}>
      <div
        className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white ${
          locked ? "bg-ink/30" : "bg-teal"
        }`}
      >
        <Icon size={14} strokeWidth={3} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function TraceSourceStep({ state }: { state: StageState<SourceTrace> }) {
  if (state.status === "pending") {
    return <p className="text-sm text-ink/50">Waiting to start…</p>;
  }
  if (state.status === "error") {
    return <p className="text-sm text-coral/80">This step had an issue — continuing without it.</p>;
  }
  const { confidence, originUrl, originAuthor, publicationTrackRecord } = state.data;
  if (!originUrl) {
    return (
      <p className="text-sm leading-relaxed text-ink/70">
        No clear origin could be identified from available sources (confidence: {confidence}).
      </p>
    );
  }
  return (
    <p className="text-sm leading-relaxed text-ink/70">
      Likely origin: <a href={originUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-teal hover:underline">{originAuthor || originUrl}</a>
      {publicationTrackRecord ? ` — ${publicationTrackRecord}` : ""} (confidence: {confidence})
    </p>
  );
}

function RetrieveEvidenceStep({ state }: { state: StageState<number> }) {
  if (state.status === "pending") {
    return <p className="text-sm text-ink/50">Waiting to start…</p>;
  }
  if (state.status === "error") {
    return <p className="text-sm text-coral/80">This step had an issue — continuing without it.</p>;
  }
  return (
    <p className="text-sm leading-relaxed text-ink/70">
      Found {state.data} source{state.data === 1 ? "" : "s"} to weigh.
    </p>
  );
}

/**
 * Maps a verdict label to whether it agrees with a "true" or "misleading" gut guess.
 * Returns null for verdicts that are inherently ambiguous relative to a binary guess
 * (unverifiable / insufficient_evidence) — those shouldn't be scored as a match or a miss.
 */
export function guessMatchesVerdict(guess: Guess, label: Assessment["label"]): boolean | null {
  if (label === "well_supported") return guess === "true";
  if (label === "misleading" || label === "questionable") return guess === "misleading";
  return null;
}

const GUESS_COPY: Record<Guess, string> = {
  true: "looked true",
  misleading: "looked misleading",
};

function GuessComparison({ guess, label }: { guess: Guess; label: Assessment["label"] }) {
  const match = guessMatchesVerdict(guess, label);
  const verdictText = LABEL_STYLE[label].text.toLowerCase();

  if (match === null) {
    return (
      <div className="mb-4 rounded-xl bg-ink/5 p-3 text-sm text-ink/60">
        You guessed this {GUESS_COPY[guess]}. TRACE couldn&apos;t reach a confident verdict here, so
        there&apos;s no clean match or miss to score — see why below.
      </div>
    );
  }

  if (match) {
    return (
      <div className="mb-4 flex items-start gap-2 rounded-xl bg-teal/5 p-3 text-sm text-ink/70">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-teal" />
        <span>Your instinct was right — here&apos;s the evidence that confirms it.</span>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl bg-ink/5 p-3 text-sm text-ink/70">
      You guessed this {GUESS_COPY[guess]}. TRACE found it {verdictText}. Here&apos;s exactly what
      changed the picture:
    </div>
  );
}

function AssessStep({ state, locked, guess }: { state: StageState<Claim>; locked: boolean; guess: Guess | "skipped" | null }) {
  if (locked) {
    return <p className="text-sm text-ink/40">Locked until source tracing and evidence gathering finish.</p>;
  }
  if (state.status === "pending") {
    return (
      <p className="flex items-center gap-2 text-sm text-ink/50">
        <Loader2 size={14} className="animate-spin" /> Weighing evidence…
      </p>
    );
  }
  if (state.status === "error") {
    return <p className="text-sm text-coral/80">Assessment failed for this claim — {state.error}</p>;
  }

  const { assessment, evidence, verifyYourself } = state.data;
  const style = LABEL_STYLE[assessment.label];
  const StyleIcon = style.icon;

  return (
    <div className="space-y-4">
      {(guess === "true" || guess === "misleading") && <GuessComparison guess={guess} label={assessment.label} />}
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${style.badge}`}>
        <StyleIcon size={15} strokeWidth={2.5} />
        {style.text}
      </div>
      <p className="text-sm leading-relaxed text-ink/70">{assessment.reasoningChain}</p>

      {assessment.manipulationSignals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assessment.manipulationSignals.map((signal) => (
            <span key={signal} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/60">
              {signal}
            </span>
          ))}
        </div>
      )}

      {evidence.length > 0 && (
        <div className="space-y-2">
          {evidence.map((e) => (
            <div key={e.id} className="rounded-xl border border-ink/10 bg-cream/50 p-3">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STANCE_STYLE[e.stance]}`}>{e.stance}</span>
                <span className="text-xs text-ink/40">{e.credibilitySignal.replace("_", " ")}</span>
                <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-teal hover:underline">
                  {e.sourceName}
                </a>
              </div>
              <p className="text-sm italic text-ink/70">&ldquo;{e.excerpt}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      {verifyYourself.length > 0 && (
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/40">Verify this yourself</span>
          <ul className="space-y-1.5">
            {verifyYourself.map((step) => (
              <li key={step} className="text-sm text-ink/70">• {step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GuessGate({ onGuess }: { onGuess: (guess: Guess | "skipped") => void }) {
  return (
    <div className="p-6 text-center sm:p-8">
      <p className="text-base font-semibold text-ink">Before TRACE investigates — what&apos;s your gut read?</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => onGuess("true")}
          className="rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 cursor-pointer"
        >
          Looks true to me
        </button>
        <button
          type="button"
          onClick={() => onGuess("misleading")}
          className="rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 cursor-pointer"
        >
          Looks misleading to me
        </button>
      </div>
      <button
        type="button"
        onClick={() => onGuess("skipped")}
        className="mt-4 text-xs font-medium text-ink/40 underline decoration-ink/20 underline-offset-2 hover:text-ink/60 cursor-pointer"
      >
        Skip — just show me
      </button>
    </div>
  );
}

export default function InvestigationLive({
  state,
  onGuess,
  sessionTally,
}: {
  state: RunState;
  onGuess: (claimIndex: number, guess: Guess | "skipped") => void;
  sessionTally: { attempted: number; matched: number };
}) {
  if (state.phase === "idle") return null;

  return (
    <section className="bg-cream py-16 sm:py-20 text-ink">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-ink/40">
              {state.phase === "complete" ? "Investigation complete" : "Investigating…"}
            </span>
            {sessionTally.attempted > 0 && (
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/50">
                {sessionTally.matched}/{sessionTally.attempted} guesses matched TRACE
              </span>
            )}
          </span>
          {state.phase !== "complete" && state.phase !== "fatal" && (
            <span className="flex items-center gap-2 text-xs text-ink/40">
              <Loader2 size={12} className="animate-spin" />
              {formatElapsed(state.elapsedMs)} elapsed
              {state.elapsedMs > 15000 ? " — still working, real sources take time to read" : ""}
            </span>
          )}
        </div>

        {state.fatalError && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 rounded-2xl border-2 border-coral/30 bg-coral/5 p-5"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-coral">
              <AlertTriangle size={16} /> This investigation hit a problem
            </p>
            <p className="mt-1 text-sm text-ink/60">{state.fatalError}</p>
          </motion.div>
        )}

        {state.capNotice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 rounded-2xl border-2 border-ink/10 bg-white p-4"
          >
            <p className="text-sm text-ink/70">{state.capNotice}</p>
          </motion.div>
        )}

        {state.phase === "extracting" && (
          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 text-center">
            <Loader2 size={20} className="mx-auto mb-3 animate-spin text-teal" />
            <p className="text-sm text-ink/60">Reading your text and pulling out checkable claims…</p>
          </div>
        )}

        {state.phase === "complete" && state.claims.length === 0 && !state.fatalError && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border-2 border-ink/10 bg-white p-8 text-center"
          >
            <HelpCircle size={22} className="mx-auto mb-3 text-teal" />
            <p className="text-base font-semibold text-ink">No checkable claim found</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
              TRACE couldn&apos;t find a specific, checkable factual claim in this text — opinions,
              questions, and speculation aren&apos;t things evidence can confirm or refute. TRACE looks
              for statements that assert something about the world.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink/50">
              Try pasting a specific statement instead — e.g. &ldquo;Coffee cures cancer&rdquo; rather
              than a question or opinion.
            </p>
          </motion.div>
        )}

        <div className="space-y-6">
          {state.claims.map((claim, i) => {
            const bothSettled = claim.traceSource.status !== "pending" && claim.retrieveEvidence.status !== "pending";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-3xl border-2 border-ink/10 bg-white shadow-xl"
              >
                <div className="border-b border-ink/10 p-6 sm:p-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/40">
                    {"// CLAIM_"}{i + 1}
                  </span>
                  <p className="mt-2 text-xl font-semibold text-ink sm:text-2xl">&ldquo;{claim.text}&rdquo;</p>
                </div>

                {claim.guess === null ? (
                  <GuessGate onGuess={(guess) => onGuess(i, guess)} />
                ) : (
                  <div className="p-6 sm:p-8">
                    <div className="relative border-l-2 border-ink/10 pl-6 space-y-10">
                      <StepShell icon={Search} title="Source tracing" locked={false}>
                        <TraceSourceStep state={claim.traceSource} />
                      </StepShell>

                      <StepShell icon={FileSearch} title="Gather evidence" locked={false}>
                        <RetrieveEvidenceStep state={claim.retrieveEvidence} />
                      </StepShell>

                      <StepShell icon={Scale} title="Assess" locked={!bothSettled}>
                        <AssessStep state={claim.assess} locked={!bothSettled} guess={claim.guess} />
                      </StepShell>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
