// ============================================================
// Firebase Initialization — CivicPulse AI
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Read Firebase configuration from Vite environment variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBVM4VQUqojHBNPo5jRnxeFpi-eCfYYMO0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civicpulse-ai-767c3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civicpulse-ai-767c3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civicpulse-ai-767c3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "34205980625",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:34205980625:web:0fe0c4be5a9a75319672f0",
};

// Singleton pattern: prevent duplicate app initialization (safe for HMR)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication instance
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Cloud Firestore instance (required by existing application)
export const db = getFirestore(app);

// Firebase Storage instance (required by existing application)
export const storage = getStorage(app);

export default app;
