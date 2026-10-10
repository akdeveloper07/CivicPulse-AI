import { FirebaseApp } from 'firebase/app';
import { Auth, GoogleAuthProvider } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

export const app: FirebaseApp;
export const auth: Auth;
export const googleProvider: GoogleAuthProvider;
export const db: Firestore;
export const storage: FirebaseStorage;

export default app;
