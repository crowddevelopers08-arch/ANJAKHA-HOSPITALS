"use client";

import { useState, type ReactNode } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { site } from "@/lib/site";
import { PlusIcon, PinIcon, PhoneIcon, ArrowIcon } from "./Icons";
import { faqs as faqContent } from "@/lib/content";

type FaqEntry = { q: string; a: ReactNode };

const faqs: FaqEntry[] = faqContent;

type ItemProps = { f: FaqEntry; open: boolean; onToggle: () => void; i: number };

function Item({ f, open, onToggle, i }: ItemProps) {
  return (
    <div className={`rounded-2xl border transition-colors duration-300 ${open ? "border-lilac-300 bg-white shadow-xl shadow-plum-700/10" : "border-plum-950/[0.07] bg-white/60 hover:bg-white"}`}>
      <h3>
        <button
          type="button"
          id={`faq-q-${i}`}
          aria-expanded={open}
          aria-controls={`faq-a-${i}`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
        >
          <span className="text-base font-semibold leading-snug text-plum-950 sm:text-[17px]">{f.q}</span>
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-300 ${open ? "rotate-45 bg-plum-700 text-white" : "bg-lilac-100 text-plum-700"}`}>
            <PlusIcon className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <div
        id={`faq-a-${i}`}
        role="region"
        aria-labelledby={`faq-q-${i}`}
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 text-[15px] leading-relaxed text-mauve-600 sm:px-6">{f.a}</div>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative bg-white py-9 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Frequently Asked Questions" />

        <div className="mt-6 sm:mt-10 lg:mt-12 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 40}>
                <Item f={f} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>

          {/* Location card */}
          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[1.75rem] bg-plum-950 text-white shadow-2xl shadow-plum-950/25">
              <div className="relative h-60 sm:h-72">
                <iframe
                  src={site.mapEmbed}
                  title="Anjakha Hospital on Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[35%]"
                  tabIndex={-1}
                />
                {/* Covers the map so any click on it goes to the booking form instead of Google Maps */}
                <a href="#book" aria-label="Book your consultation" className="absolute inset-0 z-10" />
              </div>
              <div className="space-y-5 p-6 sm:p-8">
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lilac-300"><PinIcon className="h-5 w-5" /></span>
                  <p className="text-[15px] leading-relaxed text-white/85">{site.address}</p>
                </div>
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lilac-300"><PhoneIcon className="h-5 w-5" /></span>
                  <div className="flex flex-col text-[15px] font-semibold">
                    {site.phones.map((p) => (
                      <a key={p.href} href={p.href} className="hover:text-lilac-300">{p.label}</a>
                    ))}
                  </div>
                </div>
                <a
                  href="#book"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-lilac-400 px-5 py-3.5 text-sm font-semibold text-plum-950 transition hover:bg-lilac-300"
                >
                  Book Your Consultation
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
