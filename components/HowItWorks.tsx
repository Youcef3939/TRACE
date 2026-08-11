import { ScanSearch, Compass, Layers, Scale, MessageSquareText, GraduationCap } from "lucide-react";

const STEPS = [
  {
    icon: ScanSearch,
    label: "Extract",
    description: "Pulls out the core claim from the text, link, or post you shared.",
  },
  {
    icon: Compass,
    label: "Trace source",
    description: "Follows the claim back to where it originated and who is repeating it.",
  },
  {
    icon: Layers,
    label: "Gather evidence",
    description: "Collects supporting and conflicting evidence from independent sources.",
  },
  {
    icon: Scale,
    label: "Assess",
    description: "Weighs the evidence for reliability, consistency, and context.",
  },
  {
    icon: MessageSquareText,
    label: "Explain",
    description: "Lays out the reasoning in plain language, not just a verdict.",
  },
  {
    icon: GraduationCap,
    label: "Learn",
    description: "Leaves you with the skills to investigate the next claim yourself.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            How TRACE works
          </h2>
          <p className="mt-3 text-lg text-ink/65">
            Six steps that turn a claim into a transparent, checkable
            investigation.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-ink/15 lg:block"
            aria-hidden
          />
          {STEPS.map(({ icon: Icon, label, description }, i) => (
            <div key={label} className="relative flex flex-col items-start gap-3 lg:items-center lg:text-center">
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-teal bg-cream text-teal">
                <Icon size={24} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 lg:justify-center">
                  <span className="text-xs font-semibold text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold text-ink">{label}</h3>
                </div>
                <p className="mt-1 text-sm leading-snug text-ink/60">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
