// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn9RAOOgPJZD9YzvGxcBpVkPLm_jFy6NQ",
  authDomain: "babiecloud-216c2.firebaseapp.com",
  projectId: "babiecloud-216c2",
  storageBucket: "babiecloud-216c2.firebasestorage.app",
  messagingSenderId: "701839071709",
  appId: "1:701839071709:web:a0ceedf2e4cb1a48a1fe34"
};

// Initialize Firebase App (avoid re-init)
const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const FIREBASE_APP = firebaseApp;

// Initialize Auth with persistence; if already initialized, fall back to existing
let authInstance: firebaseAuth.Auth;
try {
  authInstance = firebaseAuth.initializeAuth(firebaseApp, {
    persistence: reactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e: any) {
  authInstance = firebaseAuth.getAuth(firebaseApp);
}
export const FIREBASE_AUTH = authInstance;
export const FIRESTORE_DB = getFirestore(firebaseApp);