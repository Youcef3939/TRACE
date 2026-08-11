import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Learn", href: "/learn" },
      { label: "Investigate", href: "/investigate" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Contact", href: "mailto:hello@trace.org" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Image
              src="/logo/trace-wordmark.svg"
              alt="TRACE"
              width={130}
              height={38}
              className="h-8 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              Think. Research. Assess. Check. Explain. An AI media-literacy
              guide built for the UNESCO Youth Hackathon 2026.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink/65 transition-colors hover:text-teal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink/45">
            &copy; 2026 TRACE. Built for the UNESCO Youth Hackathon.
          </p>
          <p className="text-xs text-ink/45">
            Designed for critical thinkers, everywhere language is spoken.
          </p>
        </div>
      </div>
    </footer>
  );
}
