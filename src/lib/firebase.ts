// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAljqi0L77Rwu0nxAdicJEVf5TeLd6C9A4",
  authDomain: "bible-quests-baq75.firebaseapp.com",
  projectId: "bible-quests-baq75",
  storageBucket: "bible-quests-baq75.firebasestorage.app",
  messagingSenderId: "40032471775",
  appId: "1:40032471775:web:07b303efee28748824f76a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
