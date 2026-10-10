// ============================================================
// Firebase Re-export Layer — CivicPulse AI
// Re-exports instances from src/firebase.js for consistency
// ============================================================

import { getAnalytics, isSupported } from 'firebase/analytics';
import { app, auth, googleProvider, db, storage } from '../firebase';

export { app, auth, googleProvider, db, storage };

// Analytics (browser-only)
export const analyticsPromise = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
