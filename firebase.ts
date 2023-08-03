"use client";
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
type firebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

const firebaseConfig: firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps[0];
}
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
// const analytics = getAnalytics(app);
