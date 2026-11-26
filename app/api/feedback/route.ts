export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { reviewFunnel } from "@/lib/site";
import { istNow, normalisePhone, note, postToSheet, postToTeleCRM, sendToBoth, str } from "@/lib/integrations";

/**
 * POST /api/feedback — the "Help Us Improve" form on /client-feedback.
 * Patients reach it after choosing 1–3 stars on /review
 * (4–5 stars go straight to the Google review page instead).
 *
 * Sent in parallel to Google Sheets ("Patient Feedback" tab) and TeleCRM.
 */

const FEEDBACK_ROUTE = {
  source: "GMB Review Funnel",
  sheetTab: "Patient Feedback",
  telecrmPageName: "anjakha-review-funnel",
  /** TeleCRM custom-field labels. TeleCRM ignores labels that don't exist on the enterprise. */
  ratingField: "Feedback Rating",
  feedbackField: "Patient Feedback",
};

type Feedback = {
  name: string;
  email: string;
  phone: string;
  suggestions: string;
  rating: number; // 1–5, or 0 when the page was opened without ?rating=
  branch: string;
  pageUrl: string;
  submittedAt: string;
};

const ratingLabel = (r: number) => (r ? `${r}/5` : "Not given");

function sendToGoogleSheet(f: Feedback) {
  return postToSheet({
    type: "feedback",
    sheetTab: FEEDBACK_ROUTE.sheetTab,
    timestamp: f.submittedAt,
    name: f.name,
    phone: f.phone,
    email: f.email,
    rating: f.rating || "",
    suggestions: f.suggestions,
    branch: f.branch,
    source: FEEDBACK_ROUTE.source,
    pageUrl: f.pageUrl,
  });
}

function sendToTeleCRM(f: Feedback) {
  return postToTeleCRM({
    // "Lead Status" is deliberately not sent: the patient may already be a lead in
    // TeleCRM, and a feedback note must not reset their status.
    fields: {
      name: f.name,
      phone: f.phone,
      email: f.email,
      "Lead Request Type": "feedback",
      [FEEDBACK_ROUTE.ratingField]: ratingLabel(f.rating),
      [FEEDBACK_ROUTE.feedbackField]: f.suggestions,
      Source: FEEDBACK_ROUTE.source,
      PageName: FEEDBACK_ROUTE.telecrmPageName,
      Country: "India",
    },
    actions: [
      note(`Lead Source: ${FEEDBACK_ROUTE.source} (${f.branch})`),
      note(`Submitted: ${f.submittedAt}`),
      note(`Rating: ${ratingLabel(f.rating)}`),
      note(`Patient Feedback: ${f.suggestions}`),
      note(`Name: ${f.name}`),
      note(`Phone: ${f.phone}`),
      note(`Email: ${f.email}`),
      note(`Page: ${f.pageUrl || "Not captured"}`),
    ],
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam trap (hidden "company" field): pretend success, store nothing.
  if (str(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const rating = Number(body.rating);
  const f: Feedback = {
    name: str(body.name, 100),
    email: str(body.email, 150).toLowerCase(),
    phone: normalisePhone(str(body.phone, 30)),
    suggestions: str(body.suggestions, 2000),
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0,
    branch: reviewFunnel.branch,
    pageUrl: str(body.pageUrl, 1000) || req.headers.get("referer") || "",
    submittedAt: istNow(),
  };

  if (f.name.length < 2) return bad("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return bad("Please enter a valid email address.");
  if (!/^[6-9]\d{9}$/.test(f.phone)) return bad("Please enter a valid 10-digit mobile number.");
  if (f.suggestions.length < 3) return bad("Please tell us a little about your experience.");

  const { ok, sheet, crm } = await sendToBoth(
    "feedback",
    () => sendToGoogleSheet(f),
    () => sendToTeleCRM(f),
    { phone: f.phone, rating: f.rating }
  );

  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "We couldn't submit that. Please try again.", sheet, crm },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, sheet, crm });
}

function bad(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 422 });
}
