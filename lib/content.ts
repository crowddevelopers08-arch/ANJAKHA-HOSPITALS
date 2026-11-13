import type { TreatmentOption } from "./site";

export type Treatment = {
  slug: string;
  name: string;
  option: TreatmentOption;
  icon: "circumcision" | "laparoscopy" | "piles" | "hernia" | "gallstone";
  headline: string;
  description: string;
  points: string[];
};

export const treatments: Treatment[] = [
  {
    slug: "circumcision",
    name: "Circumcision Treatment",
    option: "Circumcision",
    icon: "circumcision",
    headline: "Experiencing discomfort or considering circumcision?",
    description:
      "Circumcision is a surgical procedure involving the removal of the foreskin. It may be recommended for certain medical conditions.",
    points: [
      "Consultation and clinical assessment",
      "Treatment planning based on individual needs",
      "Surgical care and recovery guidance",
      "Post-procedure follow-up",
    ],
  },
  {
    slug: "laparoscopy",
    name: "Laparoscopic Surgery",
    option: "Laparoscopy",
    icon: "laparoscopy",
    headline: "Advanced Surgical Procedures With Minimally Invasive Techniques",
    description:
      "Laparoscopy is a minimally invasive surgical technique that uses small incisions and a camera to perform certain procedures.",
    points: [
      "Smaller surgical incisions",
      "Specialised surgical techniques",
      "Individualised treatment planning",
      "Post-operative care and guidance",
    ],
  },
  {
    slug: "piles",
    name: "Piles Treatment",
    option: "Piles",
    icon: "piles",
    headline: "Dealing With Piles, Discomfort or Bleeding?",
    description:
      "Piles (haemorrhoids) can cause discomfort, itching, swelling and bleeding. Early medical evaluation can help identify the appropriate treatment.",
    points: [
      "Medical evaluation and diagnosis",
      "Non-surgical treatment assessment",
      "Surgical treatment options when indicated",
      "Recovery and lifestyle guidance",
    ],
  },
  {
    slug: "hernia",
    name: "Hernia Treatment",
    option: "Hernia",
    icon: "hernia",
    headline: "Notice a Bulge or Experience Discomfort in Your Abdomen?",
    description:
      "A hernia occurs when an internal organ or tissue pushes through a weak area in the surrounding muscle or tissue.",
    points: [
      "Clinical examination and diagnosis",
      "Evaluation of hernia type and severity",
      "Surgical treatment options",
      "Post-surgical recovery guidance",
    ],
  },
  {
    slug: "gallstone",
    name: "Gallstone Treatment",
    option: "Gallstones",
    icon: "gallstone",
    headline: "Experiencing Repeated Abdominal Pain or Digestive Discomfort?",
    description:
      "Gallstones can cause abdominal pain and other digestive symptoms. A medical assessment can help determine whether treatment or surgery is required.",
    points: [
      "Clinical evaluation",
      "Diagnostic assessment",
      "Gallstone treatment planning",
      "Laparoscopic gallbladder surgery when appropriate",
    ],
  },
];

export const whyChoose = [
  "Experienced medical professionals",
  "Personalised treatment recommendations",
  "Surgical consultation and evaluation",
  "Patient-focused care",
  "Pre- and post-treatment guidance",
  "Support throughout your treatment journey",
];

export const steps = [
  { title: "Submit Your Enquiry", text: "Fill in your details and select the treatment you are interested in." },
  {
    title: "Get a Call From Our Team",
    text: "Our representative will contact you to understand your requirements and assist with consultation scheduling.",
  },
  { title: "Meet the Doctor", text: "Get your condition evaluated by the appropriate medical specialist." },
  {
    title: "Understand Your Treatment Options",
    text: "Receive a personalised treatment recommendation based on your medical assessment.",
  },
  { title: "Begin Your Treatment Journey", text: "Proceed with the recommended treatment and follow-up care." },
];

export const faqs = [
  {
    q: "How do I know which treatment is suitable for my condition?",
    a: "A medical consultation and appropriate investigations will help determine the right treatment for your condition.",
  },
  {
    q: "Is surgery necessary for all five conditions?",
    a: "No. Treatment depends on the patient's condition, severity and medical evaluation. Some conditions may be managed without surgery.",
  },
  {
    q: "Is laparoscopic surgery suitable for everyone?",
    a: "Not necessarily. Suitability depends on the patient's health, diagnosis and the procedure required.",
  },
  {
    q: "How long does recovery take after surgery?",
    a: "Recovery varies depending on the procedure, individual health and the surgeon's recommendations.",
  },
  {
    q: "How can I book a consultation at Anjakha Hospitals?",
    a: "Fill in the enquiry form on this page. Our team will contact you to assist with scheduling.",
  },
];
