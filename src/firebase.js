import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD9yHd-ydWerznHud04UFmGaPSJlDGhI24",
  authDomain: "fir-aa842.firebaseapp.com",
  databaseURL: "https://fir-aa842-default-rtdb.firebaseio.com",
  projectId: "fir-aa842",
  storageBucket: "fir-aa842.firebasestorage.app",
  messagingSenderId: "112544598499",
  appId: "1:112544598499:web:d3b360a3e1acc46f4c38d6",
  measurementId: "G-S4DC348RBT"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;