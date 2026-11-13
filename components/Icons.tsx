import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const ArrowIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/* "Why choose" icons */
export const DoctorIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
    <path d="M9 14.5v2.5a2 2 0 0 0 4 0M15.5 14.8V17" />
    <circle cx="15.5" cy="18" r="1" />
  </svg>
);

export const PersonalIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="m9 13 2 2 4-4M9 18h6" />
  </svg>
);

export const StethoscopeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 3H5a1 1 0 0 0-1 1v5a5 5 0 0 0 10 0V4a1 1 0 0 0-1-1h-1" />
    <path d="M9 14v1a6 6 0 0 0 12 0v-2" />
    <circle cx="21" cy="11" r="2" />
  </svg>
);

export const HeartHandIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 11.5 9.6 9.2a2.3 2.3 0 0 1 3.2-3.3l-.8-.8.8.8a2.3 2.3 0 0 1 3.2 3.3L12 13" />
    <path d="M2 16h3l4 3h6.5a1.5 1.5 0 0 0 0-3H12M5 21v-7h3l3 2" />
    <path d="m15.5 16 4.6-2.3a1.6 1.6 0 0 1 1.9 2.5L18 20" />
  </svg>
);

export const GuideIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h13" />
    <path d="M9 8h6M9 12h4" />
  </svg>
);

export const RouteIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="19" r="3" />
    <circle cx="18" cy="5" r="3" />
    <path d="M9 19h7.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H15" />
  </svg>
);

/* Treatment icons (48px artboard) */
const t = { ...base, viewBox: "0 0 48 48", strokeWidth: 2.4 };

export const CircumcisionIcon = (p: IconProps) => (
  <svg {...t} {...p}>
    <path d="M24 5 9 11v11c0 10 6.5 17.5 15 21 8.5-3.5 15-11 15-21V11L24 5Z" />
    <path d="M24 17v14M17 24h14" />
  </svg>
);

export const LaparoscopyIcon = (p: IconProps) => (
  <svg {...t} {...p}>
    <rect x="5" y="30" width="38" height="12" rx="6" />
    <path d="M14 30 22 8M34 30 28 12" />
    <circle cx="22" cy="6" r="2.5" />
    <path d="M26 11h4l-1 3h-2Z" />
    <circle cx="14" cy="36" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="34" cy="36" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const PilesIcon = (p: IconProps) => (
  <svg {...t} {...p}>
    <path d="M24 6s13 13.5 13 23a13 13 0 0 1-26 0C11 19.5 24 6 24 6Z" />
    <path d="M18 30a6 6 0 0 0 6 6" />
  </svg>
);

export const HerniaIcon = (p: IconProps) => (
  <svg {...t} {...p}>
    <path d="M12 5c-2 6-2 12 0 18s2 14 0 20M36 5c2 6 2 12 0 18s-2 14 0 20" />
    <path d="M24 30v4" />
    <circle cx="30" cy="31" r="5" />
    <path d="M18 14h12" />
  </svg>
);

export const GallstoneIcon = (p: IconProps) => (
  <svg {...t} {...p}>
    <path d="M30 6c4 0 7 3 7 8 0 10-6 26-15 27-6 .7-11-4-10-10 1-7 8-9 11-15 2-5 3-10 7-10Z" />
    <circle cx="22" cy="30" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="28" cy="25" r="2" fill="currentColor" stroke="none" />
    <circle cx="27" cy="32" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const GuidanceIcon = (p: IconProps) => (
  <svg {...t} {...p}>
    <circle cx="24" cy="24" r="18" />
    <path d="M18.5 19a5.5 5.5 0 1 1 7.5 5.1c-1.3.5-2 1.6-2 2.9v1.5" />
    <circle cx="24" cy="34.5" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);
