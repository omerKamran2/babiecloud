// src/services/authHelpers.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

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

/**
 * Registers a new user and ensures a profile document exists
 */
export const registerUser = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
  const { uid } = credential.user;
  // Create user profile with default partner role
  await saveProfileIfMissing(uid, {
    email,
    createdAt: firestore.FieldValue.serverTimestamp(),
    role: 'partner',
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
  const ref = firestore().collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set(data);
  }
};
