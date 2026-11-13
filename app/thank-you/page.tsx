import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConversionTracker from "@/components/ConversionTracker";
import { site } from "@/lib/site";
import { steps } from "@/lib/content";
import { CheckIcon, PhoneIcon, PinIcon, ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Thank You | Anjakha Hospitals",
  robots: { index: false, follow: false },
};

type ThankYouProps = { searchParams: Promise<{ treatment?: string | string[] }> };

export default async function ThankYou({ searchParams }: ThankYouProps) {
  const raw = (await searchParams).treatment;
  const treatment = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 40) ?? "";
  const next = steps.slice(1, 4);

  return (
    <>
      <Header minimal />
      <ConversionTracker treatment={treatment} />
      <main className="relative isolate overflow-hidden bg-mist pb-9 pt-20 sm:pb-20 sm:pt-32 lg:pb-28">
        <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-lilac-200/70 blur-[110px]" />

        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-plum-600/30" />
            <span className="relative grid h-24 w-24 place-items-center rounded-full bg-linear-to-br from-plum-600 to-plum-950 text-white shadow-2xl shadow-plum-700/40">
              <CheckIcon className="h-11 w-11" />
            </span>
          </div>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-plum-950 sm:text-5xl">Thank You!</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mauve-600">
            We&apos;ve received your enquiry{treatment ? <> for <span className="font-semibold text-plum-700">{treatment}</span></> : null}.
            Our team will contact you to assist with scheduling.
          </p>
        </div>

        <div className="mx-auto mt-6 sm:mt-10 lg:mt-12 max-w-5xl px-4 sm:px-6">
          <ol className="grid gap-4 md:grid-cols-3">
            {next.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl bg-white p-7 shadow-xl shadow-plum-950/5 ring-1 ring-plum-950/5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-lilac-100 text-sm font-bold text-plum-700">{i + 2}</span>
                <h2 className="mt-5 text-lg font-bold text-plum-950">{s.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-mauve-600">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 space-y-5 rounded-[1.75rem] bg-plum-950 p-7 text-white shadow-2xl shadow-plum-950/20 sm:p-9">
            <div className="flex gap-4">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-lilac-300" />
              <div className="flex flex-col font-semibold">
                {site.phones.map((p) => (
                  <a key={p.href} href={p.href} className="hover:text-lilac-300">{p.label}</a>
                ))}
              </div>
            </div>
            <div className="flex gap-4 text-sm leading-relaxed text-white/80">
              <PinIcon className="h-5 w-5 shrink-0 text-lilac-300" />
              <p>{site.address}</p>
            </div>
            <Link href="/" className="group inline-flex items-center gap-2 rounded-full bg-lilac-400 px-6 py-3 text-sm font-semibold text-plum-950 transition hover:bg-lilac-300">
              Back to Home
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
