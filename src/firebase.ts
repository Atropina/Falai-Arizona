import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8D5uSS_IjDLMYNU4UapYeK3Yzlz0SdOQ",
  authDomain: "talkai-20b4d.firebaseapp.com",
  projectId: "talkai-20b4d",
  storageBucket: "talkai-20b4d.firebasestorage.app",
  messagingSenderId: "713736895011",
  appId: "1:713736895011:web:819dae880aff85eb8fcf96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);