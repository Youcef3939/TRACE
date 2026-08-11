import { ScanSearch, Compass, Layers, Scale, MessageSquareText, GraduationCap } from "lucide-react";

export const STEPS = [
  {
    icon: ScanSearch,
    label: "Extract",
    description: "Pulls out the core claim from the text, link, or post you shared.",
    detail:
      "TRACE reads what you submitted and isolates the single, checkable claim buried inside it — stripping away tone, framing, and noise so there's one clear thing to investigate.",
    mockup: { kind: "claim", value: "\"Coffee cures cancer\"" },
  },
  {
    icon: Compass,
    label: "Trace source",
    description: "Follows the claim back to where it originated and who is repeating it.",
    detail:
      "You'll see exactly where the claim first appeared and how it spread — a blog post, a screenshot, a repost chain — so you know whether you're looking at a source or an echo.",
    mockup: { kind: "source", value: "Originated: unverified blog post (2019)" },
  },
  {
    icon: Layers,
    label: "Gather evidence",
    description: "Collects supporting and conflicting evidence from independent sources.",
    detail:
      "TRACE pulls evidence from multiple independent sources on both sides of the claim, so you're not just seeing whatever confirms the first thing you read.",
    mockup: { kind: "evidence", value: "3 sources found · 0 supporting · 3 conflicting" },
  },
  {
    icon: Scale,
    label: "Assess",
    description: "Weighs the evidence for reliability, consistency, and context.",
    detail:
      "Each piece of evidence gets weighed for how reliable and consistent it is, and whether it actually applies to the claim as stated — not just whether it sounds relevant.",
    mockup: { kind: "assess", value: "Reliability: low · Consistency: high" },
  },
  {
    icon: MessageSquareText,
    label: "Explain",
    description: "Lays out the reasoning in plain language, not just a verdict.",
    detail:
      "Instead of a single score, you'll see the reasoning chain in plain language — the actual steps that led to the conclusion, in an order you can follow and question.",
    mockup: { kind: "explain", value: "\"No peer-reviewed evidence found.\"" },
  },
  {
    icon: GraduationCap,
    label: "Learn",
    description: "Leaves you with the skills to investigate the next claim yourself.",
    detail:
      "Every investigation is also a small lesson — you'll start to notice the same patterns (missing sources, absolute language) the next time you see a claim on your own.",
    mockup: { kind: "learn", value: "Pattern flagged: missing source" },
  },
];
