import { site } from "@/lib/site";
import { PhoneIcon, ArrowIcon } from "./Icons";

export default function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-plum-950/10 bg-white/95 p-3 shadow-[0_-10px_30px_-12px_rgba(42,2,2,0.3)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={site.phones[0].href}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-plum-700/20 bg-lilac-50 py-3.5 text-[13px] font-semibold text-plum-700 min-[360px]:text-sm"
        >
          <PhoneIcon className="h-4 w-4" />
          Call Now
        </a>
        <a href="#book" className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-plum-700 px-2 py-3.5 text-[13px] font-semibold text-white shadow-lg shadow-plum-700/30 min-[360px]:gap-2 min-[360px]:text-sm">
          Book Consultation
          <ArrowIcon className="hidden h-4 w-4 min-[360px]:block" />
        </a>
      </div>
    </div>
  );
}
