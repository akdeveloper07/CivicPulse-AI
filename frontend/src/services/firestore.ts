// ============================================================
// Firebase Firestore service — real-time reports & activity
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ── Types ─────────────────────────────────────────────────────
export interface FirestoreReport {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  userId: string;
  userEmail: string;
  location?: { lat: number; lng: number; address?: string };
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ActivityLog {
  id?: string;
  action: string;
  userId: string;
  userEmail: string;
  reportId?: string;
  details?: string;
  createdAt?: Timestamp;
}

// ── Reports Collection ────────────────────────────────────────
export const reportsRef = collection(db, 'reports');
export const activityRef = collection(db, 'activity_logs');
export const analyticsRef = collection(db, 'analytics_snapshots');

/** Add a new report to Firestore */
export async function addFirestoreReport(data: Omit<FirestoreReport, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(reportsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Get all reports (optionally filter by userId) */
export async function getFirestoreReports(userId?: string) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(100)];
  if (userId) constraints.unshift(where('userId', '==', userId));
  const q = query(reportsRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreReport));
}

/** Get a single report by ID */
export async function getFirestoreReportById(id: string) {
  const snap = await getDoc(doc(db, 'reports', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as FirestoreReport) : null;
}

/** Update report status */
export async function updateReportStatus(id: string, status: string) {
  return updateDoc(doc(db, 'reports', id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Real-time listener for reports */
export function subscribeToReports(
  callback: (reports: FirestoreReport[]) => void,
  userId?: string
) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(50)];
  if (userId) constraints.unshift(where('userId', '==', userId));
  const q = query(reportsRef, ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreReport)));
  });
}

// ── Activity Logs ─────────────────────────────────────────────
export async function logActivity(data: Omit<ActivityLog, 'id' | 'createdAt'>) {
  return addDoc(activityRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Real-time activity feed */
export function subscribeToActivity(callback: (logs: ActivityLog[]) => void) {
  const q = query(activityRef, orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog)));
  });
}

// ── Analytics Snapshots ───────────────────────────────────────
export async function saveAnalyticsSnapshot(data: Record<string, unknown>) {
  return addDoc(analyticsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}
