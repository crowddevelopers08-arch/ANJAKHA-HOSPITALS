import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] pb-24 pt-10 text-white/70 md:pb-10 md:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-7 sm:gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block rounded-xl bg-white px-3 py-2">
              <Image quality={90} src="/images/logo.png" alt="Anjakha Hospital — Serving with compassion" width={1600} height={541} className="h-12 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm font-semibold leading-relaxed text-white">{site.services}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lilac-300">Phone</p>
            <ul className="mt-4 space-y-2 text-sm">
              {site.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="font-semibold text-white transition hover:text-lilac-300">{p.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lilac-300">Address</p>
            <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="mt-4 block text-sm leading-relaxed transition hover:text-lilac-300">
              {site.address}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t sm:mt-12 border-white/10 pt-6 text-xs sm:flex-row sm:items-start">
          <p className="max-w-2xl text-center sm:text-left">{site.disclaimer}</p>
          <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <Link href="/privacy-policy" className="transition hover:text-lilac-300">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
