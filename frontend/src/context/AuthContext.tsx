import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { User, AuthResponse, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (data?: { email?: string; name?: string; picture?: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isCitizen: boolean;
  isAdmin: boolean;
  isSysAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('civicpulse_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const idToken = await fbUser.getIdToken();
          localStorage.setItem('civicpulse_token', idToken);
          setToken(idToken);

          // Determine role from local metadata, email, or stored preference
          const savedRole = (localStorage.getItem(`civicpulse_role_${fbUser.uid}`) as UserRole) || null;
          const defaultRole: UserRole = fbUser.email?.includes('admin') ? 'administrator' : 'citizen';
          const role: UserRole = savedRole || defaultRole;

          const civicUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Citizen',
            email: fbUser.email || '',
            role: role,
            is_active: true,
            created_at: fbUser.metadata.creationTime || new Date().toISOString(),
          };

          localStorage.setItem('civicpulse_current_user', JSON.stringify(civicUser));
          setUser(civicUser);
        } catch (error) {
          console.error('Failed to get Firebase user token:', error);
        }
      } else {
        setFirebaseUser(null);
        // Fallback: Check if demo user is stored in localStorage
        const storedUser = localStorage.getItem('civicpulse_current_user');
        const storedToken = localStorage.getItem('civicpulse_token');
        if (storedUser && storedToken && storedToken.startsWith('demo-')) {
          try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } catch {
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // 1. Attempt standard Firebase Authentication
      const cred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const idToken = await cred.user.getIdToken();
      localStorage.setItem('civicpulse_token', idToken);
      setToken(idToken);
      setFirebaseUser(cred.user);

      const savedRole = (localStorage.getItem(`civicpulse_role_${cred.user.uid}`) as UserRole) || null;
      const defaultRole: UserRole = cred.user.email?.includes('admin') ? 'administrator' : 'citizen';
      const role: UserRole = savedRole || defaultRole;

      const appUser: User = {
        id: cred.user.uid,
        name: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
        email: cred.user.email || credentials.email,
        role: role,
        is_active: true,
        created_at: cred.user.metadata.creationTime || new Date().toISOString(),
      };
      setUser(appUser);
      localStorage.setItem('civicpulse_current_user', JSON.stringify(appUser));
    } catch (fbError: any) {
      // If demo accounts are being tested before user creation in Firebase Console, fallback to mock demo
      const isDemoAccount =
        credentials.email === 'sysadmin@civicpulse.org' ||
        credentials.email === 'citizen@civicpulse.org' ||
        credentials.email === 'analyst@civicpulse.org';

      if (isDemoAccount) {
        console.warn('Firebase login failed for demo user; falling back to demo credentials:', fbError.message);
        const res: AuthResponse = await api.login(credentials);
        localStorage.setItem('civicpulse_token', res.access_token);
        setToken(res.access_token);
        setUser(res.user);
        return;
      }

      // Format clean, descriptive Firebase Auth error messages
      let friendlyMessage = fbError.message;
      if (fbError.code === 'auth/invalid-credential' || fbError.code === 'auth/wrong-password') {
        friendlyMessage = 'Invalid email or password. Please verify your credentials.';
      } else if (fbError.code === 'auth/user-not-found') {
        friendlyMessage = 'No account found with this email. Please register first.';
      } else if (fbError.code === 'auth/too-many-requests') {
        friendlyMessage = 'Too many failed login attempts. Please try again later.';
      } else if (fbError.code === 'auth/network-request-failed') {
        friendlyMessage = 'Network error: Unable to reach Firebase authentication servers.';
      }
      throw new Error(friendlyMessage);
    }
  };

  const loginWithGoogle = async (data?: { email?: string; name?: string; picture?: string }) => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      localStorage.setItem('civicpulse_token', idToken);
      setToken(idToken);
      setFirebaseUser(cred.user);

      const savedRole = (localStorage.getItem(`civicpulse_role_${cred.user.uid}`) as UserRole) || 'citizen';
      const appUser: User = {
        id: cred.user.uid,
        name: cred.user.displayName || data?.name || 'Citizen',
        email: cred.user.email || data?.email || '',
        role: savedRole,
        is_active: true,
        created_at: cred.user.metadata.creationTime || new Date().toISOString(),
      };
      setUser(appUser);
      localStorage.setItem('civicpulse_current_user', JSON.stringify(appUser));

      // Attempt to sync with backend if online
      try {
        await api.googleLogin({
          email: appUser.email,
          name: appUser.name,
          picture: cred.user.photoURL || undefined,
        });
      } catch (e) {
        // Safe to ignore if backend is in fallback mode
      }
    } catch (fbError: any) {
      if (fbError.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In was cancelled.');
      } else if (fbError.code === 'auth/popup-blocked') {
        throw new Error('Google Sign-In popup was blocked by the browser. Please allow popups.');
      } else if (fbError.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google Sign-In in Firebase Console.');
      }
      throw new Error(fbError.message || 'Google sign-in failed.');
    }
  };

  const register = async (data: { name: string; email: string; password: string; role?: string }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.name) {
        await updateProfile(cred.user, { displayName: data.name });
      }

      const role = (data.role as UserRole) || 'citizen';
      localStorage.setItem(`civicpulse_role_${cred.user.uid}`, role);

      const idToken = await cred.user.getIdToken();
      localStorage.setItem('civicpulse_token', idToken);
      setToken(idToken);
      setFirebaseUser(cred.user);

      const appUser: User = {
        id: cred.user.uid,
        name: data.name,
        email: data.email,
        role: role,
        is_active: true,
        created_at: cred.user.metadata.creationTime || new Date().toISOString(),
      };
      setUser(appUser);
      localStorage.setItem('civicpulse_current_user', JSON.stringify(appUser));

      // Attempt to notify backend
      try {
        await api.register(data);
      } catch (e) {
        // Backend fallback handles this
      }
    } catch (fbError: any) {
      let friendlyMessage = fbError.message;
      if (fbError.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email address already exists. Please sign in instead.';
      } else if (fbError.code === 'auth/weak-password') {
        friendlyMessage = 'Password should be at least 6 characters.';
      } else if (fbError.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      }
      throw new Error(friendlyMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase sign-out error:', error);
    } finally {
      localStorage.removeItem('civicpulse_token');
      localStorage.removeItem('civicpulse_current_user');
      setToken(null);
      setUser(null);
      setFirebaseUser(null);
    }
  };

  const isCitizen = user?.role === 'citizen';
  const isAdmin = user?.role === 'administrator' || user?.role === 'system_admin';
  const isSysAdmin = user?.role === 'system_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        firebaseUser,
        login,
        loginWithGoogle,
        register,
        logout,
        isCitizen,
        isAdmin,
        isSysAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
