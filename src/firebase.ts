import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use experimentalAutoDetectLongPolling to ensure reliable connection inside iframes and sandboxes
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true
  },
  firebaseConfig.firestoreDatabaseId
);

let storageInstance: FirebaseStorage | null = null;
try {
  if (firebaseConfig.storageBucket) {
    storageInstance = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
    storageInstance.maxUploadRetryTime = 4000;
    storageInstance.maxOperationRetryTime = 4000;
  }
} catch (e) {
  console.warn('Firebase Storage initialization optional fallback:', e);
}
export const storage = storageInstance;

export async function testConnection() {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout')), 2500)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeout
    ]);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status check:', error.message);
    }
    return false;
  }
}
