import React, { useState } from 'react';
import { Page, SiteSettings } from '../types';
import { Menu, X, Calendar, Phone, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onOpenConsultation: () => void;
  settings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  onOpenConsultation,
  settings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: Page; label: string; number: string }[] = [
    { id: 'home', label: 'Home', number: '01' },
    { id: 'about', label: 'About', number: '02' },
    { id: 'services', label: 'Fashion Services', number: '03' },
    { id: 'academy', label: 'Academy', number: '04' },
    { id: 'gallery-contact', label: 'Gallery & Contact', number: '05' },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8F4EE]/95 backdrop-blur-md border-b border-[#5A1833]/10 transition-smooth">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group focus:outline-none whitespace-nowrap shrink-0"
        >
          <span className="font-editorial text-2xl md:text-3xl font-bold tracking-tight text-[#5A1833] block">
            {settings.shortName || 'SHIKS FASHION'}
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold block -mt-1">
            & INNOVATIONS ACADEMY
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#191719]">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-smooth relative py-2 ${
                  isActive
                    ? 'text-[#5A1833] font-semibold'
                    : 'text-[#191719]/80 hover:text-[#5A1833]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A45C] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={`tel:${(settings.phone || '07035623741').replace(/\s+/g, '')}`}
            className="hidden xl:flex items-center gap-2 text-xs font-medium text-[#5A1833] hover:text-[#191719] transition-smooth"
            title="Call Us"
          >
            <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>{settings.phone}</span>
          </a>

          <button
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-[#431225] transition-smooth shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Book Consultation</span>
          </button>

          {/* Mobile menu button with animation */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-[#5A1833] hover:bg-[#5A1833]/10 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer with Beautiful Pop-Out Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-[#F8F4EE] border-b border-[#5A1833]/20 shadow-2xl"
          >
            <div className="px-6 py-8 space-y-6">
              
              <div className="text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold border-b border-[#5A1833]/10 pb-2">
                NAVIGATION
              </div>

              {/* Hamburger Links with Pop-Out Animation */}
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = currentPage === link.id;
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, scale: 0.85, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -10 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.07,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full text-left py-3 px-4 flex items-center justify-between group transition-colors ${
                          isActive
                            ? 'bg-[#5A1833] text-[#F8F4EE] shadow-md'
                            : 'text-[#191719] hover:bg-[#5A1833]/10 hover:text-[#5A1833]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-mono font-bold tracking-wider ${
                              isActive ? 'text-[#C9A45C]' : 'text-[#C9A45C] group-hover:text-[#5A1833]'
                            }`}
                          >
                            {link.number}
                          </span>
                          <span className="font-editorial text-2xl font-bold tracking-wide">
                            {link.label}
                          </span>
                        </div>
                        <ArrowUpRight
                          className={`w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${
                            isActive ? 'text-[#C9A45C]' : 'text-gray-400 group-hover:text-[#5A1833]'
                          }`}
                        />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.42 }}
                className="pt-4 border-t border-[#5A1833]/10 flex flex-col gap-3"
              >
                <a
                  href={`tel:${(settings.phone || '07035623741').replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 text-sm text-[#5A1833] font-semibold py-2 bg-white border border-[#5A1833]/20"
                >
                  <Phone className="w-4 h-4 text-[#C9A45C]" />
                  <span>Call {settings.phone}</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full py-3.5 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider text-center hover:bg-[#431225] shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Book Consultation</span>
                </button>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
