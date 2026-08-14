"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { LAB_CLAIMS, type LabClaim } from "@/lib/lab/claims";
import LevelProgress from "./LevelProgress";
import ClaimCard from "./ClaimCard";
import InvestigationForm from "./InvestigationForm";
import MasteryScreen from "./MasteryScreen";
import { X, Check } from "lucide-react";

type Feedback = {
  success: boolean;
  explanation: string;
  skillPracticed: string;
};

export default function LabGame() {
  const [level, setLevel] = useState(1);
  const [queue, setQueue] = useState<LabClaim[]>([]);
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  const currentClaim = queue[currentClaimIndex];

  // Initialize level queue
  useEffect(() => {
    if (level > 5) return;
    const levelClaims = LAB_CLAIMS.filter((c) => c.level === level);
    // Shuffle the claims for this level
    const shuffled = [...levelClaims].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentClaimIndex(0);
  }, [level]);

  const handleSubmit = async (source: string, v: string) => {
    if (!currentClaim) return;
    setLoading(true);
    try {
      const res = await fetch("/api/lab/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId: currentClaim.id,
          source: source,
          userVerdict: v,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");

      const data = await res.json();
      setFeedback(data);

      if (data.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F6E56', '#D65A31', '#F4F1DE'] // teal, coral, cream
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!feedback) return;
    
    if (feedback.success) {
      setLevel((l) => l + 1);
    } else {
      // If failed, just move to next claim in queue
      setCurrentClaimIndex((i) => i + 1);
    }
    
    setFeedback(null);
  };

  if (level > 5) {
    return <MasteryScreen />;
  }

  if (!currentClaim) {
    return <div className="flex-1 flex items-center justify-center">Loading Lab...</div>;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-5 py-12 sm:px-8">
      <LevelProgress level={level} skill={currentClaim.skill} />
      
      {!feedback ? (
        <>
          <ClaimCard claim={currentClaim} />
          <InvestigationForm onSubmit={handleSubmit} loading={loading} key={currentClaim.id} />
        </>
      ) : (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl border-2 border-ink/10 p-8 text-center shadow-sm">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6 ${feedback.success ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'}`}>
            {feedback.success ? <Check size={32} /> : <X size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {feedback.success ? "Great Investigation!" : "Not Quite Supported"}
          </h2>
          <p className="text-lg text-ink/80 leading-relaxed mb-6">
            {feedback.explanation}
          </p>
          {feedback.success && (
            <p className="text-sm font-semibold text-teal mb-8 uppercase tracking-wide">
              Skill Practiced: {feedback.skillPracticed}
            </p>
          )}
          <button
            onClick={handleNext}
            className="rounded-full bg-ink px-8 py-3 text-sm font-semibold text-cream transition-all cursor-pointer hover:bg-ink/80 hover:scale-[1.02] active:scale-[0.98]"
          >
            {feedback.success ? "Next Level" : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
