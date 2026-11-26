/**
 * Server-side senders shared by /api/lead and /api/feedback.
 *
 *   Google Sheets — Apps Script web app in google-apps-script/Code.gs
 *                   env: GOOGLE_SHEETS_WEBHOOK_URL (+ optional GOOGLE_SHEETS_SECRET)
 *   TeleCRM       — env: TELECRM_API_URL + TELECRM_API_KEY
 */

const SHEETS_TIMEOUT_MS = 20000; // Apps Script can take a few seconds on a cold start
const TELECRM_TIMEOUT_MS = 15000;

/** X-Client-ID sent to TeleCRM. */
export const TELECRM_CLIENT_ID = "anjakha-hospitals-website";

export const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

/** 10-digit Indian mobile: strips spaces, +91 and a leading 0-free "91" prefix. */
export function normalisePhone(raw: string) {
  return raw.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
}

export const istNow = () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

export const sheetsConfigured = () => Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL);
export const crmConfigured = () => Boolean(process.env.TELECRM_API_URL && process.env.TELECRM_API_KEY);

export async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
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

/** POSTs a row to the Apps Script web app. The shared-secret token is added here. */
export async function postToSheet(payload: Record<string, unknown>) {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!endpoint) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not set");

  // Apps Script answers the POST with a 302 to googleusercontent.com; fetch follows it.
  const res = await fetchWithTimeout(
    endpoint,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: process.env.GOOGLE_SHEETS_SECRET || "", ...payload }),
      redirect: "follow",
    },
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

export type TeleCRMPayload = {
  fields: Record<string, string>;
  actions: { type: "SYSTEM_NOTE"; text: string }[];
};

export const note = (text: string) => ({ type: "SYSTEM_NOTE" as const, text });

/** Creates or updates (matched on phone) a TeleCRM lead. */
export async function postToTeleCRM(payload: TeleCRMPayload) {
  const endpoint = process.env.TELECRM_API_URL;
  const apiKey = process.env.TELECRM_API_KEY;
  if (!endpoint) throw new Error("TELECRM_API_URL is not set");
  if (!apiKey) throw new Error("TELECRM_API_KEY is not set");

  const res = await fetchWithTimeout(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Client-ID": TELECRM_CLIENT_ID,
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

type Outcome = "ok" | "failed" | "skipped";

/**
 * Sends to both destinations in parallel and reports each one.
 * `ok` is true when at least one configured destination stored the data
 * (or when neither is configured, so local development still works).
 */
export async function sendToBoth(
  label: string,
  sheet: () => Promise<unknown>,
  crm: () => Promise<unknown>,
  logContext: Record<string, unknown>
): Promise<{ ok: boolean; sheet: Outcome; crm: Outcome }> {
  const useSheet = sheetsConfigured();
  const useCrm = crmConfigured();

  if (!useSheet && !useCrm) {
    console.warn(`[${label}] No GOOGLE_SHEETS_WEBHOOK_URL / TELECRM_API_URL configured — only logged:`, logContext);
    return { ok: true, sheet: "skipped", crm: "skipped" };
  }

  const [sheetResult, crmResult] = await Promise.allSettled([
    useSheet ? sheet() : Promise.resolve(null),
    useCrm ? crm() : Promise.resolve(null),
  ]);

  const status = (configured: boolean, r: PromiseSettledResult<unknown>): Outcome =>
    !configured ? "skipped" : r.status === "fulfilled" ? "ok" : "failed";
  const s = status(useSheet, sheetResult);
  const c = status(useCrm, crmResult);

  if (sheetResult.status === "rejected") console.error(`[${label}][Google Sheets]`, sheetResult.reason?.message, logContext);
  if (crmResult.status === "rejected") console.error(`[${label}][TeleCRM]`, crmResult.reason?.message, logContext);

  return { ok: s === "ok" || c === "ok", sheet: s, crm: c };
}
