export type Page = 'home' | 'about' | 'services' | 'academy' | 'gallery-contact';

export interface FashionService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  highlights: string[];
}

export interface AcademyModule {
  id: string;
  title: string;
  description: string;
  skillsGained: string[];
  level: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Bespoke' | 'Couture' | 'Academy' | 'Fabric & Detail';
  image: string;
  caption: string;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  heroImage: string;
  aboutImage: string;
  academyImage: string;
  footerDescription: string;
  copyrightText: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

export interface HomePageContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBtnPrimary: string;
  heroBtnSecondary: string;
  heroLocation: string;
  aboutSectionBadge: string;
  aboutSectionTitle: string;
  aboutSectionText: string;
  servicesSectionBadge: string;
  servicesSectionTitle: string;
  servicesSectionText: string;
  academySectionBadge: string;
  academySectionTitle: string;
  academySectionText: string;
  academySectionBtn: string;
  gallerySectionBadge: string;
  gallerySectionTitle: string;
  ctaBadge: string;
  ctaTitle: string;
  ctaText: string;
  ctaBtnPrimary: string;
  ctaBtnSecondary: string;
}

export interface AboutPageContent {
  badge: string;
  title: string;
  subtitle: string;
  philosophyBadge: string;
  philosophyHeading: string;
  philosophyParagraph1: string;
  philosophyParagraph2: string;
  pillarServicesTitle: string;
  pillarServicesText: string;
  pillarAcademyTitle: string;
  pillarAcademyText: string;
  ctaTitle: string;
  ctaText: string;
}

export interface ServicesPageContent {
  badge: string;
  title: string;
  subtitle: string;
  services: FashionService[];
  ctaTitle: string;
  ctaText: string;
}

export interface AcademyPageContent {
  badge: string;
  title: string;
  subtitle: string;
  trainingBadge: string;
  trainingTitle: string;
  trainingParagraph1: string;
  trainingParagraph2: string;
  trainingBtnText: string;
  curriculumBadge: string;
  curriculumTitle: string;
  curriculumSubtitle: string;
  modules: AcademyModule[];
  admissionsBadge: string;
  admissionsTitle: string;
  admissionsText: string;
}

export interface GalleryContactPageContent {
  badge: string;
  title: string;
  subtitle: string;
  gallerySectionBadge: string;
  gallerySectionTitle: string;
  items: GalleryItem[];
  contactBadge: string;
  contactTitle: string;
  contactDescription: string;
}

export interface FullWebsiteContent {
  settings: SiteSettings;
  home: HomePageContent;
  about: AboutPageContent;
  services: ServicesPageContent;
  academy: AcademyPageContent;
  galleryContact: GalleryContactPageContent;
  lastUpdated?: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'contacted';
  preferredDate?: string;
  source?: string;
}
