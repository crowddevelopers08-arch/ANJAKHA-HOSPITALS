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

/** Google reviews, copied word-for-word from the hospital's Google Business Profile. */
export type GoogleReview = {
  author: string;
  /** Google's line under the name, e.g. "Local Guide · 6 reviews · 3 photos" */
  meta: string;
  localGuide?: boolean;
  rating: number;
  when: string;
  text: string;
};

export const googleReviews: GoogleReview[] = [
  {
    author: "ramya prabakaran",
    meta: "Local Guide · 6 reviews · 3 photos",
    localGuide: true,
    rating: 5,
    when: "a month ago",
    text: "Hospital Service Review\n\nI had a very good experience at Anjakha Hospital. Sudha, aged 69, was admitted yesterday for surgery, and we were very satisfied with the care and service provided by the hospital. The doctors and nursing staff were kind, attentive, and explained everything clearly. The staff responded quickly whenever we needed assistance and took good care of the patient throughout the process. The hospital environment was also clean and comfortable. Overall, we are happy with the treatment and the way the staff handled everything with care and respect. Thank you to the entire Anjakha Hospital team for providing such good sevice",
  },
  {
    author: "Arunprakash Natarajan",
    meta: "Local Guide · 34 reviews · 1 photo",
    localGuide: true,
    rating: 5,
    when: "a month ago",
    text: "Wonderful Doctors and Support staff starting from Reception till Nursed and Physician Assistants.\nSpecial mention on Dr Raj Anand sir and Dr Yogesh Sir( great Physicians and listeners to the patients). You will definitely feel comfortable when you consult them.",
  },
  {
    author: "Latha Vadivel",
    meta: "1 review",
    rating: 5,
    when: "2 months ago",
    text: "My father was recently admitted to Anjakha Hospital, and I am thoroughly impressed by their medical services. The doctors are highly professional, clear in their explanations, and do not suggest unnecessary tests. The nursing crew took excellent, round-the-clock care of him with a very warm and friendly attitude. The administrative process for admission and discharge was seamless. The environment is calm, clean, and well-maintained. Thank you to the entire team for the compassionate care.\"",
  },
  {
    author: "Arunkumar",
    meta: "Local Guide · 16 reviews · 7 photos",
    localGuide: true,
    rating: 5,
    when: "3 months ago",
    text: "We had a wonderful experience at Anjakha Hospital. The hospital was clean, well-maintained, and the entire staff was polite, caring, and supportive throughout our stay.\n\nA special thanks to Dr. M. Anusuya for her exceptional care and professionalism. She patiently addressed all our concerns, explained everything clearly, and provided excellent treatment with great compassion. Her confidence and reassuring approach made us feel comfortable during the entire process.\n\nWe are truly grateful to Dr. M. Anusuya and the entire Anjakha Hospital team for their outstanding service. We highly recommend this hospital to anyone looking for quality healthcare and compassionate medical care.",
  },
  {
    author: "sridevi Sri",
    meta: "1 review",
    rating: 5,
    when: "2 months ago",
    text: "Excellent experience at Anjakha Hospital, Medavakkam! Highly skilled doctors, caring nurses, and super clean facilities. They provide highly professional medical treatment with a compassionate, patient-first approach. Highly recommended for families living around the Madipakkam and Medavakkam areas",
  },
  {
    author: "Vignesh V (KIT_7_9989)",
    meta: "2 reviews",
    rating: 5,
    when: "a month ago",
    text: "On my first visit I rushed to hospital to consult Anusuya mam saying that I took wrong medicine given by a medical shop , she calmed us and consulted physician and confirmed me like that medicine will not harm the fetus. I got delivered on jan 8 baby girl my experience is awesome in this hospital I really had a good treatment from dr Anusuya mam she was very calm and doesn’t makes us to take unnecessary tests and scans. By GODs grace from day one visiting the hospital everything went smoothly and post operation care was that super nurses are very helpful often visited my room and helped me to sleep saying we will take care of the baby really as a new mom I was very happy for those words I literally slept trusting them! And comes aayammas also did good cleaning overall 10/10. Whenever I visit again this hospital i feel some positive vibe thank you",
  },
  {
    author: "Poovizhi S",
    meta: "1 review",
    rating: 5,
    when: "4 months ago",
    text: "Dr. Anushya is an excellent doctor who genuinely cares about her patients. We visited with our 2-year-old child and were very impressed with her professionalism, patience, and attention to detail. She answered every question we had and gave us confidence with her clear explanations. She never rushed the consultation and made sure we understood the treatment plan. The entire experience at the hospital was smooth, and the staff were supportive and friendly. Thank you for providing such compassionate and quality care. We highly recommend Dr. Anushya to anyone seeking the best medical care",
  },
  {
    author: "Srividya Hareesh",
    meta: "3 reviews",
    rating: 5,
    when: "4 months ago",
    text: "This is our 1st admission at this hospital. The journey of pregnancy at this hospital is really overwhelming. A special thanks to my doctor Dr. Deepika ma'am who was so supportive and made the journey look easy. Thank you for all the staffs, nursing staff for their caring attitude and professionalism. Thanks for the housekeeping staff for proper timely cleaning of rooms, premises to make all of us feel healthy.\n\nA quick suggestions regarding the rooms - Kindly ensure that the rooms are ventilated.",
  },
  {
    author: "Dazo Tj",
    meta: "5 reviews",
    rating: 5,
    when: "8 months ago",
    text: "My name is Tharini and I want to share my experience of anjakha hospital madipakam. I really want to thank doctor Deepika madam and doctor anushya madam for supporting me in my second baby delivery.. hospital is neat and clean and all staffs were kind and cooperative.. I highly recommend this hospital for all people who want smooth and peaceful experience...thanku all fr giving me this atmosphere...God bless all with health and peace .. thanku.",
  },
];
