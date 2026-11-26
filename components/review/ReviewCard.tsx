import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { reviewFunnel, site } from "@/lib/site";

/** Dark maroon page with the centred cream card and logo lockup used by both funnel pages. */
export default function ReviewCard({ size, children }: { size: "review" | "feedback"; children: ReactNode }) {
  return (
    <main
      className="review flex min-h-screen flex-col items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "var(--r-brand-deep)" }}
    >
      <div
        className={`mx-auto w-full rounded-[28px] bg-[var(--r-paper)] shadow-[0_40px_80px_-40px_rgba(20,1,1,0.85)] ${
          size === "review" ? "max-w-[460px] px-5 py-8 sm:px-9 sm:py-10" : "my-6 max-w-[560px] p-5 sm:p-8"
        }`}
      >
        <div className="flex justify-center">
          <Link href="/" aria-label={site.name} className="flex shrink-0 items-center gap-2.5 no-underline">
            <Image
              src="/images/logo.png"
              alt=""
              width={128}
              height={128}
              quality={90}
              priority
              className="h-14 w-14 rounded-full bg-white ring-1 ring-[var(--r-line)] sm:h-16 sm:w-16"
            />
            <span className="leading-[1.15]">
              <span className="block text-[1.25rem] font-bold text-[var(--r-brand-deep)] sm:text-[1.45rem]">{site.name}</span>
              <span className="block text-[.72rem] font-semibold uppercase tracking-[.14em] text-[var(--r-brand)]">
                {reviewFunnel.branch}
              </span>
            </span>
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
