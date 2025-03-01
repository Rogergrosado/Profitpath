// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm7HpIYm8Qqr8Y90itujoSygDhDDRKWrA",
  authDomain: "profitpath-authentication.firebaseapp.com",
  projectId: "profitpath-authentication",
  storageBucket: "profitpath-authentication.firebasestorage.app",
  messagingSenderId: "695417966117",
  appId: "1:695417966117:web:cbf73de9190b10c3f6f9cc",
  measurementId: "G-FZPPMHVTZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);