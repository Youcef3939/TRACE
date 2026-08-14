"use client";

import { FileText, MessageSquare, Hash, Globe } from "lucide-react";
import type { LabClaim } from "@/lib/lab/claims";

export default function ClaimCard({ claim }: { claim: LabClaim }) {
  const Icon = claim.type === "tweet" ? Hash : claim.type === "facebook" ? MessageSquare : claim.type === "whatsapp" ? MessageSquare : Globe;
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-ink/10 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal/10 text-teal">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-bold text-ink leading-tight">{claim.author}</p>
          {claim.authorHandle && <p className="text-sm text-ink/50">{claim.authorHandle}</p>}
        </div>
      </div>
      <p className="text-lg text-ink/90 leading-relaxed italic border-l-4 border-coral/30 pl-4 py-1">
        "{claim.content}"
      </p>
    </div>
  );
}
