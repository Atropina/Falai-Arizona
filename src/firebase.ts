import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFQAU-XHNgIKUfj_i6wjRfBmVtt80B3LE",
  authDomain: "falai-d453a.firebaseapp.com",
  projectId: "falai-d453a",
  storageBucket: "falai-d453a.firebasestorage.app",
  messagingSenderId: "195084729091",
  appId: "1:195084729091:web:52aa13b3f5d3710e060736"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);