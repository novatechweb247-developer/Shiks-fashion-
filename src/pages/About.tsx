import React from 'react';
import { Page, FullWebsiteContent } from '../types';
import { MapPin, Scissors, BookOpen, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { SafeImage } from '../components/SafeImage';

interface AboutProps {
  setCurrentPage: (page: Page) => void;
  onOpenConsultation: () => void;
  content: FullWebsiteContent;
}

export const About: React.FC<AboutProps> = ({
  setCurrentPage,
  onOpenConsultation,
  content
}) => {
  const { settings, about } = content;

  return (
    <div className="space-y-24 pb-20">
      
      {/* PAGE HEADER */}
      <section className="bg-white border-b border-[#5A1833]/10 py-16 md:py-24">
        <ScrollReveal direction="up" className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            {about.badge}
          </span>
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-[#5A1833] tracking-tight">
            {about.title}
          </h1>
          <p className="text-base md:text-lg text-[#191719]/70 max-w-2xl mx-auto font-light">
            {about.subtitle}
          </p>
        </ScrollReveal>
      </section>

      {/* CORE IDENTITY & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <ScrollReveal direction="left" className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {about.philosophyBadge}
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#5A1833] leading-tight">
              {about.philosophyHeading}
            </h2>
            <p className="text-[#191719]/80 text-base md:text-lg font-light leading-relaxed">
              {about.philosophyParagraph1}
            </p>
            <p className="text-[#191719]/80 text-base md:text-lg font-light leading-relaxed">
              {about.philosophyParagraph2}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5A1833]">
              <MapPin className="w-4 h-4 text-[#C9A45C]" />
              <span>Based in {settings.location}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="lg:col-span-6 relative aspect-[4/3] overflow-hidden shadow-xl border-4 border-white bg-[#5A1833]/10">
            <SafeImage
              src={settings.aboutImage}
              alt="Atelier Craftsmanship"
              className="w-full h-full object-cover object-center"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* DUAL PILLARS */}
      <section className="bg-[#5A1833] text-[#F8F4EE] py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              OUR DUAL FOCUS
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl font-bold">
              DESIGN & EDUCATION
            </h2>
            <p className="text-sm md:text-base text-[#F8F4EE]/80 font-light">
              How we empower our clients and students every single day.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal direction="left" className="bg-[#431225] p-8 md:p-12 border border-[#C9A45C]/30 space-y-6">
              <div className="w-12 h-12 bg-[#C9A45C]/20 text-[#C9A45C] flex items-center justify-center">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-3xl font-bold text-[#F8F4EE]">
                {about.pillarServicesTitle}
              </h3>
              <p className="text-sm md:text-base text-[#F8F4EE]/80 font-light leading-relaxed">
                {about.pillarServicesText}
              </p>
              <button
                onClick={() => {
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C9A45C] hover:text-white transition-colors"
              >
                <span>Explore Fashion Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollReveal>

            <ScrollReveal direction="right" className="bg-[#431225] p-8 md:p-12 border border-[#C9A45C]/30 space-y-6">
              <div className="w-12 h-12 bg-[#C9A45C]/20 text-[#C9A45C] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-3xl font-bold text-[#F8F4EE]">
                {about.pillarAcademyTitle}
              </h3>
              <p className="text-sm md:text-base text-[#F8F4EE]/80 font-light leading-relaxed">
                {about.pillarAcademyText}
              </p>
              <button
                onClick={() => {
                  setCurrentPage('academy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C9A45C] hover:text-white transition-colors"
              >
                <span>Discover The Academy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <ScrollReveal direction="up" className="bg-white border border-[#5A1833]/20 p-12 md:p-16 space-y-6 shadow-sm">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            START YOUR EXPERIENCE
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#5A1833]">
            {about.ctaTitle}
          </h2>
          <p className="text-base text-[#191719]/70 max-w-xl mx-auto font-light">
            {about.ctaText}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-widest hover:bg-[#431225] transition-smooth"
            >
              Book a Consultation
            </button>
            <button
              onClick={() => {
                setCurrentPage('gallery-contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-transparent border-2 border-[#5A1833] text-[#5A1833] text-xs font-semibold uppercase tracking-widest hover:bg-[#5A1833] hover:text-[#F8F4EE] transition-smooth"
            >
              Contact Studio
            </button>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
