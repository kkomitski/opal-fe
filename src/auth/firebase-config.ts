import { initializeApp, getApp } from "firebase/app";
// import { getAnalytics } from 'firebase/analytics';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// let app;
// const {
//   NEXT_PUBLIC_API_KEY,
//   NEXT_PUBLIC_AUTH_DOM,
//   NEXT_PUBLIC_PROJECT_ID,
//   NEXT_PUBLIC_STORAGE_BUCKET,
//   NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   NEXT_PUBLIC_APP_ID,
//   NEXT_PUBLIC_MEASUREMENT_ID,
// } = process.env;

const NEXT_PUBLIC_API_KEY = "AIzaSyB6WBoXTV9OX61EMY0VVCh62QXr12z6pgY";
const NEXT_PUBLIC_AUTH_DOM = "my-test-app-c99a2.firebaseapp.com";
const NEXT_PUBLIC_PROJECT_ID = "my-test-app-c99a2";
const NEXT_PUBLIC_STORAGE_BUCKET = "my-test-app-c99a2.appspot.com";
const NEXT_PUBLIC_MESSAGING_SENDER_ID = "322389108804";
const NEXT_PUBLIC_APP_ID = "1:322389108804:web:8279130f14677d4493b411";
const NEXT_PUBLIC_MEASUREMENT_ID = "G-85PTMGJTXS";
const NEXT_PUBLIC_CRYPT_KEY = "s5v8y/B?E(H+MbQe";

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_API_KEY,
  authDomain: NEXT_PUBLIC_AUTH_DOM,
  projectId: NEXT_PUBLIC_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_APP_ID,
  measurementId: NEXT_PUBLIC_MEASUREMENT_ID,
};

function initializeFirebase() {
  try {
    return getApp();
  } catch (any) {
    return initializeApp(firebaseConfig);
  }
}
// Initialize Firebase
const app = initializeFirebase();

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const persistUser = checkUser()
