// hooks/useProductDetails.ts
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";

export const useProductDetails = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { 
          id: docSnap.id, 
          ...docSnap.data() 
        } as any;
      }
      return null;
    },
    enabled: !!productId, // الهوك ما بشتغل إلا إذا الـ ID موجود فعلياً
  });
};