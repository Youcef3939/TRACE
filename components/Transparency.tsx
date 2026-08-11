import { Lock, Unlock, Check } from "lucide-react";

const REASONING_LINES = [
  "Source traced to an unverified blog post",
  "No peer-reviewed evidence found",
  "Contradicted by 3 independent studies",
  "Flagged as a myth by health authorities",
];

export default function Transparency() {
  return (
    <section id="about" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Why transparency wins
          </h2>
          <p className="mt-3 text-lg text-ink/65">
            A score tells you what to think. A reasoning chain lets you check
            it yourself.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-ink/10 bg-white p-8">
            <div className="flex items-center gap-2 text-ink/40">
              <Lock size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Black-box checker
              </span>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-xl bg-ink/[0.03] py-12">
              <span className="text-6xl font-bold text-ink/80">82%</span>
              <span className="text-sm font-medium text-ink/50">true</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink/55">
              A single number with no visible path to it. You either trust
              the score or you don&rsquo;t — there&rsquo;s nothing to
              check, question, or learn from.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-teal bg-white p-8">
            <div className="flex items-center gap-2 text-teal">
              <Unlock size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                TRACE&rsquo;s reasoning chain
              </span>
            </div>
            <div className="mt-8 space-y-3 rounded-xl bg-teal/[0.04] p-6">
              {REASONING_LINES.map((line, i) => (
                <div key={line} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-cream">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm text-ink/75">
                    <span className="mr-1 font-semibold text-teal">
                      {i + 1}.
                    </span>
                    {line}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink/55">
              Every step is visible and sourced, so you can verify the
              reasoning, disagree with a step, or dig deeper on your own.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
