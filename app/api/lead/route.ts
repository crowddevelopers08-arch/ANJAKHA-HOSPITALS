export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { treatmentOptions, visitOptions } from "@/lib/site";

/**
 * POST /api/lead — receives both "Book Your Consultation" forms (hero + final CTA).
 *
 * Each valid lead is sent, in parallel, to:
 *   1. Google Sheets — via the Apps Script web app in google-apps-script/Code.gs
 *      env: GOOGLE_SHEETS_WEBHOOK_URL (+ optional GOOGLE_SHEETS_SECRET)
 *   2. TeleCRM       — env: TELECRM_API_URL + TELECRM_API_KEY
 *
 * The visitor sees success if at least one destination stored the lead; failures
 * are logged server-side. If neither destination is configured the lead is only
 * logged (useful for local development).
 */

const LEAD_ROUTE = {
  source: "Anjakha Hospitals LP",
  sheetTab: "Anjakha Leads",
  telecrmPageName: "anjakha-hospitals-website",
  /** TeleCRM custom-field labels. TeleCRM ignores labels that don't exist on the enterprise. */
  treatmentField: "Treatment Type",
  ageField: "Age",
  visitField: "Planning to Visit",
};

const SHEETS_TIMEOUT_MS = 20000; // Apps Script can take a few seconds on a cold start
const TELECRM_TIMEOUT_MS = 15000;

const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
type Tracking = Partial<Record<(typeof TRACKING_KEYS)[number], string>>;

type Lead = {
  name: string;
  phone: string;
  age: string;
  treatment: string;
  visit: string;
  form: string;
  pageUrl: string;
  submittedAt: string;
  tracking: Tracking;
};

const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

function normalisePhone(raw: string) {
  return raw.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw new Error(`Timed out after ${ms / 1000}s`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------------------------------------------------------- Google Sheets */

async function sendToGoogleSheet(l: Lead) {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!endpoint) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not set");

  const payload = {
    token: process.env.GOOGLE_SHEETS_SECRET || "",
    sheetTab: LEAD_ROUTE.sheetTab,
    timestamp: l.submittedAt,
    name: l.name,
    phone: l.phone,
    age: l.age,
    treatment: l.treatment,
    visit: l.visit,
    form: l.form,
    source: LEAD_ROUTE.source,
    pageUrl: l.pageUrl,
    ...l.tracking,
  };

  // Apps Script answers the POST with a 302 to googleusercontent.com; fetch follows it.
  const res = await fetchWithTimeout(
    endpoint,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), redirect: "follow" },
    SHEETS_TIMEOUT_MS
  );

  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);

  let json: { success?: boolean; error?: string; row?: number } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    // An HTML page here almost always means the web app isn't deployed with "Who has access: Anyone".
    throw new Error("Non-JSON response — check the Apps Script deployment access is set to 'Anyone'");
  }
  // Apps Script always answers 200, so errors come back in the body.
  if (json.error) throw new Error(json.error);
  if (!json.success) throw new Error(`Unexpected response: ${text.slice(0, 200)}`);
  return json;
}

/* ---------------------------------------------------------------- TeleCRM */

async function sendToTeleCRM(l: Lead) {
  const endpoint = process.env.TELECRM_API_URL;
  const apiKey = process.env.TELECRM_API_KEY;
  if (!endpoint) throw new Error("TELECRM_API_URL is not set");
  if (!apiKey) throw new Error("TELECRM_API_KEY is not set");

  const t = l.tracking;
  const fields: Record<string, string> = {
    name: l.name,
    phone: l.phone,
    "Lead Request Type": "consultation",
    "Lead Status": "new",
    [LEAD_ROUTE.treatmentField]: l.treatment,
    [LEAD_ROUTE.ageField]: l.age,
    [LEAD_ROUTE.visitField]: l.visit,
    Source: t.utm_source || LEAD_ROUTE.source,
    PageName: LEAD_ROUTE.telecrmPageName,
    Country: "India",
  };

  // Notes carry every detail, so nothing is lost even if a custom field doesn't exist in TeleCRM.
  const note = (text: string) => ({ type: "SYSTEM_NOTE", text });
  const payload = {
    fields,
    actions: [
      note(`Lead Source: ${LEAD_ROUTE.source}`),
      note(`Submitted: ${l.submittedAt}`),
      note(`Name: ${l.name}`),
      note(`Phone: ${l.phone}`),
      note(`Age: ${l.age}`),
      note(`Treatment: ${l.treatment}`),
      note(`Planning to Visit: ${l.visit}`),
      note(`Form: ${l.form}`),
      note(`Landing Page: ${l.pageUrl || "Not captured"}`),
      note(
        `UTM: source=${t.utm_source || "-"}, medium=${t.utm_medium || "-"}, campaign=${t.utm_campaign || "-"}, term=${t.utm_term || "-"}, content=${t.utm_content || "-"}`
      ),
      ...(t.gclid ? [note(`GCLID: ${t.gclid}`)] : []),
      ...(t.fbclid ? [note(`FBCLID: ${t.fbclid}`)] : []),
      note("Consent Given: Yes"),
    ],
  };

  const res = await fetchWithTimeout(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Client-ID": LEAD_ROUTE.telecrmPageName,
      },
      body: JSON.stringify(payload),
    },
    TELECRM_TIMEOUT_MS
  );

  if (res.status === 204) return { status: "success" };

  const text = await res.text();
  if (/^\s*<(!DOCTYPE|html)/i.test(text)) throw new Error(`HTML response (HTTP ${res.status}) — check TELECRM_API_URL`);

  let json: { message?: string } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json;
}

/* ---------------------------------------------------------------- Handler */

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Spam trap: the hidden "company" field is invisible to people, so only bots fill it.
  // Pretend success so they don't retry, but store nothing.
  if (str(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const tracking: Tracking = {};
  for (const key of TRACKING_KEYS) {
    const v = str(body[key], 300);
    if (v) tracking[key] = v;
  }

  const lead: Lead = {
    name: str(body.name, 100),
    phone: normalisePhone(str(body.phone, 30)),
    age: str(body.age, 3),
    treatment: str(body.treatment, 60),
    visit: str(body.visit, 40),
    form: str(body.source, 50) || "lead-form",
    pageUrl: str(body.pageUrl, 1000) || req.headers.get("referer") || "",
    submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    tracking,
  };

  const age = Number(lead.age);
  const errors: string[] = [];
  if (lead.name.length < 2) errors.push("name");
  if (!/^[6-9]\d{9}$/.test(lead.phone)) errors.push("phone");
  if (!/^\d{1,3}$/.test(lead.age) || age < 1 || age > 120) errors.push("age");
  if (!(treatmentOptions as readonly string[]).includes(lead.treatment)) errors.push("treatment");
  if (!(visitOptions as readonly string[]).includes(lead.visit)) errors.push("visit");
  if (errors.length) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields", fields: errors }, { status: 422 });
  }

  const sheetsConfigured = Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL);
  const crmConfigured = Boolean(process.env.TELECRM_API_URL && process.env.TELECRM_API_KEY);

  if (!sheetsConfigured && !crmConfigured) {
    console.warn("[lead] No GOOGLE_SHEETS_WEBHOOK_URL / TELECRM_API_URL configured — lead only logged:", lead);
    return NextResponse.json({ ok: true, sheet: "skipped", crm: "skipped" });
  }

  const [sheetResult, crmResult] = await Promise.allSettled([
    sheetsConfigured ? sendToGoogleSheet(lead) : Promise.resolve(null),
    crmConfigured ? sendToTeleCRM(lead) : Promise.resolve(null),
  ]);

  const status = (configured: boolean, r: PromiseSettledResult<unknown>) =>
    !configured ? "skipped" : r.status === "fulfilled" ? "ok" : "failed";
  const sheet = status(sheetsConfigured, sheetResult);
  const crm = status(crmConfigured, crmResult);

  if (sheetResult.status === "rejected") console.error("[lead][Google Sheets]", sheetResult.reason?.message, { phone: lead.phone });
  if (crmResult.status === "rejected") console.error("[lead][TeleCRM]", crmResult.reason?.message, { phone: lead.phone });

  // Only fail the visitor's submission if nothing stored it.
  if (sheet !== "ok" && crm !== "ok") {
    return NextResponse.json({ ok: false, error: "Could not save enquiry", sheet, crm }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sheet, crm });
}
