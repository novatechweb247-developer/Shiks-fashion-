import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';

// In-memory cache for resolved media to eliminate repetitive fetches
const mediaCache = new Map<string, string>();

// Map from data URL string to existing mediaId to prevent duplicate uploads of the same image
const dataUrlToMediaIdMap = new Map<string, string>();

/**
 * Resizes and compresses an image file to keep payload sizes lean and fast.
 */
export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Clean JPEG compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to race a promise against a timeout without unhandled rejections.
 */
function withBoundedWait<T>(promise: Promise<T>, timeoutMs: number, fallbackValue: T): Promise<T> {
  let timerId: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timerId = setTimeout(() => resolve(fallbackValue), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timerId));
}

/**
 * Uploads media with bounded waiting and fallback resilience:
 * 1. Checks if this image data URL was already uploaded/cached (prevents duplicate writes).
 * 2. Tries Firebase Cloud Storage with a 4s bounded timeout.
 * 3. Falls back to dedicated Firestore document in /media/{mediaId} with a 5s bounded timeout.
 * 4. Ensures the UI never hangs indefinitely; in-memory cache guarantees immediate rendering.
 */
export async function uploadMedia(file: File): Promise<string> {
  const startTime = Date.now();
  console.info(`[MediaService] Starting uploadMedia for "${file.name}" (${file.size} bytes)...`);

  const compressedDataUrl = await compressImage(file);

  // Check if identical data URL was already uploaded in this session
  if (dataUrlToMediaIdMap.has(compressedDataUrl)) {
    const existingId = dataUrlToMediaIdMap.get(compressedDataUrl)!;
    console.info(`[MediaService] Reusing existing media reference media:${existingId} (duplicate avoided).`);
    return `media:${existingId}`;
  }

  const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Store in local cache right away for immediate zero-latency rendering
  mediaCache.set(mediaId, compressedDataUrl);
  dataUrlToMediaIdMap.set(compressedDataUrl, mediaId);

  // Attempt 1: Cloud Storage with strict 4s bounded timeout
  if (storage) {
    try {
      const storageRef = ref(storage, `uploads/${mediaId}.jpg`);
      const uploadTask = uploadString(storageRef, compressedDataUrl, 'data_url').then(async () => {
        return await getDownloadURL(storageRef);
      });

      const downloadUrl = await withBoundedWait<string | null>(uploadTask, 4000, null);
      if (downloadUrl) {
        console.info(`[MediaService] Cloud Storage upload succeeded in ${Date.now() - startTime}ms.`);
        mediaCache.set(mediaId, downloadUrl);
        return downloadUrl;
      } else {
        console.info('[MediaService] Cloud Storage timed out (4s), falling back to Firestore media document.');
      }
    } catch (storageErr) {
      console.info(
        '[MediaService] Cloud Storage not available/permitted, falling back to Firestore media doc:',
        storageErr
      );
    }
  }

  // Attempt 2: Dedicated individual Firestore document in /media collection
  // Bounded to 5s so that offline or high-latency states do not hang the upload button indefinitely
  try {
    const writePromise = setDoc(doc(db, 'media', mediaId), {
      dataUrl: compressedDataUrl,
      name: file.name,
      size: compressedDataUrl.length,
      createdAt: new Date().toISOString()
    }).then(() => true);

    const writeSuccess = await withBoundedWait<boolean>(writePromise, 5000, false);
    if (writeSuccess) {
      console.info(`[MediaService] Media document media:${mediaId} written to Firestore in ${Date.now() - startTime}ms.`);
    } else {
      console.warn(`[MediaService] Firestore write for media:${mediaId} exceeded 5s bounded wait; background sync continuing.`);
    }
    // Return media:mediaId regardless because mediaCache holds the image locally
    return `media:${mediaId}`;
  } catch (firestoreErr) {
    console.error('[MediaService] Error writing media to Firestore:', firestoreErr);
    // Cached in memory, so return media reference
    return `media:${mediaId}`;
  }
}

/**
 * Resolves a media reference into an image source URL or Data URL.
 */
export async function resolveMediaUrl(src: string): Promise<string> {
  if (!src) return '';
  if (!src.startsWith('media:')) return src;

  const mediaId = src.replace('media:', '');

  if (mediaCache.has(mediaId)) {
    return mediaCache.get(mediaId)!;
  }

  try {
    // 3.5s bounded wait to avoid hanging page rendering if Firestore is slow
    const fetchDoc = getDoc(doc(db, 'media', mediaId));
    const snap = await withBoundedWait(fetchDoc, 3500, null);
    if (snap && snap.exists() && snap.data().dataUrl) {
      const dataUrl = snap.data().dataUrl as string;
      mediaCache.set(mediaId, dataUrl);
      return dataUrl;
    }
  } catch (err) {
    console.warn(`[MediaService] Failed to resolve media reference ${mediaId}:`, err);
  }

  return src;
}

/**
 * React Hook to transparently resolve `media:media_id` into a viewable URL.
 */
export function useResolvedMedia(src: string): string {
  const [resolved, setResolved] = useState<string>(() => {
    if (!src || !src.startsWith('media:')) return src;
    const mediaId = src.replace('media:', '');
    return mediaCache.get(mediaId) || src;
  });

  useEffect(() => {
    if (!src || !src.startsWith('media:')) {
      setResolved(src);
      return;
    }

    const mediaId = src.replace('media:', '');
    if (mediaCache.has(mediaId)) {
      setResolved(mediaCache.get(mediaId)!);
      return;
    }

    let isMounted = true;
    resolveMediaUrl(src).then((url) => {
      if (isMounted) setResolved(url);
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return resolved;
}

/**
 * Recursively inspects a data object and offloads any large Base64/DataURL images
 * into dedicated documents in the /media collection, replacing the field
 * with `media:media_id`.
 * 
 * Includes deduplication via dataUrlToMediaIdMap and parallel bounded execution
 * to prevent sequential hangs and redundant Firestore writes.
 */
export async function offloadLargeImages<T>(data: T): Promise<T> {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Collect all new image write tasks to run concurrently instead of blocking sequentially
  const pendingWrites: Promise<any>[] = [];
  let reusedCount = 0;
  let newCount = 0;

  async function processNode(node: any): Promise<any> {
    if (!node || typeof node !== 'object') {
      return node;
    }

    if (Array.isArray(node)) {
      const arrCopy = [];
      for (const item of node) {
        arrCopy.push(await processNode(item));
      }
      return arrCopy;
    }

    const objCopy: any = { ...node };

    for (const key of Object.keys(objCopy)) {
      const val = objCopy[key];
      if (typeof val === 'string' && val.startsWith('data:image/') && val.length > 8000) {
        // Check deduplication map
        if (dataUrlToMediaIdMap.has(val)) {
          const existingId = dataUrlToMediaIdMap.get(val)!;
          objCopy[key] = `media:${existingId}`;
          reusedCount++;
        } else {
          // Offload this large image into /media
          const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          mediaCache.set(mediaId, val);
          dataUrlToMediaIdMap.set(val, mediaId);
          objCopy[key] = `media:${mediaId}`;
          newCount++;

          const writeTask = withBoundedWait(
            setDoc(doc(db, 'media', mediaId), {
              dataUrl: val,
              size: val.length,
              createdAt: new Date().toISOString()
            }),
            5000,
            null
          ).catch((e) => {
            console.warn(`[MediaService] Could not persist offloaded image ${mediaId} to /media:`, e);
          });
          pendingWrites.push(writeTask);
        }
      } else if (val && typeof val === 'object') {
        objCopy[key] = await processNode(val);
      }
    }

    return objCopy;
  }

  const result = await processNode(data);

  if (pendingWrites.length > 0) {
    console.info(`[MediaService] offloadLargeImages: Writing ${newCount} new images (${reusedCount} reused) with bounded wait...`);
    await Promise.allSettled(pendingWrites);
  } else if (reusedCount > 0) {
    console.info(`[MediaService] offloadLargeImages: Reused ${reusedCount} existing media references with zero new writes.`);
  }

  return result;
}
