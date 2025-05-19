import * as firebaseAuth from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Sign in with email and password
 */
export const signInWithEmail = (email: string, password: string) =>
  firebaseAuth.signInWithEmailAndPassword(FIREBASE_AUTH, email, password);

/**
 * Register a new user with email and password
 */
export const registerWithEmail = (email: string, password: string) =>
  firebaseAuth.createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

/**
 * Send a password reset email
 */
export const sendPasswordReset = (email: string) =>
  firebaseAuth.sendPasswordResetEmail(FIREBASE_AUTH, email);

/**
 * Sign out the current user
 */
export const signOut = () => firebaseAuth.signOut(FIREBASE_AUTH);

/**
 * Registers a new user in Auth and writes full profile to Firestore
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: 'partner' | 'support',
  linkedTo?: string
) => {
  const credential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
  const { uid } = credential.user;
  const userRef = doc(FIRESTORE_DB, 'users', uid);
  await setDoc(userRef, {
    uid,
    name,
    email,
    role,
    linkedTo: linkedTo?.trim() || null,
    profilePhotoUrl: null,
    notificationsEnabled: true,
    createdAt: serverTimestamp(),
  });
  return credential;
};

/**
 * Ensures /users/{uid} doc exists
 */
export const saveProfileIfMissing = async (
  uid: string,
  data: Record<string, any>
) => {
  const ref = doc(FIRESTORE_DB, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, data);
  }
};

export const firebaseErrorToMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is badly formatted.';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'The password is incorrect.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Additional auth helpers
// export { registerUser, firebaseErrorToMessage } from './authHelpers';
