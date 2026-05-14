import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";

export const useProducts = (categoryName: string) => {
  return useQuery({
    queryKey: ["products", categoryName],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", categoryName)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
      } catch (error) {
        console.error("Firebase Fetch Error:", error); 
        throw new Error("Failed to fetch products");
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};