export type Phone = { label: string; href: string };

export const site = {
  name: "Anjakha Hospitals",
  tagline: "Advanced Surgical Care. Personalised Treatment. Trusted Medical Support.",
  services: "Surgical Consultation | Diagnosis | Treatment | Patient Care",
  phones: [{ label: "+91 96001 45762", href: "tel:+919600145762" }] as Phone[],
  address:
    "Anjakha Hospital, 23, Medavakkam Main Rd, near Ganesh Nagar, Ganesh Nagar, Iyappa Nagar, Madipakkam, Moovarasampettai, Tamil Nadu 600091",
  mapEmbed:
    "https://www.google.com/maps?q=Anjakha+Hospital,+23+Medavakkam+Main+Rd,+Madipakkam,+Tamil+Nadu+600091&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Anjakha+Hospital+23+Medavakkam+Main+Rd+Madipakkam+Tamil+Nadu+600091",
  disclaimer:
    "Treatment recommendations are subject to medical evaluation. Surgical outcomes and recovery periods vary between individuals.",
};

/**
 * GMB review funnel: /review → 4–5★ to Google, 1–3★ to /client-feedback.
 * googleReviewUrl is the Business Profile "Ask for reviews" link; NEXT_PUBLIC_GOOGLE_REVIEW_URL overrides it.
 */
export const reviewFunnel = {
  branch: "Madipakkam",
  reviewPath: "/review",
  feedbackPath: "/client-feedback",
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://g.page/r/CRSiK1605nQiEBM/review",
  /** Ratings at or above this go to Google; below go to the private feedback form. */
  googleMinRating: 4,
};

export const treatmentOptions = [
  "Circumcision",
  "Laparoscopy",
  "Piles",
  "Hernia",
  "Gallstones",
  "Not Sure / Need Guidance",
] as const;
export type TreatmentOption = (typeof treatmentOptions)[number];

export const visitOptions = ["Immediately", "Within 7 Days", "Within 15 Days", "Just Exploring"] as const;
export type VisitOption = (typeof visitOptions)[number];

/** Fired by "Book Your Consultation" buttons that should preselect a treatment in the forms. */
export const SELECT_TREATMENT_EVENT = "anjakha:select-treatment";
