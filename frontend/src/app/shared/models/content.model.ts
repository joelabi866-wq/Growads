export interface Platform {
  icon: string;      // path to logo asset, e.g. assets/icons/meta.svg
  label: string;
  colorClass: string; // css class controlling the badge background color
}

// "What We Do" is organised by campaign objective rather than by platform —
// the platforms that serve each objective are named inside `desc`.
export interface ServiceObjective {
  label: string;
  desc: string;
}

export interface WhyPoint {
  title: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  photo?: string;    // path to headshot asset; falls back to initials avatar if omitted
  videoUrl?: string; // when set, the card shows a play button linking to the video testimonial
}

export interface RoadmapPhase {
  label: string;
  title: string;
  items: string[];
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface ProofItem {
  bold: string;  // the emphasized fragment, e.g. "50+"
  rest: string;  // the remaining text, e.g. "Brands Scaled"
}
