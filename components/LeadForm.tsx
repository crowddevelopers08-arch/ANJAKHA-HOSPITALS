"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  SELECT_TREATMENT_EVENT,
  treatmentOptions,
  visitOptions,
  type TreatmentOption,
  type VisitOption,
} from "@/lib/site";
import { ArrowIcon, ShieldIcon } from "./Icons";

type Values = { name: string; phone: string; age: string; treatment: TreatmentOption | ""; visit: VisitOption | "" };
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

type LeadFormProps = {
  id?: string;
  source?: string;
};

const empty: Values = { name: "", phone: "", age: "", treatment: "", visit: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name";
  const digits = v.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Please enter a valid 10-digit mobile number";
  const age = Number(v.age);
  if (!/^\d{1,3}$/.test(v.age.trim()) || age < 1 || age > 120) e.age = "Please enter a valid age";
  if (!v.treatment) e.treatment = "Please select your treatment";
  if (!v.visit) e.visit = "Please select when you are planning to visit";
  return e;
}

export default function LeadForm({ id = "lead-form", source = "hero" }: LeadFormProps) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k: Field) => (e: ChangeEvent<HTMLInputElement> | string) => {
    const val = typeof e === "string" ? e : e.target.value;
    setValues((s) => ({ ...s, [k]: val }));
    setErrors((s) => (s[k] ? { ...s, [k]: undefined } : s));
  };

  // "Book Your Consultation" buttons on the treatment panels preselect that treatment.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const t = (e as CustomEvent<TreatmentOption>).detail;
      if (treatmentOptions.includes(t)) {
        setValues((s) => ({ ...s, treatment: t }));
        setErrors((s) => ({ ...s, treatment: undefined }));
      }
    };
    window.addEventListener(SELECT_TREATMENT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_TREATMENT_EVENT, onSelect);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    // Hidden spam-trap field — real visitors never see or fill it.
    const company = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    setLoading(true);
    setServerError("");
    try {
      const params = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      params.forEach((val, key) => {
        if (key.startsWith("utm_") || key === "gclid" || key === "fbclid") utm[key] = val;
      });
      // keepalive lets the request finish even after we navigate away, so the visitor
      // goes straight to the thank-you page instead of waiting on Sheets/TeleCRM.
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source, company, pageUrl: window.location.href, ...utm }),
        keepalive: true,
      }).catch(() => {});
      // Full page load (not client-side routing) so GTM / Meta Pixel register a fresh page view.
      window.location.assign(`/thank-you?treatment=${encodeURIComponent(values.treatment)}`);
    } catch {
      setServerError("Something went wrong. Please try again or call us directly.");
      setLoading(false);
    }
  }

  const field =
    "peer w-full rounded-xl border bg-white px-3.5 pb-1.5 pt-5 text-[15px] text-plum-950 outline-none transition placeholder:text-transparent focus:border-plum-600 focus:ring-4 focus:ring-lilac-200/60";
  const label =
    "pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-semibold uppercase tracking-wider text-mauve-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-plum-700";
  const err = (k: Field) => (errors[k] ? "border-red-400" : "border-plum-950/10");

  function choices<T extends string>(k: "treatment" | "visit", options: readonly T[]) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {options.map((c) => {
          const active = values[k] === c;
          return (
            <button
              type="button"
              key={c}
              onClick={() => set(k)(c)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                active
                  ? "border-plum-700 bg-plum-700 text-white shadow-lg shadow-plum-700/25"
                  : "border-plum-950/10 bg-white text-plum-950 hover:border-plum-600/40 hover:bg-lilac-50"
              }`}
            >
              <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-white" : "border-plum-950/25"}`}>
                {active && <span className="h-1 w-1 rounded-full bg-white" />}
              </span>
              {c}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="space-y-3">
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="relative">
        <input id={`${id}-name`} type="text" autoComplete="name" placeholder="Full Name" value={values.name} onChange={set("name")} className={`${field} ${err("name")}`} />
        <label htmlFor={`${id}-name`} className={label}>Full Name</label>
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_5.25rem] gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <div className="relative">
          <input id={`${id}-phone`} type="tel" inputMode="tel" autoComplete="tel" placeholder="Mobile Number" value={values.phone} onChange={set("phone")} className={`${field} ${err("phone")}`} />
          <label htmlFor={`${id}-phone`} className={label}>Mobile Number</label>
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div className="relative">
          <input id={`${id}-age`} type="number" inputMode="numeric" min={1} max={120} placeholder="Age" value={values.age} onChange={set("age")} className={`${field} ${err("age")}`} />
          <label htmlFor={`${id}-age`} className={label}>Age</label>
          {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-[13px] font-semibold text-plum-950">Select Your Treatment:</legend>
        {choices("treatment", treatmentOptions)}
        {errors.treatment && <p className="mt-1 text-xs text-red-500">{errors.treatment}</p>}
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-[13px] font-semibold text-plum-950">When Are You Planning to Visit?</legend>
        {choices("visit", visitOptions)}
        {errors.visit && <p className="mt-1 text-xs text-red-500">{errors.visit}</p>}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-plum-700 via-plum-600 to-plum-700 bg-[length:200%_100%] px-4 py-3 text-[15px] font-semibold sm:px-6 text-white shadow-xl shadow-plum-700/30 transition-all duration-500 hover:bg-right disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            Book Your Consultation
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      {serverError && <p className="text-center text-sm text-red-500">{serverError}</p>}

      <p className="flex items-start gap-1.5 text-[11px] leading-snug text-mauve-600">
        <ShieldIcon className="h-3.5 w-3.5 shrink-0 text-plum-600" />
        <span>
          Your information will be used by our hospital team to contact you regarding your enquiry.{" "}
          <a href="/privacy-policy" className="font-medium text-plum-700 underline underline-offset-2">Privacy Policy</a>
        </span>
      </p>
    </form>
  );
}
