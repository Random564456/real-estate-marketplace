// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-d1e57.firebaseapp.com",
  projectId: "mern-estate-d1e57",
  storageBucket: "mern-estate-d1e57.appspot.com",
  messagingSenderId: "733137119570",
  appId: "1:733137119570:web:2c7c1f6080ae473fc1b28b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);