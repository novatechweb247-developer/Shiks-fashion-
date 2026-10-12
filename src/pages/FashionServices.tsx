import React from 'react';
import { Page, FullWebsiteContent } from '../types';
import { Check, Calendar } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { SafeImage } from '../components/SafeImage';

interface FashionServicesProps {
  setCurrentPage: (page: Page) => void;
  onOpenConsultation: () => void;
  content: FullWebsiteContent;
}

export const FashionServices: React.FC<FashionServicesProps> = ({
  setCurrentPage,
  onOpenConsultation,
  content
}) => {
  const { services } = content;

  return (
    <div className="space-y-24 pb-20">
      
      {/* PAGE HEADER */}
      <section className="bg-white border-b border-[#5A1833]/10 py-16 md:py-24">
        <ScrollReveal direction="up" className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            {services.badge}
          </span>
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-[#5A1833] tracking-tight">
            {services.title}
          </h1>
          <p className="text-base md:text-lg text-[#191719]/70 max-w-2xl mx-auto font-light">
            {services.subtitle}
          </p>
        </ScrollReveal>
      </section>

      {/* SERVICES LISTING */}
      <section className="max-w-7xl mx-auto px-6 space-y-20">
        {services.services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <ScrollReveal
              key={service.id}
              direction={isEven ? 'left' : 'right'}
              className="bg-white border border-[#5A1833]/15 p-8 md:p-16 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className={`lg:col-span-6 relative aspect-[4/3] overflow-hidden bg-[#5A1833]/5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <SafeImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
                    SERVICE 0{index + 1}
                  </span>
                  <h2 className="font-editorial text-4xl font-bold text-[#5A1833]">
                    {service.title}
                  </h2>
                  <p className="text-[#191719]/80 text-base leading-relaxed font-light">
                    {service.fullDesc}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A1833]">
                      Key Highlights:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-center gap-2 text-xs text-[#191719]/80">
                          <Check className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={onOpenConsultation}
                      className="px-8 py-3.5 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-smooth flex items-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span>Enquire About {service.title}</span>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up" className="bg-[#5A1833] text-[#F8F4EE] p-12 md:p-16 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            CUSTOM CONSULTATION
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl font-bold">
            {services.ctaTitle}
          </h2>
          <p className="text-sm md:text-base text-[#F8F4EE]/80 max-w-xl mx-auto font-light leading-relaxed">
            {services.ctaText}
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-widest hover:bg-[#b8934f] transition-smooth"
            >
              Book a Consultation Now
            </button>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
