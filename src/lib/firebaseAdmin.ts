import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminDb() {
  if (!getApps().length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
      // Only initialize if we have a project_id or something indicating a real key
      if (Object.keys(serviceAccount).length > 0) {
        initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is empty. Firebase Admin not initialized.');
        return null;
      }
    } catch (error) {
      console.error('Firebase admin initialization error', error);
      return null;
    }
  }
  return getFirestore();
}
