import { FullWebsiteContent, FashionService, AcademyModule, GalleryItem, SiteSettings, HomePageContent, AboutPageContent, ServicesPageContent, AcademyPageContent, GalleryContactPageContent } from '../types';

export const initialSiteSettings: SiteSettings = {
  name: "Shiks Fashion & Innovations Academy",
  shortName: "Shiks Fashion",
  tagline: "Where Style Meets Craft.",
  location: "Jos, Plateau State, Nigeria",
  phone: "0703 562 3741",
  whatsappNumber: "2347035623741",
  email: "contact@shiksfashion.com",
  heroImage: "/src/assets/images/hero_fashion_model_1791780188473.jpg",
  aboutImage: "/src/assets/images/about_craftsmanship_1791780200528.jpg",
  academyImage: "/src/assets/images/academy_training_1791780223578.jpg",
  footerDescription: "Where style meets craft. Offering professional fashion design services and practical fashion education in Jos, Plateau State, Nigeria.",
  copyrightText: "© 2026 Shiks Fashion & Innovations Academy. All rights reserved.",
  openingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: ""
};

export const initialHomePageContent: HomePageContent = {
  heroBadge: "SHIKS FASHION & INNOVATIONS ACADEMY",
  heroTitle: "WHERE STYLE",
  heroSubtitle: "MEETS CRAFT.",
  heroDescription: "Discover beautifully crafted fashion, thoughtful design, and practical training that helps you develop your fashion skills with confidence.",
  heroBtnPrimary: "Explore Our Designs",
  heroBtnSecondary: "Explore The Academy",
  heroLocation: "JOS, PLATEAU STATE, NIGERIA",
  aboutSectionBadge: "OUR PHILOSOPHY",
  aboutSectionTitle: "CRAFTED WITH PASSION.",
  aboutSectionText: "At Shiks Fashion, creativity and craftsmanship come together to celebrate personal style. From carefully designed garments to practical fashion education, we create opportunities to express creativity and develop valuable skills.",
  servicesSectionBadge: "ATELIER & DESIGN",
  servicesSectionTitle: "OUR FASHION",
  servicesSectionText: "Thoughtfully tailored garments and bespoke creations designed around your unique identity.",
  academySectionBadge: "FASHION TRAINING ACADEMY",
  academySectionTitle: "LEARN THE ART OF FASHION.",
  academySectionText: "Develop practical fashion skills through guided learning, creative exploration, and hands-on experience in our Jos training academy. Whether you are a beginner or looking to refine professional techniques, our structured training empowers your journey.",
  academySectionBtn: "Discover Our Academy",
  gallerySectionBadge: "EDITORIAL PORTFOLIO",
  gallerySectionTitle: "A WORLD OF CREATIVITY.",
  ctaBadge: "GET IN TOUCH",
  ctaTitle: "YOUR FASHION JOURNEY STARTS HERE.",
  ctaText: "Whether you are looking for a custom creation or hoping to develop your fashion skills, we would love to hear from you.",
  ctaBtnPrimary: "Book a Consultation",
  ctaBtnSecondary: "Enquire About Training"
};

export const initialAboutPageContent: AboutPageContent = {
  badge: "ABOUT US",
  title: "ABOUT SHIKS FASHION",
  subtitle: "Bringing together bespoke fashion design services and practical fashion education in Jos, Plateau State.",
  philosophyBadge: "CREATIVITY. CRAFTSMANSHIP. GROWTH.",
  philosophyHeading: "A commitment to excellence in design and education.",
  philosophyParagraph1: "Shiks Fashion & Innovations Academy is a premier fashion destination rooted in Jos, Plateau State, Nigeria. We believe that true style is born from thoughtful design, precise execution, and uncompromised craftsmanship.",
  philosophyParagraph2: "Our work spans across custom bespoke tailoring, exclusive fashion creations, and professional training designed to nurture the next generation of creative talents.",
  pillarServicesTitle: "Bespoke Fashion Services",
  pillarServicesText: "We craft custom garments tailored precisely to your measurements and lifestyle. From elegant evening wear to distinctive cultural attire and statement pieces, every creation reflects meticulous attention to detail.",
  pillarAcademyTitle: "Practical Fashion Training",
  pillarAcademyText: "Our academy offers hands-on education in garment construction, pattern drafting, and professional styling. We equip aspiring designers with the practical skills and confidence needed to build a successful career in fashion.",
  ctaTitle: "READY TO COLLABORATE OR LEARN?",
  ctaText: "Get in touch with our studio in Jos for custom garment consultations or academy admissions."
};

export const initialFashionServices: FashionService[] = [
  {
    id: 'bespoke',
    title: 'Bespoke Fashion',
    shortDesc: 'Custom-designed garments tailored to individual style and preferences.',
    fullDesc: 'Our bespoke tailoring service is dedicated to crafting garments that fit you impeccably. Every piece is meticulously constructed from initial consultation to final fitting, honoring your personal style and silhouette with timeless elegance.',
    image: '/src/assets/images/service_bespoke_1791780213496.jpg',
    highlights: ['Individual pattern drafting', 'Precision personal fittings', 'Exquisite fabric selection', 'Immaculate finishing']
  },
  {
    id: 'design',
    title: 'Fashion Design',
    shortDesc: 'Thoughtful designs that combine creativity, detail, and craftsmanship.',
    fullDesc: 'We create original fashion concepts that merge contemporary aesthetics with rich cultural heritage. Each design tells a unique story through balanced proportions, harmonious color palettes, and thoughtful detailing.',
    image: '/src/assets/images/service_design_1791780238007.jpg',
    highlights: ['Original concept sketches', 'Custom textile styling', 'Detailed garment construction', 'Editorial look curation']
  },
  {
    id: 'consultation',
    title: 'Fashion Consultation',
    shortDesc: 'Guidance to help clients explore styles, outfit ideas, and design preferences.',
    fullDesc: 'Not sure which silhouette or fabric suits your occasion? Our professional fashion consultations provide expert guidance on wardrobe curation, style direction, and custom outfit planning tailored to your lifestyle.',
    image: '/src/assets/images/service_consultation_1791780247846.jpg',
    highlights: ['Wardrobe direction', 'Fabric & color profiling', 'Occasion outfit planning', 'Personalized style advice']
  },
  {
    id: 'custom',
    title: 'Custom Creations',
    shortDesc: 'Personalized fashion creations designed around each client’s needs.',
    fullDesc: 'For weddings, galas, milestones, and special events, our custom creation service brings your dream attire to life with superior craftsmanship, luxurious fabrics, and stunning decorative finishes.',
    image: '/src/assets/images/service_custom_1791780257537.jpg',
    highlights: ['Bridal & special occasion wear', 'Hand-embroidery & detailing', 'Exclusive fabric sourcing', 'Impeccable execution']
  }
];

export const initialServicesPageContent: ServicesPageContent = {
  badge: "ATELIER PORTFOLIO",
  title: "OUR FASHION SERVICES",
  subtitle: "Fashion thoughtfully designed around your style, silhouette, and personal occasions.",
  services: initialFashionServices,
  ctaTitle: "LET'S BRING YOUR VISION TO LIFE.",
  ctaText: "Visit our studio in Jos or schedule a consultation with our design team to discuss your bespoke garment requirements."
};

export const initialAcademyModules: AcademyModule[] = [
  {
    id: 'mod-1',
    title: 'Fundamentals of Garment Construction',
    description: 'Master the core mechanics of sewing, machine handling, stitch types, and professional finishing techniques.',
    skillsGained: ['Machine operation', 'Seam finishes', 'Basic garment assembly', 'Pressing & shaping'],
    level: 'Beginner'
  },
  {
    id: 'mod-2',
    title: 'Pattern Drafting & Draping',
    description: 'Learn how to translate body measurements into accurate flat patterns and understand 3D form draping.',
    skillsGained: ['Body measurement protocols', 'Bodice & skirt blocks', 'Dart manipulation', 'Sleeve drafting'],
    level: 'Intermediate'
  },
  {
    id: 'mod-3',
    title: 'Advanced Couture & Styling',
    description: 'Explore sophisticated garment construction, lining techniques, corsetry, and high-end detailing.',
    skillsGained: ['Couture corsetry', 'Complex linings', 'Finishing touches', 'Design execution'],
    level: 'Advanced'
  }
];

export const initialAcademyPageContent: AcademyPageContent = {
  badge: "FASHION TRAINING ACADEMY",
  title: "LEARN THE ART OF FASHION.",
  subtitle: "Build your creativity and develop practical fashion skills through hands-on learning in Jos, Plateau State.",
  trainingBadge: "PRACTICAL SKILL DEVELOPMENT",
  trainingTitle: "Master the craft from foundational sewing to advanced design.",
  trainingParagraph1: "At Shiks Fashion & Innovations Academy, our training approach focuses heavily on practical execution. Students gain direct, hands-on experience working with industrial sewing machines, precision pattern drafting, fabric selection, and garment construction techniques.",
  trainingParagraph2: "Whether you are starting fresh or looking to elevate your tailoring proficiency, our studio environment offers personalized guidance and a supportive creative community.",
  trainingBtnText: "Enquire About Training",
  curriculumBadge: "CURRICULUM OVERVIEW",
  curriculumTitle: "LEARNING EXPERIENCE",
  curriculumSubtitle: "Structured modules designed for comprehensive skill acquisition.",
  modules: initialAcademyModules,
  admissionsBadge: "ADMISSIONS & ENQUIRIES",
  admissionsTitle: "START YOUR TRAINING TODAY.",
  admissionsText: "Have questions about our training schedules, intake periods, or practical sessions? Reach out to our Jos academy team directly."
};

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Modern Nigerian Editorial Ensemble',
    category: 'Couture',
    image: '/src/assets/images/gallery_item_1_1791780266740.jpg',
    caption: 'Designed and crafted in Jos, Plateau State.'
  },
  {
    id: 'gal-2',
    title: 'Luxurious Velvet & Gold Embroidery',
    category: 'Bespoke',
    image: '/src/assets/images/hero_fashion_model_1791780188473.jpg',
    caption: 'Deep burgundy velvet paired with champagne gold detailing.'
  },
  {
    id: 'gal-3',
    title: 'Atelier Craftsmanship in Progress',
    category: 'Fabric & Detail',
    image: '/src/assets/images/about_craftsmanship_1791780200528.jpg',
    caption: 'Meticulous hand-embroidery and beadwork.'
  },
  {
    id: 'gal-4',
    title: 'Academy Training Session',
    category: 'Academy',
    image: '/src/assets/images/academy_training_1791780223578.jpg',
    caption: 'Students developing practical fashion skills in our studio.'
  },
  {
    id: 'gal-5',
    title: 'Bespoke Evening Tailoring',
    category: 'Bespoke',
    image: '/src/assets/images/service_bespoke_1791780213496.jpg',
    caption: 'Precision silhouette on display.'
  },
  {
    id: 'gal-6',
    title: 'Custom Tailored Jacket',
    category: 'Couture',
    image: '/src/assets/images/service_custom_1791780257537.jpg',
    caption: 'Structured elegance with intricate buttonwork.'
  }
];

export const initialGalleryContactPageContent: GalleryContactPageContent = {
  badge: "PORTFOLIO & ENQUIRIES",
  title: "GALLERY & CONTACT",
  subtitle: "Explore our editorial lookbook and get in touch with our studio in Jos, Plateau State.",
  gallerySectionBadge: "VISUAL SHOWCASE",
  gallerySectionTitle: "Featured Creations & Academy Work",
  items: initialGalleryItems,
  contactBadge: "REACH OUT",
  contactTitle: "Contact Information",
  contactDescription: "Have a question about our bespoke tailoring services or fashion academy training? Connect with our team in Jos."
};

export const initialWebsiteContent: FullWebsiteContent = {
  settings: initialSiteSettings,
  home: initialHomePageContent,
  about: initialAboutPageContent,
  services: initialServicesPageContent,
  academy: initialAcademyPageContent,
  galleryContact: initialGalleryContactPageContent
};

// Backwards compatibility export
export const businessInfo = initialSiteSettings;
export const fashionServices = initialFashionServices;
export const academyModules = initialAcademyModules;
export const galleryItems = initialGalleryItems;
