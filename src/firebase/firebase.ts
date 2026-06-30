// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADXJ91hdazNbeIBgHNoODsxlKdPOf3Tis",
  authDomain: "novara-ai-dc6b8.firebaseapp.com",
  projectId: "novara-ai-dc6b8",
  storageBucket: "novara-ai-dc6b8.firebasestorage.app",
  messagingSenderId: "75106471529",
  appId: "1:75106471529:web:17d0d344af11d142469cf8",
  measurementId: "G-1NJ0115BW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;