import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { Auth, Persistence } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjpZ9Y1wkrGJWQNy9Uv5v1lTuWmWnEXe0",
  authDomain: "artisianaapp.firebaseapp.com",
  projectId: "artisianaapp",
  storageBucket: "artisianaapp.firebasestorage.app",
  messagingSenderId: "302019588350",
  appId: "1:302019588350:web:9b5d95114850ac932d35af",
};

export const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth: Auth = (() => {
  try {
    const getReactNativePersistence = (
      firebaseAuth as unknown as {
        getReactNativePersistence?: (storage: unknown) => Persistence;
      }
    ).getReactNativePersistence;

    return firebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence
        ? getReactNativePersistence(AsyncStorage)
        : undefined,
    });
  } catch {
    return firebaseAuth.getAuth(app);
  }
})();

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);