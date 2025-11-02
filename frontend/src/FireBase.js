// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_1SbEH9a06dC4arVcgd8UPXCX54JD2z4",
  authDomain: "phone-email-auth-48e7e.firebaseapp.com",
  projectId: "phone-email-auth-48e7e",
  storageBucket: "phone-email-auth-48e7e.firebasestorage.app",
  messagingSenderId: "1098588300605",
  appId: "1:1098588300605:web:db4a8e5b603683aa6b1154",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
