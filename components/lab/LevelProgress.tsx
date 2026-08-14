"use client";

import { CheckCircle2, Circle } from "lucide-react";

export default function LevelProgress({ level, skill }: { level: number, skill: string }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <span className="text-xs font-bold uppercase tracking-widest text-teal">Level {level} / 5</span>
      <h2 className="text-2xl font-bold text-ink">{skill}</h2>
    </div>
  );
}
