// lib/storage.ts
// localStorage-first storage with optional Firebase (lazy-loaded when configured)

import type { RakhiExperience, ExperienceDraft } from '@/lib/types';

export const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// ─── ID generator ────────────────────────────────────────────
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── Firebase lazy helpers ────────────────────────────────────
async function fbGet(id: string): Promise<RakhiExperience | null> {
  try {
    const { db } = await import('./firebase');
    if (!db) return null;
    const { doc, getDoc } = await import('firebase/firestore');
    
    const getPromise = getDoc(doc(db, 'experiences', id));
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
    
    const snap = await Promise.race([getPromise, timeoutPromise]);
    return snap && snap.exists() ? (snap.data() as RakhiExperience) : null;
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
    setTimeout(() => reject(new Error('Firebase timeout')), 8000)
  );
  
  await Promise.race([setPromise, timeoutPromise]);
}

async function fbUpdate(id: string, fields: Partial<RakhiExperience>) {
  try {
    const { db } = await import('./firebase');
    if (!db) return;
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'experiences', id), fields);
  } catch (e) {
    console.warn('Firebase update skipped:', e);
  }
}

// ─── Public API ───────────────────────────────────────────────

export async function createExperience(draft: ExperienceDraft): Promise<string> {
  const id = generateId();
  const now = Date.now();

  const experience: RakhiExperience = { 
    ...draft, id, createdAt: now, openedAt: null 
  };

  // Always store locally first for instant availability & offline resilience
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`rakhi_exp_${id}`, JSON.stringify(experience));
    } catch (e) {
      console.warn('localStorage set failed:', e);
    }
  }

  // Attempt Firebase sync if configured
  if (isFirebaseConfigured) {
    try {
      const { auth } = await import('./firebase');
      if (auth) {
        const { signInAnonymously } = await import('firebase/auth');
        const authPromise = signInAnonymously(auth);
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
        await Promise.race([authPromise, timeoutPromise]);
      }
      await fbSet(id, experience);
    } catch (err) {
      console.warn('Firestore write timed out or failed; falling back to local storage:', err);
    }
  }

  return id;
}

export async function getExperience(id: string): Promise<RakhiExperience | null> {
  let exp: RakhiExperience | null = null;

  if (isFirebaseConfigured) {
    exp = await fbGet(id);
  }

  // Fallback to localStorage if Firebase returned null or is offline
  if (!exp && typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(`rakhi_exp_${id}`);
      if (local) {
        exp = JSON.parse(local) as RakhiExperience;
      }
    } catch (e) {
      console.warn('localStorage get failed:', e);
    }
  }

  return exp;
}

export async function markOpened(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(`rakhi_exp_${id}`);
      if (local) {
        const parsed = JSON.parse(local);
        parsed.openedAt = Date.now();
        localStorage.setItem(`rakhi_exp_${id}`, JSON.stringify(parsed));
      }
    } catch (e) {}
  }

  if (isFirebaseConfigured) {
    await fbUpdate(id, { openedAt: Date.now() } as Partial<RakhiExperience>);
  }
}

export async function saveReply(id: string, message: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(`rakhi_exp_${id}`);
      if (local) {
        const parsed = JSON.parse(local);
        parsed.replyMessage = message;
        localStorage.setItem(`rakhi_exp_${id}`, JSON.stringify(parsed));
      }
    } catch (e) {}
  }

  if (isFirebaseConfigured) {
    await fbUpdate(id, { replyMessage: message } as Partial<RakhiExperience>);
  }
}
