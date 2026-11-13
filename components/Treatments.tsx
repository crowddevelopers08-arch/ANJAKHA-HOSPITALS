"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import BookButton from "./BookButton";
import { ArrowIcon, CheckIcon } from "./Icons";
import { treatments } from "@/lib/content";

/* Each panel gets its own shade so the stack reads as separate layers */
const shades = [
  "from-[#3d3d3d] to-[#242424]",
  "from-[#474747] to-[#282828]",
  "from-[#525252] to-[#2e2e2e]",
  "from-[#474747] to-[#242424]",
  "from-[#3d3d3d] to-[#282828]",
];

/* Where panels pin: just below the fixed header (72px on mobile, 80px on desktop). */
const stickyTop = (w: number) => (w < 1024 ? 84 : 96);
/* How much of each earlier panel stays visible above the next. */
const stepFor = (w: number) => (w < 640 ? 8 : 18);
/* Height of the fixed "Call Now / Book Consultation" bar shown below 768px. */
const bottomBarFor = (w: number) => (w < 768 ? 76 : 0);
const BOTTOM_GAP = 12; // px kept below a tall panel when it pins by its bottom edge

export default function Treatments() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topsRef = useRef<number[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    // Pin position for each panel. A panel that fits on screen pins under the header;
    // a panel taller than the screen pins by its bottom edge so none of it is ever hidden.
    const layout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - bottomBarFor(window.innerWidth);
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const ideal = stickyTop(vw) + i * stepFor(vw);
        const top = Math.min(ideal, vh - card.offsetHeight - BOTTOM_GAP);
        topsRef.current[i] = top;
        card.style.top = `${top}px`;
      });
    };

    // As a later panel slides over an earlier one, shrink and dim the earlier one.
    const update = () => {
      frame = 0;
      if (reduce) return;
      const cards = cardRefs.current;
      cards.forEach((card, i) => {
        if (!card) return;
        const inner = card.firstElementChild as HTMLElement;
        const next = cards[i + 1];
        if (!next) return;
        const h = card.offsetHeight;
        const stuckAt = Math.max(topsRef.current[i] ?? 0, 0);
        const covered = Math.min(h, window.innerHeight - bottomBarFor(window.innerWidth) - stuckAt);
        // 0 → next panel hasn't reached this one yet, 1 → next panel has fully covered its visible part
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - stuckAt) / covered));
        inner.style.transform = `scale(${1 - p * 0.06})`;
        inner.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      layout();
      onScroll();
    };

    layout();
    update();
    const ro = new ResizeObserver(onResize);
    cardRefs.current.forEach((c) => c && ro.observe(c));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="treatments" className="relative isolate overflow-clip bg-plum-950 py-9 sm:py-16 lg:py-20">
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-plum-700/50 blur-[140px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Our Specialised Treatments"
          title="Comprehensive Surgical Care Under One Roof"
          intro="Explore our specialised treatment options."
        />

        {/* Stacking panels */}
        <div className="mt-6 sm:mt-10">
          {treatments.map((t, i) => (
            <div
              key={t.slug}
              id={t.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="sticky mb-4 scroll-mt-24 sm:mb-10"
              style={{ top: 84 + i * 8, zIndex: i + 1 }}
            >
              <article
                className={`relative origin-top overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br ${shades[i]} shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] will-change-transform sm:rounded-[2.5rem]`}
              >
                {/* decorative rings */}
                <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10 sm:h-[26rem] sm:w-[26rem]" />
                <div aria-hidden className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10 sm:h-72 sm:w-72" />
                <div aria-hidden className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-lilac-500/15 blur-3xl" />

                <div className="relative grid items-center gap-3 p-4 min-[400px]:p-5 sm:gap-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 lg:p-10 xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-12 xl:p-12">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-extrabold leading-none tabular-nums text-transparent [-webkit-text-stroke:1.5px_rgba(253,185,49,0.7)] sm:text-7xl">
                        0{i + 1}
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lilac-300">{t.name}</p>
                    </div>
                    <h3 className="mt-2.5 text-lg font-bold leading-snug text-white min-[400px]:text-xl sm:mt-5 sm:leading-tight sm:text-4xl lg:text-[2.2rem] xl:text-[2.6rem]">{t.headline}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-lg">{t.description}</p>
                    <BookButton
                      treatment={t.option}
                      className="group mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-lilac-400 px-5 py-2.5 text-sm font-semibold text-plum-950 transition hover:bg-lilac-300 sm:mt-7 sm:px-6 sm:py-3.5"
                    >
                      Book Your Consultation
                      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </BookButton>
                  </div>

                  <div>
                    <ul className="space-y-2 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 backdrop-blur sm:space-y-3 sm:rounded-3xl sm:p-7">
                      {t.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lilac-400 text-plum-950 sm:h-6 sm:w-6">
                            <CheckIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </span>
                          <span className="text-sm leading-snug text-white/90 sm:text-base">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="relative z-10 mx-auto mt-2 flex max-w-4xl flex-col items-center gap-5 rounded-3xl border border-lilac-400/25 bg-linear-to-r from-plum-700/60 to-plum-600/30 p-6 text-center sm:mt-6 sm:p-8 md:flex-row md:text-left">
            <p className="flex-1 text-base leading-relaxed text-white/85 sm:text-lg">
              <span className="font-semibold text-white">Not Sure / Need Guidance?</span> A medical consultation and
              appropriate investigations will help determine the right treatment for your condition.
            </p>
            <BookButton
              treatment="Not Sure / Need Guidance"
              className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-plum-950 transition hover:bg-lilac-100"
            >
              Book Your Consultation
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </BookButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
