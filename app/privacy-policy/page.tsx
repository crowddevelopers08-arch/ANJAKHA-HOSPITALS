import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Anjakha Hospitals",
  description: "How Anjakha Hospitals collects, uses and protects the information you share through this website.",
};

const LAST_UPDATED = "13 November 2026";

type Section = { id: string; title: string; body: ReactNode };

const sections: Section[] = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <p>
        Anjakha Hospitals (&quot;Anjakha&quot;, &quot;we&quot;, &quot;us&quot;) values the privacy and security of your
        personal information. This policy explains what information we collect through this website, how it is used and
        the choices available to you.
      </p>
    ),
  },
  {
    id: "collect",
    title: "Information We Collect",
    body: (
      <>
        <p>When you submit the &quot;Book Your Consultation&quot; form on this website, we collect:</p>
        <ul>
          <li>Your full name, mobile number and age</li>
          <li>
            The treatment you are interested in (circumcision, laparoscopy, piles, hernia, gallstones, or not sure / need
            guidance)
          </li>
          <li>When you are planning to visit</li>
          <li>
            Technical information such as the page address, browser type and the advertisement or campaign that brought
            you to this page
          </li>
        </ul>
        <p>
          The treatment you select may indicate a health concern. We treat this information as confidential and use it
          only to respond to your enquiry.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How We Use Your Information",
    body: (
      <ul>
        <li>To contact you by phone, SMS or WhatsApp regarding your enquiry</li>
        <li>To understand your requirements and assist with consultation scheduling</li>
        <li>To arrange and manage your consultation and care</li>
        <li>To measure and improve the performance of our website and advertising</li>
        <li>To comply with applicable legal and regulatory requirements</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Advertising Technologies",
    body: (
      <p>
        This website may use cookies and similar technologies, such as Google Tag Manager, Google Analytics, Google Ads and
        the Meta (Facebook / Instagram) pixel, to understand how visitors use the page and to measure the effectiveness of
        our advertisements. You can block or delete cookies through your browser settings and manage ad preferences in your
        Google and Meta account settings.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    body: (
      <p>
        We do not sell your personal information. Information may be shared only with service providers who help us operate
        this website and manage enquiries (for example hosting, spreadsheet, CRM or communication providers), who are
        required to keep it confidential, or where required by law.
      </p>
    ),
  },
  {
    id: "storage",
    title: "Data Storage & Security",
    body: (
      <p>
        We take reasonable technical and organisational measures to protect your information against unauthorised access,
        loss or misuse. Information is retained only for as long as required for the purpose for which it was collected or
        as required under applicable law.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your Rights",
    body: (
      <p>
        You may request access to, correction of or deletion of your personal information, and you may withdraw your
        consent for its processing at any time, in line with applicable Indian law, including the Digital Personal Data
        Protection Act, 2023. Withdrawing consent may affect our ability to respond to your enquiry or provide certain
        services. To make a request, contact us using the details below.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    body: (
      <>
        <p>For any privacy-related questions, requests or grievances, please contact us:</p>
        <ul>
          <li>
            Phone:{" "}
            {site.phones.map((p, i) => (
              <span key={p.href}>
                {i > 0 && " / "}
                <a href={p.href}>{p.label}</a>
              </span>
            ))}
          </li>
          <li>Address: {site.address}</li>
        </ul>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: <p>We may update this policy from time to time. Any changes will be posted on this page with a revised date.</p>,
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Header minimal />
      <main className="bg-mist pb-9 pt-20 sm:pb-20 sm:pt-32">
        <section className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-plum-700 to-plum-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
              <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
              <div aria-hidden className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-lilac-400/20 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-lilac-300">{site.name}</p>
              <h1 className="relative mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
              <p className="relative mt-4 text-sm text-white/60">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-6 grid max-w-7xl gap-8 px-4 sm:mt-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-plum-950/5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block rounded-xl px-3 py-2 text-sm font-medium text-mauve-600 transition hover:bg-lilac-50 hover:text-plum-700">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 rounded-4xl bg-white p-5 shadow-sm ring-1 ring-plum-950/5 sm:p-10 lg:p-12">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className={`scroll-mt-28 ${i > 0 ? "mt-8 border-t border-plum-950/5 pt-8 sm:mt-10 sm:pt-10" : ""}`}>
                <h2 className="flex items-center gap-3 text-lg font-bold text-plum-950 sm:text-2xl">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lilac-100 text-xs font-bold text-plum-700">{i + 1}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-3 break-words text-[15px] leading-relaxed text-mauve-600 [&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-2 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-lilac-400 [&_ul]:space-y-2">
                  {s.body}
                </div>
              </section>
            ))}
            <div className="mt-8 text-center sm:mt-10">
              <Link href="/" className="inline-flex rounded-full bg-plum-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-plum-600">
                Back to Home
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
