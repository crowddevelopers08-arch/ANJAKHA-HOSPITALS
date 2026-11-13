import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { DoctorIcon, GuideIcon, HeartHandIcon, PersonalIcon, RouteIcon, StethoscopeIcon } from "./Icons";
import { whyChoose } from "@/lib/content";

const icons = [DoctorIcon, PersonalIcon, StethoscopeIcon, HeartHandIcon, GuideIcon, RouteIcon];

export default function WhyKinesis() {
  return (
    <section id="why-anjakha" className="relative overflow-hidden bg-mist py-9 sm:py-16 lg:py-24">
      <div aria-hidden className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-lilac-200/40 blur-3xl" />
      <div aria-hidden className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-lilac-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Anjakha Hospitals?"
          title={
            <>
              Your Health Deserves{" "}
              <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,var(--color-lilac-300)_62%,var(--color-lilac-300)_92%,transparent_92%)] px-1">
                the Right Medical Attention
              </span>
            </>
          }
        />

        <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {whyChoose.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={item} delay={(i % 3) * 90}>
                <div className="group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-plum-950/[0.06] bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl hover:shadow-plum-950/15 sm:p-7">
                  {/* hover fill */}
                  <div aria-hidden className="absolute inset-0 bg-linear-to-br from-plum-800 to-plum-950 opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span aria-hidden className="absolute -bottom-5 right-3 hidden text-7xl xl:block font-extrabold leading-none text-plum-950/[0.05] transition group-hover:text-white/[0.06]">
                    0{i + 1}
                  </span>

                  <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-lilac-100 text-plum-800 ring-1 ring-lilac-200 transition duration-500 group-hover:bg-lilac-400 group-hover:text-plum-950 group-hover:ring-lilac-400">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="relative text-base font-bold leading-snug text-plum-950 transition duration-500 group-hover:text-white sm:text-lg">
                    {item}
                  </span>
                  <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-lilac-400 transition-all duration-500 group-hover:w-full" />
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
