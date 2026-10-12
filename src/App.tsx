/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Page, FullWebsiteContent } from './types';
import { initialWebsiteContent } from './data/content';
import { getPublishedContent } from './services/firestoreService';
import { testConnection } from './firebase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { Preloader } from './components/Preloader';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { FashionServices } from './pages/FashionServices';
import { Academy } from './pages/Academy';
import { GalleryContact } from './pages/GalleryContact';
import { AdminCenter } from './admin/AdminCenter';

// Unique, difficult-to-guess secret access route (no public links or login screen)
const SECRET_ADMIN_PATH = '/private-management-shiks-jos-7849x';

export default function App() {
  const [content, setContent] = useState<FullWebsiteContent>(initialWebsiteContent);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showPreloader, setShowPreloader] = useState<boolean>(() => {
    // Check if on admin route
    if (typeof window !== 'undefined') {
      const isAdmin =
        window.location.pathname === SECRET_ADMIN_PATH ||
        window.location.hash.includes('private-management-shiks-jos-7849x');
      if (isAdmin) return false;
    }
    return true;
  });
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname === SECRET_ADMIN_PATH ||
      window.location.hash.includes('private-management-shiks-jos-7849x')
    );
  });
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  // Load published content from Firestore on boot
  useEffect(() => {
    async function init() {
      try {
        testConnection().catch(() => {});
        const publishedData = await getPublishedContent();
        setContent(publishedData);
      } catch (err) {
        console.warn('Initial Firestore fetch warning:', err);
      }
    }
    init();

    // Listen to hash / URL changes for secret admin access
    const handleUrlChange = () => {
      const isSecretRoute =
        window.location.pathname === SECRET_ADMIN_PATH ||
        window.location.hash.includes('private-management-shiks-jos-7849x');
      setIsAdminView(isSecretRoute);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleReturnToWebsite = () => {
    if (window.location.pathname === SECRET_ADMIN_PATH) {
      window.history.pushState(null, '', '/');
    }
    if (window.location.hash.includes('private-management-shiks-jos-7849x')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContentPublished = (newContent: FullWebsiteContent) => {
    setContent(newContent);
  };

  // If secret Admin route is accessed, render the Admin Center directly without a login screen
  if (isAdminView) {
    return (
      <AdminCenter
        onReturnToWebsite={handleReturnToWebsite}
        onContentPublished={handleContentPublished}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={setCurrentPage}
            onOpenConsultation={() => setConsultationModalOpen(true)}
            content={content}
          />
        );
      case 'about':
        return (
          <About
            setCurrentPage={setCurrentPage}
            onOpenConsultation={() => setConsultationModalOpen(true)}
            content={content}
          />
        );
      case 'services':
        return (
          <FashionServices
            setCurrentPage={setCurrentPage}
            onOpenConsultation={() => setConsultationModalOpen(true)}
            content={content}
          />
        );
      case 'academy':
        return (
          <Academy
            setCurrentPage={setCurrentPage}
            onOpenConsultation={() => setConsultationModalOpen(true)}
            content={content}
          />
        );
      case 'gallery-contact':
        return (
          <GalleryContact
            setCurrentPage={setCurrentPage}
            content={content}
          />
        );
      default:
        return (
          <Home
            setCurrentPage={setCurrentPage}
            onOpenConsultation={() => setConsultationModalOpen(true)}
            content={content}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#191719] flex flex-col font-sans selection:bg-[#5A1833] selection:text-[#F8F4EE]">
      {/* Premium 3-second Loading Page */}
      {showPreloader && (
        <Preloader
          onComplete={() => setShowPreloader(false)}
          brandName={content.settings.shortName}
          tagline={content.settings.tagline}
        />
      )}

      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenConsultation={() => setConsultationModalOpen(true)}
        settings={content.settings}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer
        setCurrentPage={setCurrentPage}
        onOpenConsultation={() => setConsultationModalOpen(true)}
        settings={content.settings}
      />

      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        settings={content.settings}
      />
    </div>
  );
}
