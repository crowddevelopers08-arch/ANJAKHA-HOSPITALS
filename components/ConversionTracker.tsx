"use client";

import { useEffect } from "react";

export default function ConversionTracker({ treatment }: { treatment?: string }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_submitted", treatment: treatment || "" });
    if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: treatment || "" });
  }, [treatment]);

  return null;
}
