import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBjpZ9Y1wkrGJWQNy9Uv5v1lTuWmWnEXe0",
  authDomain: "artisanaaapp.firebaseapp.com",
  projectId: "artisanaaapp",
  storageBucket: "artisanaaapp.firebasestorage.app",
  messagingSenderId: "302019588350",
  appId: "1:302019588350:web:9b5d95114850ac932d35af",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);