// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjpZ9Y1wkrGJWQNy9Uv5v1lTuWmWnEXe0",
  authDomain: "artisianaapp.firebaseapp.com",
  projectId: "artisianaapp",
  storageBucket: "artisianaapp.firebasestorage.app",
  messagingSenderId: "302019588350",
  appId: "1:302019588350:web:9b5d95114850ac932d35af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);