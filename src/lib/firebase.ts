// lib/firebase.ts
// Lazy Firebase init – NEVER imported at module level; always via dynamic import()
// This prevents the SSR crash: "Cannot find module './vendor-chunks/@firebase.js'"

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app:     FirebaseApp     | null = null;
let db:      Firestore       | null = null;
let storage: FirebaseStorage | null = null;
let auth:    Auth            | null = null;

if (isFirebaseConfigured) {
  app     = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db      = getFirestore(app);
  storage = getStorage(app);
  auth    = getAuth(app);
}

export { db, storage, auth };
