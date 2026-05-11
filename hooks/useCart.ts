import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  setDoc, // أضفنا هذه للاستخدام في الإضافة
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string; // أضفنا الصورة لتخزينها
};

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cart"), (snapshot) => {
      const items = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<CartItem, "id">),
      }));
      setCartItems(items);
    });
    return () => unsubscribe();
  }, []);

  // --- دالة الإضافة الجديدة ---
  const addToCart = async (product: any) => {
    try {
      const cartRef = doc(db, "cart", product.id);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        // إذا المنتج موجود أصلاً، نزيد الكمية فقط
        await updateDoc(cartRef, {
          quantity: cartSnap.data().quantity + 1
        });
      } else {
        // إذا المنتج جديد، نضيفه للسلة
        await setDoc(cartRef, {
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const filteredItems = cartItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const increaseQuantity = async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const ref = doc(db, "cart", id);
    await updateDoc(ref, { quantity: item.quantity + 1 });
  };

  const decreaseQuantity = async (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;
    const ref = doc(db, "cart", id);
    await updateDoc(ref, { quantity: item.quantity - 1 });
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "cart", id));
  };

  return {
    cartItems,
    filteredItems,
    total,
    search,
    setSearch,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
    addToCart, // 🔥 تأكد من عمل return لها هنا
  };
}