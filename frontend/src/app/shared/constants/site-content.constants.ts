import { Platform, ServiceObjective, WhyPoint, Testimonial, RoadmapPhase, FaqEntry, ProofItem } from '../models';

export const FALLBACK_CHAT_CONFIG = {
  whatsapp: 'https://wa.me/919566211414',
  telegram: 'https://t.me/Thegrowads'
};

export const PLATFORMS: Platform[] = [
  { icon: 'assets/icons/meta.svg', label: 'Meta Ads', colorClass: 'bg-meta' },
  { icon: 'assets/icons/google.svg', label: 'Google Ads', colorClass: 'bg-google' },
  { icon: 'assets/icons/tiktok.svg', label: 'TikTok', colorClass: 'bg-tiktok' },
  { icon: 'assets/icons/snapchat.svg', label: 'Snapchat', colorClass: 'bg-snap' }
];

// The "What We Do" grid is objective-led, not platform-led.
export const SERVICE_OBJECTIVES: ServiceObjective[] = [
  {
    label: 'Lead Generation',
    desc: 'Capturing high-intent demand, mainly through Google and Meta.'
  },
  {
    label: 'Sales & Conversions',
    desc: 'Retargeting and Shopping campaigns built to close revenue.'
  },
  {
    label: 'App Installs & Sign-ups',
    desc: 'Fast, high-engagement growth via TikTok and Snapchat.'
  },
  {
    label: 'Brand Awareness & Reach',
    desc: 'Video-first visibility through YouTube, TikTok, and Snapchat.'
  }
];

// Drives the "Ad Accounts Built for Your Industry" chip row. The closer is kept
// separate so the section can style it as the emphasis chip.
export const INDUSTRY_TAGS: string[] = [
  'Gambling', 'Crypto', 'Finance', 'Forex', 'Gaming', 'E-commerce',
  'D2C', 'SaaS', 'Real Estate', 'Healthcare', 'Education'
];

export const INDUSTRY_MORE_LABEL = '30+ More Industries';

// Matches the original content document's proof strip wording exactly.
export const PROOF_ITEMS: ProofItem[] = [
  { bold: '50+', rest: 'Brands Scaled' },
  { bold: 'Platform Mix', rest: 'Built Per Business' },
  { bold: 'Free Audit', rest: 'Before You Sign' },
  { bold: 'Weekly', rest: 'Reporting' }
];

export const WHY_POINTS: WhyPoint[] = [
  { title: 'Platform-agnostic by design', desc: "We recommend what works for your business, not what we'd rather sell you." },
  { title: 'Full transparency', desc: 'You see the same dashboard we do. No black box reporting.' },
  { title: 'Free audit first', desc: "We tell you what's broken — and what's actually worth running — before you sign anything." }
];

// Quotes and locations come from the content document. The document lists every author
// as "Sample Name", so the names and roles below are placeholders chosen to fit each
// quote — swap them for real clients (with permission) before launch.
export const TESTIMONIALS: Testimonial[] = [
  { quote: 'We stopped guessing on Facebook. The cost per purchase dropped in the first month.', author: 'Marcus Reed', role: 'Founder, D2C Skincare · Austin, TX, USA', photo: '' },
  { quote: "They didn't push every platform at us. Just what worked. Simple as that.", author: 'Daniela Ortiz', role: 'Head of Growth, SaaS · Miami, FL, USA', photo: '' },
  { quote: 'Most agencies wouldn\u2019t touch our niche. These guys got us approved and running fast.', author: 'Ryan Whitfield', role: 'Co-Founder, iGaming · Vancouver, Canada', photo: '' }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    label: 'Week 1', title: 'Setup & Strategy',
    items: ['Account & pixel/tracking audit', 'Landing page review & fixes', 'Audience strategy', 'Conversion tracking setup', 'Creative direction planning', 'Campaign blueprint ready']
  },
  {
    label: 'Week 2', title: 'Launch',
    items: ['Campaign build across platforms', 'Creative testing at volume', 'Audience & platform testing', 'Budget allocation', 'Real-time monitoring']
  },
  {
    label: 'From Week 3', title: 'Scale & Grow',
    items: ['Budget scaling on winners', 'Cross-platform expansion', 'Retargeting & retention campaigns', 'New creative angles & direction', 'Weekly reporting', 'Monthly strategy reviews']
  }
];

export const FAQS: FaqEntry[] = [
  { q: 'What platforms do you run?', a: "We're capable across Meta, Google, TikTok, and Snapchat — but we only run what actually fits your business and audience, not all four by default." },
  { q: 'How do you decide which platforms to use?', a: 'We audit your business, customer, and current data on a quick chat, then recommend the mix — could be one platform, could be three.' },
  { q: 'How fast are results?', a: 'Initial data in 1–2 weeks. Meaningful scaling in 4–6 weeks.' },
  { q: 'Any contracts?', a: 'No. Transparent monthly pricing, discussed directly with you based on your business — free audit, zero obligation.' },
  { q: 'How much does it cost?', a: "Depends on your ad spend, platforms, and scope — there's no fixed package. Message us on WhatsApp or Telegram and we'll give you a straight number." }
];

export const NAV_LINKS = [
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
];
