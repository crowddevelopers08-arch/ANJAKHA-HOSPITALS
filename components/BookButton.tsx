"use client";

import type { ReactNode } from "react";
import { SELECT_TREATMENT_EVENT, type TreatmentOption } from "@/lib/site";

type BookButtonProps = {
  treatment?: TreatmentOption;
  className?: string;
  children: ReactNode;
};

/** Scrolls to the booking form and, when given, preselects a treatment in it. */
export default function BookButton({ treatment, className = "", children }: BookButtonProps) {
  return (
    <a
      href="#book"
      className={className}
      onClick={() => {
        if (treatment) window.dispatchEvent(new CustomEvent(SELECT_TREATMENT_EVENT, { detail: treatment }));
      }}
    >
      {children}
    </a>
  );
}
