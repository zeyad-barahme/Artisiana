import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "../../api/firebase";
import { Product } from "../../hooks/useHomeData";

export const getUserFavorites = async (userId: string) => {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));

  return snapshot.docs.map((item) => item.id);
};

export const getUserFavoriteProducts = async (userId: string) => {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));

  return snapshot.docs.map((item) => item.data() as Product);
};

export const addFavorite = async (userId: string, product: Product) => {
  await setDoc(doc(db, "users", userId, "favorites", product.id), {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category || "",
    desc: product.desc || "",
    rating: product.rating || 5,
    createdAt: new Date(),
  });
};

export const removeFavorite = async (userId: string, productId: string) => {
  await deleteDoc(doc(db, "users", userId, "favorites", productId));
};