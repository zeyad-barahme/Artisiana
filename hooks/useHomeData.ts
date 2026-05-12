import { db } from "@/api/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

export type Category = {
  id: string;
  title: string;
  image: string;
};

export type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  rating?: number;
  category?: string;
  desc?: string;
};

const fetchCategories = async (): Promise<Category[]> => {
  const querySnapshot = await getDocs(collection(db, "categories"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, "id">),
  }));
};

const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}