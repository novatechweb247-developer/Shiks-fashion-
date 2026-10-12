import React from 'react';
import { Page, FullWebsiteContent } from '../types';
import { CheckCircle, Phone, ArrowRight, Scissors } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { SafeImage } from '../components/SafeImage';

interface AcademyProps {
  setCurrentPage: (page: Page) => void;
  onOpenConsultation: () => void;
  content: FullWebsiteContent;
}

export const Academy: React.FC<AcademyProps> = ({
  setCurrentPage,
  onOpenConsultation,
  content
}) => {
  const { settings, academy } = content;
  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '2347035623741').replace(/[^0-9]/g, '')}?text=Hello%20Shiks%20Fashion%20Academy,%20I%20would%20like%20to%20enquire%20about%20fashion%20training.`;

  return (
    <div className="space-y-24 pb-20">
      
      {/* PAGE HEADER */}
      <section className="bg-white border-b border-[#5A1833]/10 py-16 md:py-24">
        <ScrollReveal direction="up" className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            {academy.badge}
          </span>
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-[#5A1833] tracking-tight">
            {academy.title}
          </h1>
          <p className="text-base md:text-lg text-[#191719]/70 max-w-2xl mx-auto font-light">
            {academy.subtitle}
          </p>
        </ScrollReveal>
      </section>

      {/* A. FASHION TRAINING & PRACTICAL LEARNING */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <ScrollReveal direction="left" className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {academy.trainingBadge}
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl font-bold text-[#5A1833] leading-tight">
              {academy.trainingTitle}
            </h2>
            <p className="text-[#191719]/80 text-base md:text-lg font-light leading-relaxed">
              {academy.trainingParagraph1}
            </p>
            <p className="text-[#191719]/80 text-base md:text-lg font-light leading-relaxed">
              {academy.trainingParagraph2}
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-widest hover:bg-[#431225] transition-smooth inline-flex items-center gap-2"
              >
                <span>{academy.trainingBtnText}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A45C]" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="lg:col-span-6 relative aspect-[4/3] overflow-hidden shadow-xl border-4 border-white bg-[#5A1833]/10">
            <SafeImage
              src={settings.academyImage}
              alt="Academy Training in Jos"
              className="w-full h-full object-cover object-center"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* B & C. LEARNING MODULES & EXPERIENCE */}
      <section className="bg-[#5A1833] text-[#F8F4EE] py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {academy.curriculumBadge}
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl font-bold">
              {academy.curriculumTitle}
            </h2>
            <p className="text-sm md:text-base text-[#F8F4EE]/80 font-light">
              {academy.curriculumSubtitle}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {academy.modules.map((mod, idx) => (
              <ScrollReveal
                key={mod.id}
                delay={idx * 0.1}
                direction="up"
                className="bg-[#431225] p-8 border border-[#C9A45C]/30 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
                      {mod.level} Level
                    </span>
                    <Scissors className="w-5 h-5 text-[#C9A45C]" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#F8F4EE]">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-[#F8F4EE]/80 font-light leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#F8F4EE]/10">
                  <span className="text-[11px] uppercase tracking-wider text-[#C9A45C] font-semibold block">
                    Core Skills Gained:
                  </span>
                  <ul className="space-y-1.5">
                    {mod.skillsGained.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2 text-xs text-[#F8F4EE]/90">
                        <CheckCircle className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* D. TRAINING ENQUIRIES CTA */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <ScrollReveal direction="up" className="bg-white border border-[#5A1833]/20 p-12 md:p-20 space-y-6 shadow-sm">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            {academy.admissionsBadge}
          </span>
          <h2 className="font-editorial text-4xl md:text-6xl font-bold text-[#5A1833]">
            {academy.admissionsTitle}
          </h2>
          <p className="text-base text-[#191719]/70 max-w-xl mx-auto font-light leading-relaxed">
            {academy.admissionsText}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-widest hover:bg-[#431225] transition-smooth"
            >
              Enquire About Training
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-widest hover:bg-[#b8934f] transition-smooth inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
