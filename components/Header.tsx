"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "./Icons";

export default function Header({ minimal = false }: { minimal?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || minimal;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-white/90 shadow-[0_8px_30px_-12px_rgba(42,2,2,0.25)] backdrop-blur-xl" : "bg-white/0"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          aria-label="Anjakha Hospitals — home"
          className={`shrink-0 rounded-full p-0.5 transition ${solid ? "" : "bg-white shadow-lg shadow-plum-950/10"}`}
        >
          <Image quality={90} src="/images/logo.png" alt="Anjakha Hospitals — Care, Compassion, New Beginnings" width={800} height={800} priority className="h-14 w-14 lg:h-17 lg:w-17" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.phones[0].href}
            className={`group hidden items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition md:flex ${
              solid ? "text-plum-950 hover:bg-lilac-50" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-lilac-400/20">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-lilac-400/40" />
              <PhoneIcon className={`relative h-4 w-4 ${solid ? "text-plum-700" : "text-lilac-300"}`} />
            </span>
            <span className="leading-tight">
              <span className={`block text-[11px] font-medium uppercase tracking-wider ${solid ? "text-mauve-600" : "text-white/60"}`}>
                Speak to Our Team
              </span>
              <span className="block text-sm font-bold">{site.phones[0].label}</span>
            </span>
          </a>

          {!minimal && (
            <a
              href="#book"
              className="hidden items-center rounded-full bg-lilac-400 px-5 py-2.5 text-sm font-semibold text-plum-950 shadow-lg shadow-lilac-500/30 transition hover:-translate-y-0.5 hover:bg-lilac-300 sm:inline-flex"
            >
              Book Your Consultation
            </a>
          )}
          <a
            href={site.phones[0].href}
            aria-label="Call Anjakha Hospitals"
            className="grid h-11 w-11 place-items-center rounded-full bg-lilac-400 text-plum-950 shadow-lg shadow-lilac-500/30 md:hidden"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
