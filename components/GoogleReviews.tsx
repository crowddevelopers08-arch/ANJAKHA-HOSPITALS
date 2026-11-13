"use client";

import { useEffect, useRef, useState } from "react";
import { Roboto } from "next/font/google";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { googleReviews, type GoogleReview } from "@/lib/content";
import { site } from "@/lib/site";

/** Google's own UI font, so the cards read like a real Google Maps review. */
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const AUTOPLAY_MS = 4000; // time each card stays before sliding
const RESUME_AFTER_MS = 6000; // pause after the visitor swipes or clicks an arrow

/** Google's default avatar colours for accounts without a profile photo. */
const AVATAR_COLORS = ["#c2185b", "#5e35b1", "#00796b", "#ef6c00", "#1e88e5", "#6d4c41", "#43a047", "#d81b60", "#3949ab"];

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z" />
    </svg>
  );
}

function Stars({ rating, className = "h-3.5 w-3.5" }: { rating: number; className?: string }) {
  return (
    <span className="flex items-center gap-px" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            fill={n <= rating ? "#fbbc04" : "#dadce0"}
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({
  review,
  color,
  onExpandChange,
}: {
  review: GoogleReview;
  color: string;
  onExpandChange: (expanded: boolean) => void;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => onExpandChange(expanded), [expanded, onExpandChange]);

  // Only show "More" when the text is actually cut off at the current width.
  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [expanded]);

  return (
    <article className="flex w-[85vw] max-w-[360px] shrink-0 snap-start flex-col rounded-lg border border-[#dadce0] bg-white p-4 text-[#202124] sm:w-[340px]">
      <header className="flex items-start gap-3">
        <span className="relative shrink-0">
          <span
            className="grid h-10 w-10 place-items-center rounded-full text-lg font-medium text-white"
            style={{ backgroundColor: color }}
            aria-hidden
          >
            {review.author.trim().charAt(0).toUpperCase()}
          </span>
          {review.localGuide && (
            <span
              className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#e8710a] ring-2 ring-white"
              title="Local Guide"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="#fff">
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-medium leading-5">{review.author}</h3>
          <p className="truncate text-xs leading-4 text-[#70757a]">{review.meta}</p>
        </div>
        <GoogleG className="mt-0.5 h-5 w-5 shrink-0" />
      </header>

      <div className="mt-3 flex items-center gap-2">
        <Stars rating={review.rating} />
        <span className="text-xs text-[#70757a]">{review.when}</span>
      </div>

      <p
        ref={textRef}
        className={`mt-2 whitespace-pre-line text-sm leading-5 ${expanded ? "" : "line-clamp-6"}`}
      >
        {review.text}
      </p>
      {(clamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 self-start text-sm font-medium text-[#1a73e8] hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Less" : "More"}
        </button>
      )}

      <div className="mt-auto flex items-center gap-5 pt-4 text-[#70757a]">
        <span className="inline-flex items-center gap-1.5 text-xs">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 10v11M7 10l4-8a2.5 2.5 0 0 1 2.5 2.5V9h5.6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 17.7 21H7M7 10H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
          </svg>
          Like
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          Share
        </span>
      </div>
    </article>
  );
}

export default function GoogleReviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 340) + 16), behavior: "smooth" });
  };

  /* ---- Auto carousel ----
     Advances one card every AUTOPLAY_MS and loops back to the first card at the end.
     Pauses while the visitor hovers, touches, focuses inside the carousel or has a review expanded,
     for a while after any manual scroll/arrow click, and whenever the section is off-screen. */
  const hovering = useRef(false);
  const focused = useRef(false);
  const inView = useRef(false);
  const lastInteraction = useRef(0);
  const expandedCards = useRef(new Set<number>());
  const expandHandlers = useRef<((v: boolean) => void)[]>([]);

  const onExpandChange = (i: number) =>
    (expandHandlers.current[i] ??= (v: boolean) => {
      if (v) expandedCards.current.add(i);
      else expandedCards.current.delete(i);
    });

  const interact = () => {
    lastInteraction.current = Date.now();
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);

    const timer = setInterval(() => {
      const idle = Date.now() - lastInteraction.current > RESUME_AFTER_MS;
      if (!inView.current || hovering.current || focused.current || expandedCards.current.size || !idle || document.hidden) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) el.scrollTo({ left: 0, behavior: "smooth" });
      else scroll(1);
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, []);

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => {
        interact();
        scroll(dir);
      }}
      disabled={disabled}
      aria-label={dir === 1 ? "Next reviews" : "Previous reviews"}
      className="grid h-10 w-10 place-items-center rounded-full border border-[#dadce0] bg-white text-[#3c4043] shadow-sm transition hover:bg-[#f8f9fa] disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === 1 ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
      </svg>
    </button>
  );

  return (
    <section id="reviews" className="bg-white py-9 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Patient Reviews" title="What Our Patients Say" />

        <Reveal className={`${roboto.className} mt-6 sm:mt-10`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dadce0] pb-4">
            <div className="flex items-center gap-3">
              <GoogleG className="h-8 w-8" />
              <div>
                <p className="text-lg font-medium leading-6 text-[#202124]">Google Reviews</p>
                <p className="text-sm text-[#70757a]">Anjakha Hospital, Madipakkam</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={site.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#dadce0] px-4 py-2 text-sm font-medium text-[#1a73e8] transition hover:bg-[#f8f9fa]"
              >
                See all reviews
              </a>
              <div className="hidden gap-2 sm:flex">
                {arrow(-1, edges.start)}
                {arrow(1, edges.end)}
              </div>
            </div>
          </div>

          <div
            ref={trackRef}
            onMouseEnter={() => (hovering.current = true)}
            onMouseLeave={() => (hovering.current = false)}
            onTouchStart={interact}
            onTouchEnd={interact}
            onWheel={interact}
            onFocus={() => (focused.current = true)}
            onBlur={() => (focused.current = false)}
            aria-roledescription="carousel"
            aria-label="Google reviews"
            className="-mx-4 mt-5 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {googleReviews.map((r, i) => (
              <ReviewCard
                key={r.author}
                review={r}
                color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                onExpandChange={onExpandChange(i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
