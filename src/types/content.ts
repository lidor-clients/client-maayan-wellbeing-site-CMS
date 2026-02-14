export interface NavbarContent {
  logoText: string;
  links: { name: string; href: string }[];
}

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  subtitleHighlight: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
  trustIndicators: { text: string; icon: string }[];
  imagePlaceholder: { title: string; subtitle: string };
  image?: string;
}

export interface AboutHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface AboutContent {
  sectionTitle: string;
  sectionSubtitle: string;
  highlights: AboutHighlight[];
  paragraphs: string[];
  missionStatement: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  dates?: string;
  cta: string;
  href: string;
  featured: boolean;
  featuredBadge?: string;
}

export interface ServicesContent {
  sectionTitle: string;
  sectionSubtitle: string;
  services: ServiceItem[];
}

export interface SyllabusWeek {
  week: number;
  date: string;
  title: string;
  topics: string[];
}

export interface WorkshopContent {
  sectionTitle: string;
  sectionSubtitle: string;
  introParagraphs: string[];
  introHighlight: string;
  benefitsTitle: string;
  benefits: string[];
  approachTitle: string;
  approachParagraphs: string[];
  syllabusTitle: string;
  syllabus: SyllabusWeek[];
  technicalTitle: string;
  technicalDetails: { icon: string; text: string }[];
  technicalExtra: string;
  ctaText: string;
  ctaButton: string;
  ctaHref: string;
  ctaSubtext: string;
}

export interface GiftItem {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
  color: 'sage' | 'blush';
}

export interface LeadMagnetsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  gifts: GiftItem[];
}

export interface NewsletterContent {
  sectionTitle: string;
  sectionSubtitle: string;
  whatsapp: {
    title: string;
    description: string;
    features: string[];
    buttonText: string;
    href: string;
  };
  email: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface FooterContent {
  brandName: string;
  brandDescription: string;
  quickLinksTitle: string;
  quickLinks: { name: string; href: string }[];
  contactTitle: string;
  email: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
}

export interface SiteContent {
  navbar: NavbarContent;
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  workshop: WorkshopContent;
  leadMagnets: LeadMagnetsContent;
  newsletter: NewsletterContent;
  footer: FooterContent;
}
