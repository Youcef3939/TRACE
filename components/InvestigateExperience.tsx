"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import InvestigationLive, { type ClaimRunState, type RunState, type Guess, guessMatchesVerdict } from "@/components/InvestigationLive";
import type { ProgressEvent } from "@/lib/pipeline/runInvestigation";

const IDLE_STATE: RunState = {
  phase: "idle",
  claims: [],
  totalClaimsFound: null,
  capNotice: null,
  fatalError: null,
  elapsedMs: 0,
};

function emptyClaim(text: string, originalContext: string): ClaimRunState {
  return {
    text,
    originalContext,
    traceSource: { status: "pending" },
    retrieveEvidence: { status: "pending" },
    assess: { status: "pending" },
    guess: null,
  };
}

export default function InvestigateExperience() {
  const [state, setState] = useState<RunState>(IDLE_STATE);
  const [sessionTally, setSessionTally] = useState({ attempted: 0, matched: 0 });
  const startedAtRef = useRef<number | null>(null);
  const runIdRef = useRef(0);
  const countedKeysRef = useRef<Set<string>>(new Set());

  // Counts a claim's guess-vs-verdict outcome into the session-wide tally exactly once, the moment
  // both a real guess and a resolved assessment are present for it — regardless of which arrives
  // second (a fast guesser may click before assess resolves; a slow guesser sees it already done).
  const maybeCountGuess = (claims: ClaimRunState[], claimIndex: number) => {
    const claim = claims[claimIndex];
    if (!claim || (claim.guess !== "true" && claim.guess !== "misleading")) return;
    if (claim.assess.status !== "done") return;

    const key = `${runIdRef.current}-${claimIndex}`;
    if (countedKeysRef.current.has(key)) return;
    countedKeysRef.current.add(key);

    const result = guessMatchesVerdict(claim.guess, claim.assess.data.assessment.label);
    if (result === null) return; // ambiguous verdict — not scored as a match or a miss
    setSessionTally((t) => ({ attempted: t.attempted + 1, matched: t.matched + (result ? 1 : 0) }));
  };

  useEffect(() => {
    if (state.phase !== "extracting" && state.phase !== "processing") return;
    const interval = setInterval(() => {
      if (startedAtRef.current === null) return;
      setState((s) => ({ ...s, elapsedMs: Date.now() - startedAtRef.current! }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.phase]);

  const applyEvent = (event: ProgressEvent) => {
    setState((prev) => {
      switch (event.stage) {
        case "extract": {
          if (event.status === "error") {
            return { ...prev, phase: "fatal", fatalError: `Couldn't read claims from your text: ${event.error}` };
          }
          const claimsToProcess = event.data.claims.slice(0, 2);
          return {
            ...prev,
            phase: "processing",
            totalClaimsFound: event.data.claims.length,
            claims: claimsToProcess.map((c) => emptyClaim(c.text, c.originalContext)),
          };
        }
        case "trace_source": {
          const claims = [...prev.claims];
          if (!claims[event.claimIndex]) return prev;
          claims[event.claimIndex] = {
            ...claims[event.claimIndex],
            traceSource: event.status === "done" ? { status: "done", data: event.data } : { status: "error", error: event.error },
          };
          return { ...prev, claims };
        }
        case "retrieve_evidence": {
          const claims = [...prev.claims];
          if (!claims[event.claimIndex]) return prev;
          claims[event.claimIndex] = {
            ...claims[event.claimIndex],
            retrieveEvidence:
              event.status === "done" ? { status: "done", data: event.data.length } : { status: "error", error: event.error },
          };
          return { ...prev, claims };
        }
        case "assess": {
          const claims = [...prev.claims];
          if (!claims[event.claimIndex]) return prev;
          claims[event.claimIndex] = {
            ...claims[event.claimIndex],
            assess: event.status === "done" ? { status: "done", data: event.data } : { status: "error", error: event.error },
          };
          maybeCountGuess(claims, event.claimIndex);
          return { ...prev, claims };
        }
        case "complete": {
          return {
            ...prev,
            phase: "complete",
            totalClaimsFound: event.data.totalClaimsFound,
            capNotice: event.data.capNotice,
          };
        }
        case "fatal": {
          return { ...prev, phase: "fatal", fatalError: event.error };
        }
        default:
          return prev;
      }
    });
  };

  const handleInvestigate = async (text: string) => {
    startedAtRef.current = Date.now();
    runIdRef.current += 1;
    setState({ ...IDLE_STATE, phase: "extracting" });

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, language: "en" }),
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        setState((s) => ({ ...s, phase: "fatal", fatalError: body.error || "Request failed" }));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sawComplete = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event: ProgressEvent = JSON.parse(line);
          if (event.stage === "complete") sawComplete = true;
          applyEvent(event);
        }
      }

      if (buffer.trim()) {
        const event: ProgressEvent = JSON.parse(buffer);
        if (event.stage === "complete") sawComplete = true;
        applyEvent(event);
      }

      if (!sawComplete) {
        setState((s) => (s.phase === "fatal" ? s : { ...s, phase: "fatal", fatalError: s.fatalError || "Connection closed before the investigation finished." }));
      }
    } catch (e) {
      setState((s) => ({ ...s, phase: "fatal", fatalError: e instanceof Error ? e.message : "Something went wrong." }));
    }
  };

  const handleGuess = (claimIndex: number, guess: Guess | "skipped") => {
    setState((prev) => {
      const claims = [...prev.claims];
      if (!claims[claimIndex]) return prev;
      claims[claimIndex] = { ...claims[claimIndex], guess };
      maybeCountGuess(claims, claimIndex);
      return { ...prev, claims };
    });
  };

  const loading = state.phase === "extracting" || state.phase === "processing";

  return (
    <>
      <Hero onInvestigate={handleInvestigate} loading={loading} />
      <InvestigationLive state={state} onGuess={handleGuess} sessionTally={sessionTally} />
    </>
  );
}
