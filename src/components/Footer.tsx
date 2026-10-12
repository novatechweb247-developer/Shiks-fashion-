import React from 'react';
import { Page, SiteSettings } from '../types';
import { Phone, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  onOpenConsultation: () => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onOpenConsultation,
  settings
}) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '2347035623741').replace(/[^0-9]/g, '')}?text=Hello%20Shiks%20Fashion,%20I%20would%20like%20to%20enquire%20about...`;

  return (
    <footer className="bg-[#5A1833] text-[#F8F4EE] pt-16 pb-12 border-t border-[#C9A45C]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[#F8F4EE]/15">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#F8F4EE] block">
                {settings.shortName || 'SHIKS FASHION'}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold block">
                & INNOVATIONS ACADEMY
              </span>
            </div>
            <p className="text-sm text-[#F8F4EE]/80 leading-relaxed font-light">
              {settings.footerDescription}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#C9A45C] font-medium tracking-wider uppercase">
                <MapPin className="w-3.5 h-3.5" /> {settings.location}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-editorial text-lg font-semibold tracking-wide text-[#C9A45C]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F8F4EE]/80">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#C9A45C] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#C9A45C] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#C9A45C] transition-colors">
                  Fashion Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('academy')} className="hover:text-[#C9A45C] transition-colors">
                  Academy & Training
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery-contact')} className="hover:text-[#C9A45C] transition-colors">
                  Gallery & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Academy */}
          <div className="space-y-4">
            <h4 className="font-editorial text-lg font-semibold tracking-wide text-[#C9A45C]">
              Offerings
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F8F4EE]/80">
              <li>Bespoke Tailoring</li>
              <li>Original Fashion Design</li>
              <li>Fashion Consultation</li>
              <li>Practical Garment Training</li>
              <li>Pattern Drafting & Draping</li>
            </ul>
          </div>

          {/* Contact & Enquiries */}
          <div className="space-y-4">
            <h4 className="font-editorial text-lg font-semibold tracking-wide text-[#C9A45C]">
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm text-[#F8F4EE]/80">
              <a
                href={`tel:${(settings.phone || '07035623741').replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 hover:text-[#C9A45C] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9A45C]" />
                <span>{settings.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#C9A45C] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A45C]" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="w-full py-2.5 px-4 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-wider hover:bg-[#b8934f] transition-smooth flex items-center justify-center gap-2"
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F4EE]/60 gap-4">
          <p>{settings.copyrightText || `© ${currentYear} Shiks Fashion & Innovations Academy. All rights reserved.`}</p>
          <p className="flex items-center gap-1">
            <span>Crafted with passion in Jos, Nigeria</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
