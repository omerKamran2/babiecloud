// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  * as firebaseAuth from "firebase/auth";
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
  appId: "1:701839071709:web:cd30f0e6bb9fa586a1fe34"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);


export const FIREBASE_AUTH = firebaseAuth.initializeAuth(FIREBASE_APP, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage)
});