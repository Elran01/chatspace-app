'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User as ChatSpaceUser } from '@/types/firebase';

// Auth context interface
interface AuthContextType {
  user: User | null;
  userProfile: ChatSpaceUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<ChatSpaceUser>) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<ChatSpaceUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register new user
  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with display name
      await updateProfile(credential.user, { displayName });

      // The user document will be created automatically by the Cloud Function trigger
      // But we can also create it here as a fallback
      const userDoc = {
        id: credential.user.uid,
        email: credential.user.email || '',
        displayName: displayName,
        photoURL: credential.user.photoURL || '',
        subscription: {
          plan: 'free' as const,
          status: 'active' as const,
          expiresAt: Timestamp.fromDate(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ), // 30 days
          customerId: '',
        },
        usage: {
          tokensUsed: 0,
          conversationsCount: 0,
          lastActive: Timestamp.now(),
          limits: {
            monthlyTokens: 10000,
            conversations: 50,
            projects: 5,
          },
        },
        preferences: {
          defaultModel: 'gpt-4' as const,
          theme: 'system' as const,
          canvasSettings: {
            autoSave: true,
            collaborativeEditing: true,
            aiAssistance: true,
            versionHistory: true,
          },
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'users', credential.user.uid), userDoc);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in...'); // Debug log
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user); // Debug log

      // Check if this is a new user and create profile if needed
      if (result.user) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
          console.log('Creating new user profile...'); // Debug log
          const newUserDoc = {
            id: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            subscription: {
              plan: 'free' as const,
              status: 'active' as const,
              expiresAt: Timestamp.fromDate(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              ),
              customerId: '',
            },
            usage: {
              tokensUsed: 0,
              conversationsCount: 0,
              lastActive: Timestamp.now(),
              limits: {
                monthlyTokens: 10000,
                conversations: 50,
                projects: 5,
              },
            },
            preferences: {
              defaultModel: 'gpt-4' as const,
              theme: 'system' as const,
              canvasSettings: {
                autoSave: true,
                collaborativeEditing: true,
                aiAssistance: true,
                versionHistory: true,
              },
            },
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };
          await setDoc(doc(db, 'users', result.user.uid), newUserDoc);
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      // Handle specific Firebase auth errors
      if (error instanceof Error) {
        if (error.message.includes('popup-closed-by-user')) {
          throw new Error('Sign-in was cancelled');
        } else if (error.message.includes('popup-blocked')) {
          throw new Error('Please allow popups for this site');
        } else if (error.message.includes('network-request-failed')) {
          throw new Error('Network error. Please check your connection');
        }
      }
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<ChatSpaceUser>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        { ...data, updatedAt: Timestamp.now() },
        { merge: true }
      );

      // Update local profile state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...data, updatedAt: Timestamp.now() });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as ChatSpaceUser;
        setUserProfile(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);

      if (user) {
        // Fetch user profile from Firestore
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
