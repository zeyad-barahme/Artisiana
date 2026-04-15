import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/firebase";

export async function uploadAvatar(options: { uid: string; uri: string }) {
  const { uid, uri } = options;
  const res = await fetch(uri);
  const blob = await res.blob();

  const objectRef = ref(storage, `avatars/${uid}`);
  await uploadBytes(objectRef, blob, { contentType: blob.type || "image/jpeg" });
  return await getDownloadURL(objectRef);
}

