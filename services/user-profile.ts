import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string | null;
};

export async function createUserProfile(input: {
  uid: string;
  name: string;
  email: string;
  phone: string;
}) {
  const { uid, name, email, phone } = input;
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      name,
      email,
      phone,
      imageUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

