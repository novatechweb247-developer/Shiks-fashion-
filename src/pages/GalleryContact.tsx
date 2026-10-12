import React, { useState } from 'react';
import { Page, FullWebsiteContent } from '../types';
import { Phone, MessageSquare, MapPin, CheckCircle2, Send } from 'lucide-react';
import { submitInquiry } from '../services/firestoreService';
import { ScrollReveal } from '../components/ScrollReveal';
import { SafeImage } from '../components/SafeImage';

interface GalleryContactProps {
  setCurrentPage: (page: Page) => void;
  content: FullWebsiteContent;
}

export const GalleryContact: React.FC<GalleryContactProps> = ({ content }) => {
  const { settings, galleryContact } = content;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    enquiryType: 'Fashion Services',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = ['All', 'Couture', 'Bespoke', 'Academy', 'Fabric & Detail'];

  const filteredGallery = selectedCategory === 'All'
    ? galleryContact.items
    : galleryContact.items.filter(item => item.category === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        enquiryType: formData.enquiryType,
        message: formData.message.trim(),
        source: 'Gallery & Contact Page'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting message to Firestore:', err);
      setErrorMessage('Failed to send enquiry. Please contact us via phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello Shiks Fashion, Enquiry from website.\nName: ${formData.fullName}\nType: ${formData.enquiryType}\nMessage: ${formData.message}`
  );
  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '2347035623741').replace(/[^0-9]/g, '')}?text=${whatsappText}`;

  return (
    <div className="space-y-24 pb-20">
      
      {/* PAGE HEADER */}
      <section className="bg-white border-b border-[#5A1833]/10 py-16 md:py-24">
        <ScrollReveal direction="up" className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
            {galleryContact.badge}
          </span>
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-[#5A1833] tracking-tight">
            {galleryContact.title}
          </h1>
          <p className="text-base md:text-lg text-[#191719]/70 max-w-2xl mx-auto font-light">
            {galleryContact.subtitle}
          </p>
        </ScrollReveal>
      </section>

      {/* GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
              {galleryContact.gallerySectionBadge}
            </span>
            <h2 className="font-editorial text-4xl font-bold text-[#5A1833]">
              {galleryContact.gallerySectionTitle}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-1 border border-[#5A1833]/20 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#5A1833] text-[#F8F4EE]'
                    : 'text-[#191719]/70 hover:text-[#5A1833]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGallery.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              delay={idx * 0.08}
              direction="up"
              className="group relative aspect-[4/5] overflow-hidden bg-black/5 border border-[#5A1833]/15 shadow-sm"
            >
              <SafeImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-[#F8F4EE]">
                <span className="text-xs font-semibold text-[#C9A45C] uppercase tracking-widest mb-1">
                  {item.category}
                </span>
                <h3 className="font-editorial text-xl font-bold">{item.title}</h3>
                <p className="text-xs text-[#F8F4EE]/80 mt-1 font-light">{item.caption}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up" className="bg-white border border-[#5A1833]/20 p-8 md:p-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block">
                  {galleryContact.contactBadge}
                </span>
                <h2 className="font-editorial text-4xl font-bold text-[#5A1833]">
                  {galleryContact.contactTitle}
                </h2>
                <p className="text-sm text-[#191719]/70 font-light leading-relaxed">
                  {galleryContact.contactDescription}
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#5A1833]/10 text-[#5A1833] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C9A45C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A1833]">Location</h4>
                    <p className="text-sm text-[#191719]/80 font-light mt-0.5">{settings.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#5A1833]/10 text-[#5A1833] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#C9A45C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A1833]">Phone / Tap-to-Call</h4>
                    <a
                      href={`tel:${(settings.phone || '07035623741').replace(/\s+/g, '')}`}
                      className="text-sm text-[#5A1833] font-medium hover:underline mt-0.5 block"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#5A1833]/10 text-[#5A1833] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#C9A45C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A1833]">WhatsApp</h4>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#5A1833] font-medium hover:underline mt-0.5 block"
                    >
                      Chat on WhatsApp ({settings.phone})
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#F8F4EE] p-8 md:p-10 border border-[#5A1833]/15">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block mb-1">
                      SEND A MESSAGE
                    </span>
                    <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                      Enquiry Form
                    </h3>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0703..."
                          className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                        Enquiry Type *
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833]"
                      >
                        <option value="Fashion Services">Fashion Services</option>
                        <option value="Fashion Training">Fashion Training</option>
                        <option value="General Enquiry">General Enquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you with fashion or training?"
                        className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833] resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-smooth text-center disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span>{isSubmitting ? 'Sending to Studio...' : 'Send Message'}</span>
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 px-6 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-wider hover:bg-[#b8934f] transition-smooth flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-[#5A1833]/10 text-[#5A1833] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#5A1833]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                      Enquiry Sent Successfully
                    </h3>
                    <p className="text-sm text-[#191719]/70 max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.fullName}. Your message has been received by Shiks Fashion & Innovations Academy. We will get back to you shortly.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ fullName: '', phone: '', email: '', enquiryType: 'Fashion Services', message: '' });
                      }}
                      className="py-3 px-6 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
