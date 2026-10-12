import React, { useState, useEffect } from 'react';
import {
  FullWebsiteContent,
  Inquiry,
  FashionService,
  AcademyModule,
  GalleryItem,
  SiteSettings,
  HomePageContent,
  AboutPageContent,
  ServicesPageContent,
  AcademyPageContent,
  GalleryContactPageContent
} from '../types';
import {
  getDraftContent,
  getPublishedContent,
  saveDraftContent,
  publishContent,
  verifyWriteStatus,
  isWritePending,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../services/firestoreService';
import { ImageUploader } from '../components/ImageUploader';
import {
  Save,
  Globe,
  CheckCircle,
  AlertCircle,
  Settings,
  Image as ImageIcon,
  Home as HomeIcon,
  BookOpen,
  Scissors,
  GraduationCap,
  LayoutGrid,
  Mail,
  Phone,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface AdminCenterProps {
  onReturnToWebsite: () => void;
  onContentPublished: (newContent: FullWebsiteContent) => void;
}

type AdminTab =
  | 'settings'
  | 'media'
  | 'home'
  | 'about'
  | 'services'
  | 'academy'
  | 'galleryContact'
  | 'inquiries';

export const AdminCenter: React.FC<AdminCenterProps> = ({
  onReturnToWebsite,
  onContentPublished
}) => {
  const [content, setContent] = useState<FullWebsiteContent | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [unconfirmedOp, setUnconfirmedOp] = useState<{
    type: 'draft' | 'published';
    timestamp: string;
    isChecking: boolean;
  } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const draftData = await getDraftContent();
      setContent(draftData);
      const inqList = await getInquiries();
      setInquiries(inqList);
    } catch (err) {
      console.error('Error loading admin content:', err);
      showFeedback('error', 'Failed to load content from Firestore.');
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type: 'success' | 'error' | 'warning', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const updateSettingsField = (field: keyof SiteSettings, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      settings: { ...content.settings, [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  const updateHomeField = (field: keyof HomePageContent, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      home: { ...content.home, [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  const updateAboutField = (field: keyof AboutPageContent, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      about: { ...content.about, [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  const updateServicesPageField = (field: 'badge' | 'title' | 'subtitle' | 'ctaTitle' | 'ctaText', value: string) => {
    if (!content) return;
    setContent({
      ...content,
      services: { ...content.services, [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  const updateAcademyPageField = (field: keyof AcademyPageContent, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      academy: { ...content.academy, [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  const updateGalleryContactField = (field: keyof GalleryContactPageContent, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      galleryContact: { ...content.galleryContact, [field]: value }
    });
    setHasUnsavedChanges(true);
  };

  // Actions
  const handleSaveDraft = async () => {
    if (!content) return;
    if (isSavingDraft || isPublishing) return;

    if (isWritePending()) {
      showFeedback('warning', 'Another write operation is currently in-flight. Please wait a moment.');
      return;
    }

    setIsSavingDraft(true);
    setFeedbackMessage(null);
    try {
      const result = await saveDraftContent(content);
      // Synchronize local content with safeContent to preserve edits and prevent re-uploading offloaded media
      setContent(result.safeContent);

      if (result.outcome === 'confirmed') {
        setHasUnsavedChanges(false);
        setUnconfirmedOp(null);
        showFeedback('success', 'Draft successfully saved and confirmed in Firestore.');
      } else if (result.outcome === 'unconfirmed_timeout') {
        // Result could not be confirmed within bounded wait, but write is still in flight in background
        setUnconfirmedOp({
          type: 'draft',
          timestamp: result.timestamp,
          isChecking: false
        });
        showFeedback('warning', 'Draft write was dispatched, but server response took longer than 7s. Your edits are preserved in session.');
      } else {
        // Explicit error
        showFeedback('error', result.message);
      }
    } catch (err: any) {
      console.error('Error saving draft:', err);
      showFeedback('error', `Failed to save draft: ${err?.message || 'Firestore write failure.'}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!content) return;
    if (isSavingDraft || isPublishing) return;

    if (isWritePending()) {
      showFeedback('warning', 'Another write operation is currently in-flight. Please wait a moment.');
      return;
    }

    setIsPublishing(true);
    setFeedbackMessage(null);
    try {
      const result = await publishContent(content);
      // Synchronize local content with safeContent
      setContent(result.safeContent);

      if (result.outcome === 'confirmed') {
        setHasUnsavedChanges(false);
        setUnconfirmedOp(null);
        onContentPublished(result.safeContent);
        showFeedback('success', 'Changes published and confirmed! Public website has been updated.');
      } else if (result.outcome === 'unconfirmed_timeout') {
        setUnconfirmedOp({
          type: 'published',
          timestamp: result.timestamp,
          isChecking: false
        });
        showFeedback('warning', 'Publish write was dispatched, but server response took longer than 7s. Your edits are preserved in session.');
      } else {
        showFeedback('error', result.message);
      }
    } catch (err: any) {
      console.error('Error publishing:', err);
      showFeedback('error', `Failed to publish: ${err?.message || 'Firestore publication failure.'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleVerifyStatus = async () => {
    if (!unconfirmedOp) return;
    setUnconfirmedOp((prev) => (prev ? { ...prev, isChecking: true } : null));

    try {
      const { confirmed } = await verifyWriteStatus(unconfirmedOp.type, unconfirmedOp.timestamp);
      if (confirmed) {
        setHasUnsavedChanges(false);
        if (unconfirmedOp.type === 'published' && content) {
          onContentPublished(content);
        }
        showFeedback('success', `Status confirmed! The ${unconfirmedOp.type} write successfully verified on Firestore.`);
        setUnconfirmedOp(null);
      } else {
        showFeedback('warning', `Status remains unconfirmed on server. The write may still be syncing or offline. You can retry.`);
        setUnconfirmedOp((prev) => (prev ? { ...prev, isChecking: false } : null));
      }
    } catch (err) {
      showFeedback('error', 'Could not verify server status at this moment.');
      setUnconfirmedOp((prev) => (prev ? { ...prev, isChecking: false } : null));
    }
  };

  const handleInquiryStatus = async (id: string, status: 'new' | 'reviewed' | 'contacted') => {
    try {
      await updateInquiryStatus(id, status);
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq));
      showFeedback('success', 'Inquiry status updated.');
    } catch (err) {
      showFeedback('error', 'Failed to update inquiry status.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      await deleteInquiry(id);
      setInquiries(inquiries.filter(inq => inq.id !== id));
      showFeedback('success', 'Inquiry deleted.');
    } catch (err) {
      showFeedback('error', 'Failed to delete inquiry.');
    }
  };

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#5A1833] animate-spin mx-auto" />
          <h2 className="font-editorial text-2xl font-bold text-[#5A1833]">
            Connecting to Firestore...
          </h2>
          <p className="text-xs text-[#191719]/60">Loading persistent website data</p>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'settings', label: 'Global Settings', icon: Settings },
    { id: 'media', label: 'Branding & Images', icon: ImageIcon },
    { id: 'home', label: 'Home Page', icon: HomeIcon },
    { id: 'about', label: 'About Page', icon: BookOpen },
    { id: 'services', label: 'Fashion Services', icon: Scissors },
    { id: 'academy', label: 'Academy & Training', icon: GraduationCap },
    { id: 'galleryContact', label: 'Gallery & Contact', icon: LayoutGrid },
    { id: 'inquiries', label: 'Inquiries & Leads', icon: Mail, count: inquiries.filter(i => i.status === 'new').length }
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#191719] flex flex-col font-sans">
      
      {/* TOP ADMIN HEADER BAR */}
      <header className="sticky top-0 z-50 bg-[#5A1833] text-[#F8F4EE] border-b border-[#C9A45C]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#C9A45C] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <span className="font-editorial text-xl md:text-2xl font-bold block leading-none">
                SHIKS ADMIN CENTER
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold block mt-1">
                Content Management System · Persistent Firestore
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {hasUnsavedChanges && (
              <span className="hidden sm:inline-block px-2.5 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/40 text-[11px] font-medium">
                Unsaved Changes
              </span>
            )}

            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPublishing}
              className="px-3.5 py-2 bg-[#431225] border border-[#C9A45C]/40 text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#340b1b] transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Save draft to Firestore without publishing to public visitors"
            >
              <Save className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="hidden sm:inline">{isSavingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
              <span className="sm:hidden">{isSavingDraft ? 'Saving...' : 'Draft'}</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isSavingDraft || isPublishing}
              className="px-4 py-2 bg-[#C9A45C] text-[#5A1833] text-xs font-bold uppercase tracking-wider hover:bg-[#b8934f] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              title="Publish immediately to public website"
            >
              <Globe className="w-3.5 h-3.5 text-[#5A1833]" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
            </button>

            <button
              onClick={onReturnToWebsite}
              className="p-2 sm:px-3 sm:py-2 bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
              title="Return to Public Website"
            >
              <ExternalLink className="w-4 h-4 text-[#C9A45C]" />
              <span className="hidden md:inline">View Website</span>
            </button>
          </div>

        </div>

        {/* Unconfirmed Status Banner with Server Verification */}
        {unconfirmedOp && (
          <div className="bg-amber-900/90 text-amber-100 border-t border-amber-600/50 px-4 sm:px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>
                <strong>Unconfirmed {unconfirmedOp.type === 'draft' ? 'Draft' : 'Publish'} Write:</strong> Server confirmation timed out (&gt;7s), but write request was dispatched. Your edits are preserved in session.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerifyStatus}
                disabled={unconfirmedOp.isChecking}
                className="px-2.5 py-1 bg-[#C9A45C] text-[#5A1833] hover:bg-[#b8934f] text-[11px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {unconfirmedOp.isChecking ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Checking Server...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Verify Server Status</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setUnconfirmedOp(null)}
                className="px-2 py-1 text-amber-300 hover:text-white text-[11px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Status Toast */}
        {feedbackMessage && (
          <div
            className={`px-6 py-2 text-xs font-medium flex items-center justify-center gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : feedbackMessage.type === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}
      </header>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`lg:col-span-3 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          } space-y-2`}
        >
          <div className="bg-white border border-[#5A1833]/15 p-2 shadow-sm space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold uppercase tracking-wider text-left transition-colors ${
                    isActive
                      ? 'bg-[#5A1833] text-[#F8F4EE]'
                      : 'text-[#191719]/80 hover:bg-[#5A1833]/10 hover:text-[#5A1833]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A45C]' : 'text-[#5A1833]'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-2 py-0.5 bg-[#C9A45C] text-[#5A1833] text-[10px] font-bold rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick info panel */}
          <div className="bg-[#5A1833]/5 border border-[#5A1833]/15 p-4 text-xs space-y-2">
            <span className="font-semibold text-[#5A1833] uppercase tracking-wider block">
              Persistence Status
            </span>
            <p className="text-[#191719]/70 text-[11px] leading-relaxed">
              All draft edits save to Cloud Firestore <code className="text-[#5A1833]">pagesDrafts</code>. Publishing updates <code className="text-[#5A1833]">pagesPublished</code>.
            </p>
          </div>
        </aside>

        {/* TAB CONTENT AREA */}
        <main className="lg:col-span-9 bg-white border border-[#5A1833]/15 p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* TAB 1: GLOBAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                  GLOBAL SETTINGS
                </span>
                <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                  Business & Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Business Full Name
                  </label>
                  <input
                    type="text"
                    value={content.settings.name}
                    onChange={(e) => updateSettingsField('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Short Brand Name
                  </label>
                  <input
                    type="text"
                    value={content.settings.shortName}
                    onChange={(e) => updateSettingsField('shortName', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={content.settings.tagline}
                    onChange={(e) => updateSettingsField('tagline', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={content.settings.location}
                    onChange={(e) => updateSettingsField('location', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Phone Number (Tap-to-call)
                  </label>
                  <input
                    type="text"
                    value={content.settings.phone}
                    onChange={(e) => updateSettingsField('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    WhatsApp Number (Digits only, e.g. 2347035623741)
                  </label>
                  <input
                    type="text"
                    value={content.settings.whatsappNumber}
                    onChange={(e) => updateSettingsField('whatsappNumber', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={content.settings.email}
                    onChange={(e) => updateSettingsField('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={content.settings.openingHours}
                    onChange={(e) => updateSettingsField('openingHours', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                  Footer Description
                </label>
                <textarea
                  rows={2}
                  value={content.settings.footerDescription}
                  onChange={(e) => updateSettingsField('footerDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={content.settings.copyrightText}
                  onChange={(e) => updateSettingsField('copyrightText', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs focus:outline-none focus:border-[#5A1833]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                  MEDIA ASSETS
                </span>
                <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                  Key Brand Photography & Banners
                </h3>
                <p className="text-xs text-[#191719]/70 mt-1">
                  Upload sharp fashion images or provide image URLs. Changes apply immediately upon saving/publishing.
                </p>
              </div>

              <div className="space-y-6">
                <ImageUploader
                  label="Hero Editorial Image (Homepage)"
                  currentImage={content.settings.heroImage}
                  onImageChange={(val) => updateSettingsField('heroImage', val)}
                  aspectRatio="aspect-[4/5]"
                />

                <ImageUploader
                  label="About Atelier Craftsmanship Image"
                  currentImage={content.settings.aboutImage}
                  onImageChange={(val) => updateSettingsField('aboutImage', val)}
                  aspectRatio="aspect-[4/3]"
                />

                <ImageUploader
                  label="Academy Classroom & Training Image"
                  currentImage={content.settings.academyImage}
                  onImageChange={(val) => updateSettingsField('academyImage', val)}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: HOME PAGE */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                  HOMEPAGE CONTENT
                </span>
                <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                  Edit Hero & Section Texts
                </h3>
              </div>

              <div className="p-4 bg-[#F8F4EE] border border-[#5A1833]/15 space-y-4">
                <h4 className="font-editorial text-lg font-bold text-[#5A1833]">Hero Section</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Hero Badge Label
                    </label>
                    <input
                      type="text"
                      value={content.home.heroBadge}
                      onChange={(e) => updateHomeField('heroBadge', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Location Subtext
                    </label>
                    <input
                      type="text"
                      value={content.home.heroLocation}
                      onChange={(e) => updateHomeField('heroLocation', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Headline (Line 1)
                    </label>
                    <input
                      type="text"
                      value={content.home.heroTitle}
                      onChange={(e) => updateHomeField('heroTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Headline Accent (Line 2)
                    </label>
                    <input
                      type="text"
                      value={content.home.heroSubtitle}
                      onChange={(e) => updateHomeField('heroSubtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                    Hero Supporting Description
                  </label>
                  <textarea
                    rows={2}
                    value={content.home.heroDescription}
                    onChange={(e) => updateHomeField('heroDescription', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      value={content.home.heroBtnPrimary}
                      onChange={(e) => updateHomeField('heroBtnPrimary', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Secondary Button Label
                    </label>
                    <input
                      type="text"
                      value={content.home.heroBtnSecondary}
                      onChange={(e) => updateHomeField('heroBtnSecondary', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* About Preview Section */}
              <div className="p-4 bg-[#F8F4EE] border border-[#5A1833]/15 space-y-3">
                <h4 className="font-editorial text-lg font-bold text-[#5A1833]">About Preview Section</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Badge
                    </label>
                    <input
                      type="text"
                      value={content.home.aboutSectionBadge}
                      onChange={(e) => updateHomeField('aboutSectionBadge', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={content.home.aboutSectionTitle}
                      onChange={(e) => updateHomeField('aboutSectionTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                    Text
                  </label>
                  <textarea
                    rows={2}
                    value={content.home.aboutSectionText}
                    onChange={(e) => updateHomeField('aboutSectionText', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs resize-none"
                  />
                </div>
              </div>

              {/* Final CTA Section */}
              <div className="p-4 bg-[#F8F4EE] border border-[#5A1833]/15 space-y-3">
                <h4 className="font-editorial text-lg font-bold text-[#5A1833]">Final Call-to-Action</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={content.home.ctaTitle}
                      onChange={(e) => updateHomeField('ctaTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={content.home.ctaBtnPrimary}
                      onChange={(e) => updateHomeField('ctaBtnPrimary', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={content.home.ctaText}
                    onChange={(e) => updateHomeField('ctaText', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT PAGE */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                  ABOUT PAGE CONTENT
                </span>
                <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                  Philosophy & Core Story
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={content.about.title}
                    onChange={(e) => updateAboutField('title', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={content.about.subtitle}
                    onChange={(e) => updateAboutField('subtitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Philosophy Section Heading
                  </label>
                  <input
                    type="text"
                    value={content.about.philosophyHeading}
                    onChange={(e) => updateAboutField('philosophyHeading', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                  Philosophy Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={content.about.philosophyParagraph1}
                  onChange={(e) => updateAboutField('philosophyParagraph1', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                  Philosophy Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={content.about.philosophyParagraph2}
                  onChange={(e) => updateAboutField('philosophyParagraph2', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-4 bg-[#F8F4EE] border border-[#5A1833]/15 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#5A1833]">Bespoke Services Pillar</h4>
                  <input
                    type="text"
                    value={content.about.pillarServicesTitle}
                    onChange={(e) => updateAboutField('pillarServicesTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={content.about.pillarServicesText}
                    onChange={(e) => updateAboutField('pillarServicesText', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs resize-none"
                  />
                </div>

                <div className="p-4 bg-[#F8F4EE] border border-[#5A1833]/15 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#5A1833]">Academy Training Pillar</h4>
                  <input
                    type="text"
                    value={content.about.pillarAcademyTitle}
                    onChange={(e) => updateAboutField('pillarAcademyTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={content.about.pillarAcademyText}
                    onChange={(e) => updateAboutField('pillarAcademyText', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FASHION SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                    SERVICES MANAGEMENT
                  </span>
                  <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                    Fashion Offerings & Details
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const newService: FashionService = {
                      id: `svc-${Date.now()}`,
                      title: 'New Fashion Offering',
                      shortDesc: 'Short description of this service.',
                      fullDesc: 'Comprehensive description of what is included.',
                      image: '/src/assets/images/service_bespoke_1791780213496.jpg',
                      highlights: ['Feature 1', 'Feature 2']
                    };
                    setContent({
                      ...content,
                      services: {
                        ...content.services,
                        services: [...content.services.services, newService]
                      }
                    });
                    setHasUnsavedChanges(true);
                  }}
                  className="px-4 py-2 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-colors flex items-center gap-2 self-start"
                >
                  <Plus className="w-4 h-4 text-[#C9A45C]" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-8">
                {content.services.services.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-6 bg-[#F8F4EE] border border-[#5A1833]/20 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-wider">
                        Service #{index + 1}
                      </span>
                      {content.services.services.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${service.title}?`)) {
                              setContent({
                                ...content,
                                services: {
                                  ...content.services,
                                  services: content.services.services.filter(s => s.id !== service.id)
                                }
                              });
                              setHasUnsavedChanges(true);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = content.services.services.map(s =>
                              s.id === service.id ? { ...s, title: e.target.value } : s
                            );
                            setContent({ ...content, services: { ...content.services, services: updated } });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                          Short Description (Card view)
                        </label>
                        <input
                          type="text"
                          value={service.shortDesc}
                          onChange={(e) => {
                            const updated = content.services.services.map(s =>
                              s.id === service.id ? { ...s, shortDesc: e.target.value } : s
                            );
                            setContent({ ...content, services: { ...content.services, services: updated } });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                        Full Description (Detailed view)
                      </label>
                      <textarea
                        rows={2}
                        value={service.fullDesc}
                        onChange={(e) => {
                          const updated = content.services.services.map(s =>
                            s.id === service.id ? { ...s, fullDesc: e.target.value } : s
                          );
                          setContent({ ...content, services: { ...content.services, services: updated } });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs resize-none"
                      />
                    </div>

                    {/* Image */}
                    <ImageUploader
                      label={`${service.title} Photo`}
                      currentImage={service.image}
                      onImageChange={(newImg) => {
                        const updated = content.services.services.map(s =>
                          s.id === service.id ? { ...s, image: newImg } : s
                        );
                        setContent({ ...content, services: { ...content.services, services: updated } });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACADEMY */}
          {activeTab === 'academy' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                    ACADEMY & EDUCATION
                  </span>
                  <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                    Training Curriculum & Modules
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const newMod: AcademyModule = {
                      id: `mod-${Date.now()}`,
                      title: 'New Academy Module',
                      description: 'Comprehensive instruction on fashion topics.',
                      skillsGained: ['Practical skill 1', 'Practical skill 2'],
                      level: 'All'
                    };
                    setContent({
                      ...content,
                      academy: {
                        ...content.academy,
                        modules: [...content.academy.modules, newMod]
                      }
                    });
                    setHasUnsavedChanges(true);
                  }}
                  className="px-4 py-2 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-colors flex items-center gap-2 self-start"
                >
                  <Plus className="w-4 h-4 text-[#C9A45C]" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Page Main Heading
                  </label>
                  <input
                    type="text"
                    value={content.academy.title}
                    onChange={(e) => updateAcademyPageField('title', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#191719]/80 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={content.academy.subtitle}
                    onChange={(e) => updateAcademyPageField('subtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F4EE] border border-[#5A1833]/20 text-xs"
                  />
                </div>
              </div>

              {/* Modules list */}
              <div className="space-y-6 pt-2">
                {content.academy.modules.map((mod, index) => (
                  <div
                    key={mod.id}
                    className="p-6 bg-[#F8F4EE] border border-[#5A1833]/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-wider">
                        Module #{index + 1}
                      </span>
                      {content.academy.modules.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete module ${mod.title}?`)) {
                              setContent({
                                ...content,
                                academy: {
                                  ...content.academy,
                                  modules: content.academy.modules.filter(m => m.id !== mod.id)
                                }
                              });
                              setHasUnsavedChanges(true);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                          Module Title
                        </label>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => {
                            const updated = content.academy.modules.map(m =>
                              m.id === mod.id ? { ...m, title: e.target.value } : m
                            );
                            setContent({ ...content, academy: { ...content.academy, modules: updated } });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                          Skill Level
                        </label>
                        <select
                          value={mod.level}
                          onChange={(e) => {
                            const updated = content.academy.modules.map(m =>
                              m.id === mod.id ? { ...m, level: e.target.value } : m
                            );
                            setContent({ ...content, academy: { ...content.academy, modules: updated } });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                        Module Description
                      </label>
                      <textarea
                        rows={2}
                        value={mod.description}
                        onChange={(e) => {
                          const updated = content.academy.modules.map(m =>
                            m.id === mod.id ? { ...m, description: e.target.value } : m
                          );
                          setContent({ ...content, academy: { ...content.academy, modules: updated } });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#5A1833]/20 text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY & CONTACT */}
          {activeTab === 'galleryContact' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                    EDITORIAL GALLERY
                  </span>
                  <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                    Manage Portfolio Works
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const newItem: GalleryItem = {
                      id: `gal-${Date.now()}`,
                      title: 'New Fashion Look',
                      category: 'Couture',
                      image: '/src/assets/images/gallery_item_1_1791780266740.jpg',
                      caption: 'Created in Jos atelier.'
                    };
                    setContent({
                      ...content,
                      galleryContact: {
                        ...content.galleryContact,
                        items: [...content.galleryContact.items, newItem]
                      }
                    });
                    setHasUnsavedChanges(true);
                  }}
                  className="px-4 py-2 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] transition-colors flex items-center gap-2 self-start"
                >
                  <Plus className="w-4 h-4 text-[#C9A45C]" />
                  <span>Add Gallery Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.galleryContact.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#F8F4EE] border border-[#5A1833]/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C9A45C] uppercase tracking-wider">
                        Item #{index + 1}
                      </span>
                      {content.galleryContact.items.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${item.title}?`)) {
                              setContent({
                                ...content,
                                galleryContact: {
                                  ...content.galleryContact,
                                  items: content.galleryContact.items.filter(i => i.id !== item.id)
                                }
                              });
                              setHasUnsavedChanges(true);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = content.galleryContact.items.map(i =>
                            i.id === item.id ? { ...i, title: e.target.value } : i
                          );
                          setContent({ ...content, galleryContact: { ...content.galleryContact, items: updated } });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                          Category
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = content.galleryContact.items.map(i =>
                              i.id === item.id ? { ...i, category: e.target.value as any } : i
                            );
                            setContent({ ...content, galleryContact: { ...content.galleryContact, items: updated } });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs"
                        >
                          <option value="Couture">Couture</option>
                          <option value="Bespoke">Bespoke</option>
                          <option value="Academy">Academy</option>
                          <option value="Fabric & Detail">Fabric & Detail</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#191719]/70 mb-1">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => {
                            const updated = content.galleryContact.items.map(i =>
                              i.id === item.id ? { ...i, caption: e.target.value } : i
                            );
                            setContent({ ...content, galleryContact: { ...content.galleryContact, items: updated } });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-[#5A1833]/20 text-xs"
                        />
                      </div>
                    </div>

                    <ImageUploader
                      label="Item Image"
                      currentImage={item.image}
                      onImageChange={(newImg) => {
                        const updated = content.galleryContact.items.map(i =>
                          i.id === item.id ? { ...i, image: newImg } : i
                        );
                        setContent({ ...content, galleryContact: { ...content.galleryContact, items: updated } });
                        setHasUnsavedChanges(true);
                      }}
                      aspectRatio="aspect-[4/5]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: INQUIRIES & LEADS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
                    CLIENT INQUIRIES
                  </span>
                  <h3 className="font-editorial text-3xl font-bold text-[#5A1833]">
                    Consultations & Leads
                  </h3>
                </div>

                <button
                  onClick={async () => {
                    const inqs = await getInquiries();
                    setInquiries(inqs);
                    showFeedback('success', 'Inquiries refreshed.');
                  }}
                  className="p-2 bg-[#5A1833]/10 text-[#5A1833] hover:bg-[#5A1833]/20 transition-colors"
                  title="Refresh inquiries"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 bg-[#F8F4EE] border border-[#5A1833]/15 space-y-2">
                  <Mail className="w-8 h-8 text-[#5A1833]/40 mx-auto" />
                  <p className="text-sm font-semibold text-[#5A1833]">No inquiries received yet.</p>
                  <p className="text-xs text-[#191719]/60">
                    Form submissions through the consultation modal and contact page will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => {
                    const whatsappDirect = `https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.fullName)},%20thank%20you%20for%20contacting%20Shiks%20Fashion%20regarding%20${encodeURIComponent(inq.enquiryType)}...`;
                    return (
                      <div
                        key={inq.id}
                        className="p-5 bg-[#F8F4EE] border border-[#5A1833]/20 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#5A1833]/10 pb-3">
                          <div>
                            <span className="font-editorial text-xl font-bold text-[#5A1833] block">
                              {inq.fullName}
                            </span>
                            <span className="text-[11px] text-[#191719]/60">
                              {new Date(inq.createdAt).toLocaleString()} · Type: <strong>{inq.enquiryType}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatus(inq.id, e.target.value as any)}
                              className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider rounded-sm ${
                                inq.status === 'new'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : inq.status === 'reviewed'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="contacted">Contacted</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-[#191719]/80 leading-relaxed bg-white p-3 border border-[#5A1833]/10">
                          {inq.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <a
                            href={`tel:${inq.phone.replace(/\s+/g, '')}`}
                            className="px-3 py-1.5 bg-[#5A1833] text-[#F8F4EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#431225] flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
                            <span>Call: {inq.phone}</span>
                          </a>

                          <a
                            href={whatsappDirect}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#C9A45C] text-[#5A1833] text-xs font-semibold uppercase tracking-wider hover:bg-[#b8934f] flex items-center gap-1.5"
                          >
                            <span>WhatsApp Client</span>
                          </a>

                          {inq.email && (
                            <a
                              href={`mailto:${inq.email}`}
                              className="text-xs text-[#5A1833] hover:underline"
                            >
                              Email: {inq.email}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
