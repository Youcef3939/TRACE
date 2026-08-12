"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import InvestigationLive, { type ClaimRunState, type RunState } from "@/components/InvestigationLive";
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
  };
}

export default function InvestigateExperience() {
  const [state, setState] = useState<RunState>(IDLE_STATE);
  const startedAtRef = useRef<number | null>(null);

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

  const loading = state.phase === "extracting" || state.phase === "processing";

  return (
    <>
      <Hero onInvestigate={handleInvestigate} loading={loading} />
      <InvestigationLive state={state} />
    </>
  );
}
