export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { treatmentOptions, visitOptions } from "@/lib/site";
import { istNow, normalisePhone, note, postToSheet, postToTeleCRM, sendToBoth, str } from "@/lib/integrations";

/**
 * POST /api/lead — receives both "Book Your Consultation" forms (hero + final CTA).
 *
 * Each valid lead is sent, in parallel, to Google Sheets ("Anjakha Leads" tab) and
 * TeleCRM (see lib/integrations.ts). The visitor sees success if at least one
 * destination stored the lead; failures are logged server-side.
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

function sendToGoogleSheet(l: Lead) {
  return postToSheet({
    type: "lead",
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
  });
}

function sendToTeleCRM(l: Lead) {
  const t = l.tracking;
  return postToTeleCRM({
    fields: {
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
    },
    // Notes carry every detail, so nothing is lost even if a custom field doesn't exist in TeleCRM.
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
  });
}

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
    submittedAt: istNow(),
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

  const { ok, sheet, crm } = await sendToBoth(
    "lead",
    () => sendToGoogleSheet(lead),
    () => sendToTeleCRM(lead),
    { phone: lead.phone }
  );

  // Only fail the visitor's submission if nothing stored it.
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Could not save enquiry", sheet, crm }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sheet, crm });
}
