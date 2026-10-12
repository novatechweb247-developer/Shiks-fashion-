import React from 'react';
import { Page, FullWebsiteContent } from '../types';
import { ArrowRight, MapPin, Sparkles, BookOpen } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { SafeImage } from '../components/SafeImage';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  onOpenConsultation: () => void;
  content: FullWebsiteContent;
}

export const Home: React.FC<HomeProps> = ({
  setCurrentPage,
  onOpenConsultation,
  content
}) => {
  const { settings, home, services, galleryContact } = content;

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#F8F4EE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <ScrollReveal direction="left" className="lg:col-span-6 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5A1833]/10 border border-[#5A1833]/20 text-[#5A1833] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>{home.heroBadge}</span>
            </div>

            <h1 className="font-editorial text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#5A1833] leading-[1.08]">
              {home.heroTitle} <br />
              <span className="italic font-normal text-[#C9A45C]">{home.heroSubtitle}</span>
            </h1>

            <p className="text-base md:text-lg text-[#191719]/80 max-w-xl font-light leading-relaxed">
              {home.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-widest hover:bg-[#431225] transition-smooth flex items-center justify-center gap-3 shadow-md"
              >
                <span>{home.heroBtnPrimary}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A45C]" />
              </button>

              <button
                onClick={() => {
                  setCurrentPage('academy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-transparent border-2 border-[#5A1833] text-[#5A1833] text-xs font-semibold uppercase tracking-widest hover:bg-[#5A1833] hover:text-[#F8F4EE] transition-smooth text-center"
              >
                {home.heroBtnSecondary}
              </button>
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs font-medium text-[#191719]/70 tracking-wider">
              <MapPin className="w-4 h-4 text-[#C9A45C]" />
              <span>{home.heroLocation || settings.location}</span>
            </div>
          </ScrollReveal>

          {/* Right Hero Image (Sharp, unblurred fashion photo) */}
          <ScrollReveal direction="right" className="lg:col-span-6 relative">
            <div className="relative z-10 aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden shadow-2xl border-4 border-white bg-[#5A1833]/10">
              <SafeImage
                src={settings.heroImage}
                alt="Shiks Fashion Editorial Look"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
            </div>
            {/* Decorative background accent frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#C9A45C]/40 -z-0 hidden sm:block" />
          </ScrollReveal>

        </div>
      </section>

      {/* INTRODUCTION / ABOUT PREVIEW */}
      <section className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#5A1833]/10 p-8 md:p-16 shadow-sm">
            <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden">
              <SafeImage
                src={settings.aboutImage}
                alt="Craftsmanship at Shiks Fashion"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
                {home.aboutSectionBadge}
              </span>
              <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#5A1833] tracking-tight">
                {home.aboutSectionTitle}
              </h2>
              <p className="text-[#191719]/80 text-base md:text-lg leading-relaxed font-light">
                {home.aboutSectionText}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5A1833] hover:text-[#C9A45C] transition-colors"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FASHION SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            {home.servicesSectionBadge}
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#5A1833]">
            {home.servicesSectionTitle}
          </h2>
          <p className="text-sm md:text-base text-[#191719]/70 font-light">
            {home.servicesSectionText}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.services.map((service, idx) => (
            <ScrollReveal
              key={service.id}
              delay={idx * 0.08}
              direction="up"
              className="bg-white border border-[#5A1833]/15 overflow-hidden flex flex-col group hover:shadow-xl transition-smooth"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#5A1833]/5 relative">
                <SafeImage
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-editorial text-2xl font-bold text-[#5A1833]">
                    {service.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#191719]/70 font-light leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5A1833] group-hover:text-[#C9A45C] transition-colors"
                >
                  <span>Enquire Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ACADEMY PREVIEW */}
      <section className="bg-[#5A1833] text-[#F8F4EE] py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <ScrollReveal direction="left" className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {home.academySectionBadge}
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#F8F4EE] tracking-tight">
              {home.academySectionTitle}
            </h2>
            <p className="text-base md:text-lg text-[#F8F4EE]/80 font-light leading-relaxed">
              {home.academySectionText}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setCurrentPage('academy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-widest hover:bg-[#b8934f] transition-smooth inline-flex items-center gap-3"
              >
                <span>{home.academySectionBtn}</span>
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border-2 border-[#C9A45C]/30 shadow-2xl">
            <SafeImage
              src={settings.academyImage}
              alt="Shiks Fashion Academy Students"
              className="w-full h-full object-cover object-center"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {home.gallerySectionBadge}
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#5A1833]">
              {home.gallerySectionTitle}
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('gallery-contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5A1833] hover:text-[#C9A45C] transition-colors"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryContact.items.slice(0, 3).map((item, idx) => (
            <ScrollReveal
              key={item.id}
              delay={idx * 0.1}
              direction="up"
              className="group relative aspect-[4/5] overflow-hidden bg-black/5 border border-[#5A1833]/15"
            >
              <SafeImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-[#F8F4EE]">
                <span className="text-xs font-medium text-[#C9A45C] uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h3 className="font-editorial text-xl font-bold">{item.title}</h3>
                <p className="text-xs text-[#F8F4EE]/80 mt-1 font-light">{item.caption}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="bg-white border border-[#5A1833]/20 p-12 md:p-20 text-center space-y-8 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {home.ctaBadge}
            </span>
            <h2 className="font-editorial text-4xl md:text-6xl font-bold text-[#5A1833] tracking-tight max-w-2xl mx-auto">
              {home.ctaTitle}
            </h2>
            <p className="text-base md:text-lg text-[#191719]/70 max-w-xl mx-auto font-light leading-relaxed">
              {home.ctaText}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-widest hover:bg-[#431225] transition-smooth"
              >
                {home.ctaBtnPrimary}
              </button>
              <button
                onClick={() => {
                  setCurrentPage('academy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-widest hover:bg-[#b8934f] transition-smooth"
              >
                {home.ctaBtnSecondary}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
