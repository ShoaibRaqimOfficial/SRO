import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyD8O5zS5-nxLm2EqL6yf9ANw7H9UF0dPJE",
  authDomain: "sro-academy-7454d.firebaseapp.com",
  projectId: "sro-academy-7454d",
  storageBucket: "sro-academy-7454d.firebasestorage.app",
  messagingSenderId: "959907656036",
  appId: "1:959907656036:web:fddd1f007120ae60d38a71",
  measurementId: "G-YPPNNBR494"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc
};
