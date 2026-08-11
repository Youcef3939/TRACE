"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Multilingual", href: "#multilingual" },
  { label: "For educators", href: "#educators" },
  { label: "About", href: "#about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHero = () => {
    setOpen(false);
    document
      .getElementById("hero-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-sm backdrop-blur-sm border-b border-ink/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-center gap-2" aria-label="TRACE home">
          <Image
            src="/logo/trace-wordmark.svg"
            alt="TRACE"
            width={140}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-teal"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={scrollToHero}
            className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-teal-dark cursor-pointer"
          >
            Start investigating
          </button>
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
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base font-medium text-ink/80 hover:bg-ink/5 hover:text-teal"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={scrollToHero}
              className="mt-3 rounded-full bg-teal px-5 py-3 text-base font-semibold text-cream hover:bg-teal-dark cursor-pointer"
            >
              Start investigating
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
