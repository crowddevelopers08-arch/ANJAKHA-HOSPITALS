import Image from "next/image";
import LeadForm from "./LeadForm";
import { site } from "@/lib/site";
import { ArrowIcon, PhoneIcon } from "./Icons";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-plum-950 pb-8 pt-20 sm:pt-28 lg:pb-20 lg:pt-32">
      {/* Brand gradients */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-plum-950 via-plum-950/95 to-plum-700/80" />
      <div className="absolute -left-40 top-20 -z-10 h-[480px] w-[480px] rounded-full bg-plum-600/40 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-lilac-500/25 blur-[120px]" />
      <svg className="absolute inset-0 -z-10 h-full w-full opacity-[0.07]" aria-hidden>
        <defs>
          <pattern id="hex" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
            <path d="M28 0 56 16v32L28 64 0 48V16Zm0 64 28 16v32" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-10 lg:px-8 xl:grid-cols-[1.1fr_0.9fr] xl:gap-16">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-center text-[13px] font-semibold lg:text-left leading-snug text-lilac-300 backdrop-blur sm:rounded-full sm:text-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lilac-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lilac-400" />
            </span>
            {site.tagline}
          </p>

          <h1 className="mt-5 sm:mt-6 text-[1.95rem] font-extrabold leading-[1.1] tracking-tight text-white min-[375px]:text-[2.2rem] sm:text-5xl lg:text-[2.85rem] xl:text-[3.6rem]">
            Looking for the{" "}
            <span className="bg-linear-to-r from-lilac-300 via-lilac-400 to-lilac-200 bg-clip-text text-transparent">
              Right Treatment
            </span>{" "}
            for Your Health Concern?
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:mt-6 text-base leading-relaxed text-white/75 sm:text-lg lg:mx-0">
            Get expert consultation and treatment options for circumcision, laparoscopy, piles, hernia and gallstone
            conditions at Anjakha Hospitals.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/60 lg:mx-0">
            Our team focuses on appropriate diagnosis, personalised treatment planning and patient-centred surgical care.
          </p>

          <div className="mt-6 flex flex-col items-stretch gap-3 whitespace-nowrap sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <a
              href="#book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-lilac-400 px-7 py-4 text-base font-semibold text-plum-950 shadow-2xl shadow-lilac-500/30 transition hover:-translate-y-0.5 hover:bg-lilac-300"
            >
              Book Your Consultation
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={site.phones[0].href}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
            >
              <PhoneIcon className="h-5 w-5 text-lilac-300" />
              {site.phones[0].label}
            </a>
          </div>

          <div className="mt-10 hidden items-center gap-4 lg:flex">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-lilac-300 ring-2 ring-white/10">
              <PhoneIcon className="h-5 w-5" />
            </span>
            <p className="text-sm leading-snug text-white/65">
              Speak to our team and take the first step
              <br />
              <span className="font-semibold text-white">towards better health.</span>
            </p>
          </div>
        </div>

        {/* Form card */}
        <div id="book" className="relative scroll-mt-28">
          <div className="absolute -inset-3 -z-10 rounded-4xl bg-linear-to-br from-lilac-400/40 via-plum-600/20 to-transparent blur-2xl" />
          <div className="rounded-[1.75rem] bg-white p-4 shadow-2xl shadow-black/40 ring-1 ring-white/20 min-[375px]:p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-plum-700 to-plum-600 text-white shadow-lg shadow-plum-700/30">
                <Image quality={90} src="/images/icon.png" alt="" width={40} height={40} className="h-7 w-7 rounded-md bg-white p-0.5" />
              </span>
              <div>
                <h2 className="text-lg font-bold leading-tight text-plum-950 sm:text-xl">
                  Book Your Consultation at Anjakha Hospitals
                </h2>
                <p className="mt-1 text-[13px] leading-snug text-mauve-600">
                  Take the first step towards addressing your health concerns.
                </p>
              </div>
            </div>
            <LeadForm id="hero-form" source="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
