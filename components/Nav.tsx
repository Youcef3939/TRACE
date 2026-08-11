"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-sm backdrop-blur-sm border-b border-ink/10"
          : "bg-cream/95 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="TRACE home">
          <Image
            src="/logo/trace-wordmark.svg"
            alt="TRACE"
            width={140}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors hover:text-teal ${
                  active ? "text-teal underline underline-offset-8" : "text-ink/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <Link
            href="/investigate"
            className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-teal-dark"
          >
            Start investigating
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-md p-2 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-cream px-5 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-2 py-3 text-base font-medium hover:bg-ink/5 hover:text-teal ${
                    active ? "text-teal" : "text-ink/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/investigate"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-teal px-5 py-3 text-center text-base font-semibold text-cream hover:bg-teal-dark"
            >
              Start investigating
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
