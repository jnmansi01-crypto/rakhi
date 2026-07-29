// lib/storage.ts
// localStorage-first storage with optional Firebase (lazy-loaded when configured)

import type { RakhiExperience, ExperienceDraft } from './types';

export const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// ─── ID generator ────────────────────────────────────────────
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── Firebase lazy helpers ────────────────────────────────────
// Firebase modules are imported dynamically so they never execute on the server.
async function fbGet(id: string): Promise<RakhiExperience | null> {
  try {
    const { db } = await import('./firebase');
    if (!db) return null;
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'experiences', id));
    return snap.exists() ? (snap.data() as RakhiExperience) : null;
  } catch {
    return null;
  }
}

async function fbSet(id: string, data: RakhiExperience) {
  const { db } = await import('./firebase');
  if (!db) return;
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  
  const setPromise = setDoc(doc(db, 'experiences', id), { ...data, createdAt: serverTimestamp() });
  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Firebase timeout')), 60000)
  );
  
  await Promise.race([setPromise, timeoutPromise]);
}

async function fbUpdate(id: string, fields: Partial<RakhiExperience>) {
  const { db } = await import('./firebase');
  if (!db) return;
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'experiences', id), fields);
}

// ─── Public API ───────────────────────────────────────────────

export async function createExperience(draft: ExperienceDraft): Promise<string> {
  const id = generateId();
  const now = Date.now();

  if (!isFirebaseConfigured) {
    throw new Error('DATABASE_UNAVAILABLE');
  }

  let creatorUid: string | null = null;
  try {
    const { auth } = await import('./firebase');
    if (auth) {
      const { signInAnonymously } = await import('firebase/auth');
      
      const authPromise = signInAnonymously(auth);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Firebase Auth timeout')), 60000)
      );
      
      const userCredential = await Promise.race([authPromise, timeoutPromise]) as any;
      creatorUid = userCredential.user.uid;
    }
  } catch (err: any) {
    console.error('Anonymous auth failed:', err);
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error(`Failed to reach Firebase Auth (Network error or Ad-blocker).`);
    }
  }

  const experience: RakhiExperience & { creatorUid?: string | null } = { 
    ...draft, id, createdAt: now, openedAt: null, creatorUid 
  };

  try {
    await fbSet(id, experience);
  } catch (err) {
    console.error('Firestore write failed:', err);
    throw new Error('DATABASE_UNAVAILABLE');
  }
  return id;
}

export async function getExperience(id: string): Promise<RakhiExperience | null> {
  if (isFirebaseConfigured) {
    return fbGet(id);
  }
  return null;
}

export async function markOpened(id: string): Promise<void> {
  if (isFirebaseConfigured) {
    await fbUpdate(id, { openedAt: Date.now() } as Partial<RakhiExperience>);
  }
}

export async function saveReply(id: string, message: string): Promise<void> {
  if (isFirebaseConfigured) {
    await fbUpdate(id, { replyMessage: message } as Partial<RakhiExperience>);
  }
}


