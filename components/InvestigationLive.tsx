"use client";

import type { ReactNode, RefObject } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Check, X, Minus } from "lucide-react";
import ShinyText from "./ShinyText";
import type { Assessment, Claim, Evidence, SourceTrace } from "@/types/trace";
import { describeSignal } from "@/lib/manipulationSignals";
import InfoTooltip from "./InfoTooltip";
import HighlightedText from "./HighlightedText";
import VerifyChecklist from "./VerifyChecklist";
import {
  type StageStatus,
  DoneMark,
  ExtractGlyph,
  TraceGlyph,
  EvidenceGlyph,
  AssessGlyph,
  GuessGateGlyph,
  EmptyStateGlyph,
  ErrorGlyph,
  VerdictGlyph,
} from "./illustrations/StageIcons";

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

const LABEL_STYLE: Record<Assessment["label"], { badge: string; text: string }> = {
  well_supported: { badge: "bg-teal/10 text-teal", text: "Well supported" },
  misleading: { badge: "bg-coral/10 text-coral", text: "Misleading" },
  questionable: { badge: "bg-coral/10 text-coral", text: "Questionable" },
  unverifiable: { badge: "bg-ink/10 text-ink/60", text: "Unverifiable" },
  insufficient_evidence: { badge: "bg-ink/10 text-ink/60", text: "Insufficient evidence" },
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

/** Maps a pipeline stage's raw state to the shared visual vocabulary the stage glyphs render against. */
function stageStatus<T>(state: StageState<T>): StageStatus {
  if (state.status === "error") return "error";
  if (state.status === "done") return "done";
  return "active";
}

const STATUS_CIRCLE: Record<StageStatus, string> = {
  locked: "bg-ink/20",
  active: "bg-teal",
  done: "bg-teal",
  error: "bg-coral",
};

function StepShell({
  icon: Icon,
  title,
  status,
  children,
}: {
  icon: (props: { status: StageStatus; size?: number }) => ReactNode;
  title: string;
  status: StageStatus;
  children: ReactNode;
}) {
  const locked = status === "locked";
  return (
    <div className={`relative transition-opacity ${locked ? "opacity-40" : "opacity-100"}`}>
      <motion.div
        className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white ${STATUS_CIRCLE[status]}`}
        animate={status === "done" ? { scale: [1, 1.28, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Icon status={status} size={14} />
        {status === "done" && <DoneMark size={12} />}
      </motion.div>
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
    return <p className="text-sm text-coral/80">This step had an issue, continuing without it.</p>;
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
      {publicationTrackRecord ? `, ${publicationTrackRecord}` : ""} (confidence: {confidence})
    </p>
  );
}

function RetrieveEvidenceStep({ state }: { state: StageState<number> }) {
  if (state.status === "pending") {
    return <p className="text-sm text-ink/50">Waiting to start…</p>;
  }
  if (state.status === "error") {
    return <p className="text-sm text-coral/80">This step had an issue, continuing without it.</p>;
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

const GUESS_BADGE_TEXT: Record<Guess, string> = {
  true: "Looked true",
  misleading: "Looked misleading",
};

/**
 * The payoff moment of the guess-before-reveal mechanic: the user's gut read and TRACE's verdict
 * slide in from opposite sides and collide in the middle, where a connector glyph resolves the
 * comparison (check for a match, x for a miss, dash when the verdict is too ambiguous to score).
 */
function GuessVerdictReveal({ guess, label }: { guess: Guess; label: Assessment["label"] }) {
  const match = guessMatchesVerdict(guess, label);
  const verdictText = LABEL_STYLE[label].text.toLowerCase();

  const connectorStyle =
    match === true ? "bg-teal text-cream" : match === false ? "bg-coral text-cream" : "bg-ink/15 text-ink/50";
  const verdictBadgeStyle =
    match === true
      ? "border-teal bg-teal/10 text-teal"
      : match === false
      ? "border-coral bg-coral/10 text-coral"
      : "border-ink/15 bg-white text-ink/70";

  return (
    <div className="mb-5">
      <div className="relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-ink/10 bg-ink/[0.02] px-4 py-6">
        {match === true && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-teal"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ delay: 0.85, duration: 0.9 }}
          />
        )}

        <motion.div
          initial={{ x: -36, opacity: 0 }}
          animate={
            match === false
              ? { x: [-36, 0, 0, -3, 3, -3, 0], opacity: [0, 1, 1, 1, 1, 1, 1] }
              : { x: 0, opacity: 1 }
          }
          transition={
            match === false
              ? { duration: 1.1, times: [0, 0.4, 0.65, 0.75, 0.85, 0.95, 1], ease: "easeOut" }
              : { duration: 0.5, ease: "easeOut" }
          }
          className="rounded-full border-2 border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          You: {GUESS_BADGE_TEXT[guess]}
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.55, duration: 0.45, type: "spring", stiffness: 320, damping: 16 }}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${connectorStyle}`}
        >
          {match === true ? (
            <Check size={16} strokeWidth={3} />
          ) : match === false ? (
            <X size={16} strokeWidth={3} />
          ) : (
            <Minus size={16} strokeWidth={3} />
          )}
        </motion.div>

        <motion.div
          initial={{ x: 36, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${verdictBadgeStyle}`}
        >
          TRACE: {LABEL_STYLE[label].text}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.35 }}
        className="mt-3 flex items-start gap-2 rounded-xl bg-ink/5 p-3 text-sm text-ink/70"
      >
        {match === true && <Sparkles size={16} className="mt-0.5 shrink-0 text-teal" />}
        <span>
          {match === null
            ? `You guessed this ${GUESS_COPY[guess]}. TRACE couldn't reach a confident verdict here, so there's no clean match or miss to score, see why below.`
            : match
            ? "Your instinct was right, here's the evidence that confirms it."
            : `You guessed this ${GUESS_COPY[guess]}. TRACE found it ${verdictText}. Here's exactly what changed the picture:`}
        </span>
      </motion.div>
    </div>
  );
}

function AssessStep({ state, locked, guess, claimText }: { state: StageState<Claim>; locked: boolean; guess: Guess | "skipped" | null; claimText: string }) {
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
    return <p className="text-sm text-coral/80">Assessment failed for this claim: {state.error}</p>;
  }

  const { assessment, evidence, verifyYourself } = state.data;
  const style = LABEL_STYLE[assessment.label];

  return (
    <div className="space-y-4">
      {(guess === "true" || guess === "misleading") && <GuessVerdictReveal guess={guess} label={assessment.label} />}
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${style.badge}`}>
        <VerdictGlyph label={assessment.label} size={15} />
        {style.text}
      </div>
      <p className="text-sm leading-relaxed text-ink/70">{assessment.reasoningChain}</p>

      {assessment.manipulationSignals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assessment.manipulationSignals.map((signal) => {
            const { label, description } = describeSignal(signal);
            return (
              <InfoTooltip key={signal} label={label} description={description}>
                <span className="cursor-help rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/60 underline decoration-dotted decoration-ink/30 underline-offset-2">
                  {signal}
                </span>
              </InfoTooltip>
            );
          })}
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
              <p className="text-sm italic text-ink/70">
                &ldquo;<HighlightedText text={e.excerpt} signals={assessment.manipulationSignals} />&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}

      {verifyYourself.length > 0 && (
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/40">Verify this yourself</span>
          <VerifyChecklist steps={verifyYourself} claimText={claimText} />
        </div>
      )}
    </div>
  );
}

function GuessGate({ onGuess }: { onGuess: (guess: Guess | "skipped") => void }) {
  return (
    <div className="p-6 text-center sm:p-8">
      <GuessGateGlyph size={44} className="mx-auto mb-3" />
      <p className="text-base font-semibold text-ink">Before TRACE investigates, what&apos;s your gut read?</p>
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
        Skip, just show me
      </button>
    </div>
  );
}

export default function InvestigationLive({
  state,
  onGuess,
  sessionTally,
  anchorRef,
}: {
  state: RunState;
  onGuess: (claimIndex: number, guess: Guess | "skipped") => void;
  sessionTally: { attempted: number; matched: number };
  anchorRef?: RefObject<HTMLDivElement | null>;
}) {
  if (state.phase === "idle") return null;

  return (
    <section className="bg-cream py-16 sm:py-20 text-ink">
      <div ref={anchorRef} className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <ShinyText
              text={state.phase === "complete" ? "Investigation complete" : "Investigating…"}
              disabled={state.phase === "complete"}
              speed={3}
              color="rgba(20, 35, 29, 0.55)"
              shineColor="#FAF8F2"
              className="font-mono text-xs uppercase tracking-widest"
            />
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
              {state.elapsedMs > 15000 ? ", still working, real sources take time to read" : ""}
            </span>
          )}
        </div>

        {state.fatalError && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: [0, 0, -2, 2, -2, 0] }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.55, 0.7, 0.85, 1] }}
            className="mb-6 flex items-start gap-3 rounded-2xl border-2 border-coral/30 bg-coral/5 p-5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-coral/10">
              <ErrorGlyph size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-coral">This investigation hit a problem</p>
              <p className="mt-1 text-sm text-ink/60">{state.fatalError}</p>
            </div>
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border-2 border-ink/10 bg-white p-8 text-center"
          >
            <ExtractGlyph status="active" size={34} className="mx-auto mb-3" />
            <p className="text-sm text-ink/60">Reading your text and pulling out checkable claims…</p>
          </motion.div>
        )}

        {state.phase === "complete" && state.claims.length === 0 && !state.fatalError && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border-2 border-ink/10 bg-white p-8 text-center"
          >
            <EmptyStateGlyph size={30} className="mx-auto mb-3" />
            <p className="text-base font-semibold text-ink">No checkable claim found</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
              TRACE couldn&apos;t find a specific, checkable factual claim in this text, opinions,
              questions, and speculation aren&apos;t things evidence can confirm or refute. TRACE looks
              for statements that assert something about the world.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink/50">
              Try pasting a specific statement instead, e.g. &ldquo;Coffee cures cancer&rdquo; rather
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
                  <p className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                    &ldquo;
                    {claim.assess.status === "done" ? (
                      <HighlightedText text={claim.text} signals={claim.assess.data.assessment.manipulationSignals} />
                    ) : (
                      claim.text
                    )}
                    &rdquo;
                  </p>
                </div>

                {claim.guess === null ? (
                  <GuessGate onGuess={(guess) => onGuess(i, guess)} />
                ) : (
                  <div className="p-6 sm:p-8">
                    <div className="relative border-l-2 border-ink/10 pl-6 space-y-10">
                      <StepShell icon={TraceGlyph} title="Source tracing" status={stageStatus(claim.traceSource)}>
                        <TraceSourceStep state={claim.traceSource} />
                      </StepShell>

                      <StepShell icon={EvidenceGlyph} title="Gather evidence" status={stageStatus(claim.retrieveEvidence)}>
                        <RetrieveEvidenceStep state={claim.retrieveEvidence} />
                      </StepShell>

                      <StepShell icon={AssessGlyph} title="Assess" status={bothSettled ? stageStatus(claim.assess) : "locked"}>
                        <AssessStep state={claim.assess} locked={!bothSettled} guess={claim.guess} claimText={claim.text} />
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
