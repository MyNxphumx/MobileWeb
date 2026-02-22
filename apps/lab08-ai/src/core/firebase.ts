import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIC1Q6ZVpXLkNc7tFj_c8xOgziB_nJx2g",
  authDomain: "lab06-expense-4cff6.firebaseapp.com",
  projectId: "lab06-expense-4cff6",
  storageBucket: "lab06-expense-4cff6.firebasestorage.app",
  messagingSenderId: "714844899922",
  appId: "1:714844899922:web:de79dfd7c33ee06b666d8b",
  measurementId: "G-XGPS2WLTD8"
};

export const app = initializeApp(firebaseConfig); // ต้องมี export ตัวนี้!
export const db = getFirestore(app);