// ============================================================
// Firebase Configuration — CivicPulse AI (civicpulse-ai-767c3)
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBVM4VQUqojHBNPo5jRnxeFpi-eCfYYMO0",
  authDomain: "civicpulse-ai-767c3.firebaseapp.com",
  projectId: "civicpulse-ai-767c3",
  storageBucket: "civicpulse-ai-767c3.firebasestorage.app",
  messagingSenderId: "34205980625",
  appId: "1:34205980625:web:0fe0c4be5a9a75319672f0",
  measurementId: "G-6F0MNPENKD",
};

// Avoid duplicate app initialization (safe for Hot Module Replacement)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ── Auth ──────────────────────────────────────────────────────
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Firestore ─────────────────────────────────────────────────
export const db = getFirestore(app);

// ── Storage ───────────────────────────────────────────────────
export const storage = getStorage(app);

// ── Analytics (browser-only) ──────────────────────────────────
export const analyticsPromise = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
