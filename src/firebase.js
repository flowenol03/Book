// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9yHd-ydWerznHud04UFmGaPSJlDGhI24",
  authDomain: "fir-aa842.firebaseapp.com",
  projectId: "fir-aa842",
  storageBucket: "fir-aa842.firebasestorage.app",
  messagingSenderId: "112544598499",
  appId: "1:112544598499:web:d3b360a3e1acc46f4c38d6",
  measurementId: "G-S4DC348RBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - only if you need it)
export const analytics = getAnalytics(app);

export default app;