import React, { useState } from 'react';
import { X, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { SiteSettings } from '../types';
import { submitInquiry } from '../services/firestoreService';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    enquiryType: 'Fashion Services',
    preferredDate: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        enquiryType: formData.enquiryType,
        message: formData.message.trim() || 'Consultation Booking Request',
        preferredDate: formData.preferredDate,
        source: 'Consultation Modal'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting inquiry to Firestore:', err);
      setErrorMessage('Submission failed. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setErrorMessage('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      enquiryType: 'Fashion Services',
      preferredDate: '',
      message: ''
    });
    onClose();
  };

  const whatsappText = encodeURIComponent(
    `Hello Shiks Fashion, I would like to book a consultation.\nName: ${formData.fullName}\nType: ${formData.enquiryType}\nPhone: ${formData.phone}`
  );
  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '2347035623741').replace(/[^0-9]/g, '')}?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F8F4EE] border border-[#5A1833]/20 w-full max-w-lg p-8 shadow-2xl relative">
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 text-[#191719]/60 hover:text-[#5A1833] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold block mb-1">
                {settings.shortName || 'SHIKS FASHION'} & INNOVATIONS
              </span>
              <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                Book a Consultation
              </h3>
              <p className="text-sm text-[#191719]/70 mt-1">
                Schedule a bespoke fashion consultation or training enquiry with our studio in {settings.location}.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Enquiry Type
                  </label>
                  <select
                    value={formData.enquiryType}
                    onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833]"
                  >
                    <option value="Fashion Services">Fashion Services & Bespoke</option>
                    <option value="Fashion Training">Fashion Training & Academy</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                  Preferred Date / Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your style preference or training goals..."
                  className="w-full px-4 py-3 bg-white border border-[#5A1833]/20 text-[#191719] text-sm focus:outline-none focus:border-[#5A1833] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-smooth text-center disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting to Studio...' : 'Submit Request'}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-wider hover:bg-[#b8934f] transition-smooth flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#5A1833]/10 text-[#5A1833] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#5A1833]" />
            </div>
            <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
              Request Received
            </h3>
            <p className="text-sm text-[#191719]/70 max-w-sm mx-auto leading-relaxed">
              Thank you, {formData.fullName}. Your request has been recorded in our system. Our atelier team will contact you shortly at {formData.phone}.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider"
              >
                Continue via WhatsApp
              </a>
              <button
                onClick={resetAndClose}
                className="py-3 px-6 bg-black/10 text-[#191719] text-xs font-semibold uppercase tracking-wider hover:bg-black/20"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
