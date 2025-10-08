import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD8tPSnskFn27dFXVfV5ctDcnU-Elv25PA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seesy-shop.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://seesy-shop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seesy-shop",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seesy-shop.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "359255298457",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:359255298457:web:d40ff94ec3914628084308",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-N27FN5NL0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);

export default app;
