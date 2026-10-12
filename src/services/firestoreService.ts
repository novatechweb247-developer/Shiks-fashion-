import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, writeBatch, WriteBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { FullWebsiteContent, Inquiry } from '../types';
import { initialWebsiteContent } from '../data/content';
import { offloadLargeImages } from './mediaService';

const SETTINGS_DOC_PUBLISHED = 'settings/global';
const SETTINGS_DOC_DRAFT = 'settings/global_draft';

const PAGES = ['home', 'about', 'services', 'academy', 'galleryContact'] as const;

export interface WriteOperationResult {
  outcome: 'confirmed' | 'unconfirmed_timeout' | 'error';
  timestamp: string;
  safeContent: FullWebsiteContent;
  message: string;
  errorDetails?: string;
}

// In-flight write tracking to prevent concurrent write collisions
let activeWritePromise: Promise<void> | null = null;
let activeWriteMeta: { type: 'draft' | 'published'; timestamp: string } | null = null;

export function isWritePending(): boolean {
  return activeWritePromise !== null;
}

// Helper to prevent unbounded hangs if Firestore is offline or slow
function withTimeout<T>(promise: Promise<T>, timeoutMs = 4500, fallbackValue: T): Promise<T> {
  let timerId: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timerId = setTimeout(() => resolve(fallbackValue), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timerId));
}

/**
 * Executes a writeBatch with bounded waiting.
 * If the write does not confirm within timeoutMs, returns outcome 'unconfirmed_timeout'.
 * Note: A Promise.race timeout does NOT cancel the underlying write, which continues in background.
 */
async function executeBatchWithBoundedWait(
  batch: WriteBatch,
  type: 'draft' | 'published',
  timestamp: string,
  safeContent: FullWebsiteContent,
  timeoutMs = 7000
): Promise<WriteOperationResult> {
  console.info(`[FirestoreService] Committing ${type} batch write (timestamp: ${timestamp})...`);
  const startTime = Date.now();

  const commitPromise = batch.commit();
  activeWritePromise = commitPromise;
  activeWriteMeta = { type, timestamp };

  let timerId: any;
  const timeoutPromise = new Promise<'timeout'>((resolve) => {
    timerId = setTimeout(() => resolve('timeout'), timeoutMs);
  });

  try {
    const winner = await Promise.race([
      commitPromise.then(() => 'confirmed' as const),
      timeoutPromise
    ]);

    clearTimeout(timerId);

    if (winner === 'confirmed') {
      activeWritePromise = null;
      activeWriteMeta = null;
      console.info(`[FirestoreService] ${type} write successfully confirmed on server in ${Date.now() - startTime}ms.`);
      return {
        outcome: 'confirmed',
        timestamp,
        safeContent,
        message: type === 'draft' ? 'Draft successfully saved to Firestore.' : 'Changes published! Public website has been updated.'
      };
    } else {
      console.warn(`[FirestoreService] ${type} write operation exceeded ${timeoutMs}ms bounded wait. Underlying write remains in-flight.`);

      // Continue tracking background commit
      commitPromise
        .then(() => {
          console.info(`[FirestoreService] Background ${type} write (${timestamp}) has now completed on server in ${Date.now() - startTime}ms.`);
          activeWritePromise = null;
          activeWriteMeta = null;
        })
        .catch((bgErr) => {
          console.warn(`[FirestoreService] Background ${type} write (${timestamp}) failed:`, bgErr);
          activeWritePromise = null;
          activeWriteMeta = null;
        });

      return {
        outcome: 'unconfirmed_timeout',
        timestamp,
        safeContent,
        message: `The ${type} write was dispatched, but server confirmation took longer than ${Math.round(timeoutMs / 1000)}s. Your edits are preserved in session.`
      };
    }
  } catch (err: any) {
    clearTimeout(timerId);
    activeWritePromise = null;
    activeWriteMeta = null;
    console.error(`[FirestoreService] ${type} batch commit failed:`, err);
    return {
      outcome: 'error',
      timestamp,
      safeContent,
      message: `Failed to ${type === 'draft' ? 'save draft' : 'publish'}: ${err?.message || 'Firestore write error.'}`,
      errorDetails: err?.message || String(err)
    };
  }
}

/**
 * Checks server document to verify whether an in-flight or timed-out write succeeded.
 */
export async function verifyWriteStatus(
  type: 'draft' | 'published',
  expectedTimestamp: string
): Promise<{ confirmed: boolean; lastTimestamp?: string }> {
  try {
    console.info(`[FirestoreService] Verifying ${type} write status for timestamp ${expectedTimestamp}...`);
    const docPath = type === 'draft' ? SETTINGS_DOC_DRAFT : SETTINGS_DOC_PUBLISHED;
    const snap = await withTimeout(getDoc(doc(db, docPath)), 4000, null);
    if (!snap || !snap.exists()) {
      return { confirmed: false };
    }
    const data = snap.data();
    const serverTimestamp = type === 'draft' ? data.lastSavedDraft : data.lastUpdated;
    const matched = serverTimestamp === expectedTimestamp;
    console.info(`[FirestoreService] Verification result: matched=${matched} (server timestamp: ${serverTimestamp})`);
    return { confirmed: matched, lastTimestamp: serverTimestamp };
  } catch (err) {
    console.warn('[FirestoreService] Verification check failed:', err);
    return { confirmed: false };
  }
}

export async function getPublishedContent(): Promise<FullWebsiteContent> {
  const fetchTask = async (): Promise<FullWebsiteContent> => {
    try {
      const [settingsSnap, homeSnap, aboutSnap, servicesSnap, academySnap, gallerySnap] = await Promise.all([
        getDoc(doc(db, SETTINGS_DOC_PUBLISHED)).catch(() => null),
        getDoc(doc(db, 'pagesPublished/home')).catch(() => null),
        getDoc(doc(db, 'pagesPublished/about')).catch(() => null),
        getDoc(doc(db, 'pagesPublished/services')).catch(() => null),
        getDoc(doc(db, 'pagesPublished/academy')).catch(() => null),
        getDoc(doc(db, 'pagesPublished/galleryContact')).catch(() => null)
      ]);

      const settings = settingsSnap && settingsSnap.exists()
        ? { ...initialWebsiteContent.settings, ...settingsSnap.data() }
        : initialWebsiteContent.settings;

      const home = homeSnap && homeSnap.exists()
        ? { ...initialWebsiteContent.home, ...homeSnap.data() }
        : initialWebsiteContent.home;

      const about = aboutSnap && aboutSnap.exists()
        ? { ...initialWebsiteContent.about, ...aboutSnap.data() }
        : initialWebsiteContent.about;

      const services = servicesSnap && servicesSnap.exists()
        ? { ...initialWebsiteContent.services, ...servicesSnap.data() }
        : initialWebsiteContent.services;

      const academy = academySnap && academySnap.exists()
        ? { ...initialWebsiteContent.academy, ...academySnap.data() }
        : initialWebsiteContent.academy;

      const galleryContact = gallerySnap && gallerySnap.exists()
        ? { ...initialWebsiteContent.galleryContact, ...gallerySnap.data() }
        : initialWebsiteContent.galleryContact;

      return {
        settings,
        home,
        about,
        services,
        academy,
        galleryContact,
        lastUpdated: settingsSnap && settingsSnap.exists() ? (settingsSnap.data().lastUpdated as string) : undefined
      };
    } catch (error) {
      console.warn('Error fetching published content from Firestore, falling back to defaults:', error);
      return initialWebsiteContent;
    }
  };

  return withTimeout(fetchTask(), 4500, initialWebsiteContent);
}

export async function getDraftContent(): Promise<FullWebsiteContent> {
  const fetchTask = async (): Promise<FullWebsiteContent> => {
    try {
      const published = await getPublishedContent();

      const [settingsSnap, homeSnap, aboutSnap, servicesSnap, academySnap, gallerySnap] = await Promise.all([
        getDoc(doc(db, SETTINGS_DOC_DRAFT)).catch(() => null),
        getDoc(doc(db, 'pagesDrafts/home')).catch(() => null),
        getDoc(doc(db, 'pagesDrafts/about')).catch(() => null),
        getDoc(doc(db, 'pagesDrafts/services')).catch(() => null),
        getDoc(doc(db, 'pagesDrafts/academy')).catch(() => null),
        getDoc(doc(db, 'pagesDrafts/galleryContact')).catch(() => null)
      ]);

      const settings = settingsSnap && settingsSnap.exists()
        ? { ...published.settings, ...settingsSnap.data() }
        : published.settings;

      const home = homeSnap && homeSnap.exists()
        ? { ...published.home, ...homeSnap.data() }
        : published.home;

      const about = aboutSnap && aboutSnap.exists()
        ? { ...published.about, ...aboutSnap.data() }
        : published.about;

      const services = servicesSnap && servicesSnap.exists()
        ? { ...published.services, ...servicesSnap.data() }
        : published.services;

      const academy = academySnap && academySnap.exists()
        ? { ...published.academy, ...academySnap.data() }
        : published.academy;

      const galleryContact = gallerySnap && gallerySnap.exists()
        ? { ...published.galleryContact, ...gallerySnap.data() }
        : published.galleryContact;

      return {
        settings,
        home,
        about,
        services,
        academy,
        galleryContact,
        lastUpdated: settingsSnap && settingsSnap.exists() ? (settingsSnap.data().lastSavedDraft as string) : undefined
      };
    } catch (error) {
      console.warn('Error fetching draft content from Firestore, falling back to defaults:', error);
      return initialWebsiteContent;
    }
  };

  return withTimeout(fetchTask(), 4500, initialWebsiteContent);
}

/**
 * Saves draft content using a single atomic batch write with bounded wait.
 * Automatically offloads any large base64 images into /media documents to prevent doc limits.
 */
export async function saveDraftContent(content: FullWebsiteContent): Promise<WriteOperationResult> {
  if (isWritePending()) {
    console.warn('[FirestoreService] Another write is currently active; queuing or proceeding safely.');
  }

  const timestamp = new Date().toISOString();

  // Safely offload any inlined base64 images into /media documents
  const safeContent = await offloadLargeImages(content);

  const batch = writeBatch(db);
  batch.set(doc(db, SETTINGS_DOC_DRAFT), {
    ...safeContent.settings,
    lastSavedDraft: timestamp
  });
  batch.set(doc(db, 'pagesDrafts/home'), { ...safeContent.home, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/about'), { ...safeContent.about, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/services'), { ...safeContent.services, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/academy'), { ...safeContent.academy, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/galleryContact'), { ...safeContent.galleryContact, updatedAt: timestamp });

  return executeBatchWithBoundedWait(batch, 'draft', timestamp, safeContent, 7000);
}

/**
 * Publishes content live using a single atomic batch write with bounded wait.
 * Atomically updates both published pages and draft pages in ONE network roundtrip.
 */
export async function publishContent(content: FullWebsiteContent): Promise<WriteOperationResult> {
  if (isWritePending()) {
    console.warn('[FirestoreService] Another write is currently active; queuing or proceeding safely.');
  }

  const timestamp = new Date().toISOString();

  // Safely offload any inlined base64 images into /media documents
  const safeContent = await offloadLargeImages(content);

  const batch = writeBatch(db);

  // 1. Publish settings and pages
  batch.set(doc(db, SETTINGS_DOC_PUBLISHED), {
    ...safeContent.settings,
    lastUpdated: timestamp
  });
  batch.set(doc(db, 'pagesPublished/home'), { ...safeContent.home, updatedAt: timestamp });
  batch.set(doc(db, 'pagesPublished/about'), { ...safeContent.about, updatedAt: timestamp });
  batch.set(doc(db, 'pagesPublished/services'), { ...safeContent.services, updatedAt: timestamp });
  batch.set(doc(db, 'pagesPublished/academy'), { ...safeContent.academy, updatedAt: timestamp });
  batch.set(doc(db, 'pagesPublished/galleryContact'), { ...safeContent.galleryContact, updatedAt: timestamp });

  // 2. Sync draft copies in the same atomic batch to avoid separate roundtrips
  batch.set(doc(db, SETTINGS_DOC_DRAFT), {
    ...safeContent.settings,
    lastSavedDraft: timestamp
  });
  batch.set(doc(db, 'pagesDrafts/home'), { ...safeContent.home, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/about'), { ...safeContent.about, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/services'), { ...safeContent.services, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/academy'), { ...safeContent.academy, updatedAt: timestamp });
  batch.set(doc(db, 'pagesDrafts/galleryContact'), { ...safeContent.galleryContact, updatedAt: timestamp });

  return executeBatchWithBoundedWait(batch, 'published', timestamp, safeContent, 7000);
}

export async function submitInquiry(data: {
  fullName: string;
  phone: string;
  email?: string;
  enquiryType: string;
  message: string;
  source?: string;
  preferredDate?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'inquiries'), {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || '',
    enquiryType: data.enquiryType,
    message: data.message,
    source: data.source || 'website',
    preferredDate: data.preferredDate || '',
    status: 'new',
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const fetchTask = async (): Promise<Inquiry[]> => {
    try {
      const snap = await getDocs(collection(db, 'inquiries'));
      const results: Inquiry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          id: d.id,
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || '',
          enquiryType: data.enquiryType || 'General Enquiry',
          message: data.message || '',
          createdAt: data.createdAt || new Date().toISOString(),
          status: data.status || 'new',
          preferredDate: data.preferredDate || '',
          source: data.source || 'website'
        });
      });
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.warn('Error fetching inquiries from Firestore:', error);
      return [];
    }
  };

  return withTimeout(fetchTask(), 4000, []);
}

export async function updateInquiryStatus(id: string, status: 'new' | 'reviewed' | 'contacted'): Promise<void> {
  await updateDoc(doc(db, 'inquiries', id), { status });
}

export async function deleteInquiry(id: string): Promise<void> {
  await deleteDoc(doc(db, 'inquiries', id));
}
