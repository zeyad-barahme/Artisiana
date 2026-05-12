import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../api/firebase";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

function toNumber(value: unknown, fallback = 0) {
  const numberValue =
    typeof value === "string"
      ? Number(value.replace(/[^0-9.]/g, ""))
      : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function useCartLogic() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cart"), (snapshot) => {
      const items = snapshot.docs.map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          title: String(data.title ?? ""),
          price: toNumber(data.price, 0),
          quantity: toNumber(data.quantity, 1),
          image: String(data.image ?? ""),
        };
      });

      setCartItems(items);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = useCallback(async (product: any) => {
    try {
      const productId = String(product.id);

      const cartRef = doc(db, "cart", productId);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          quantity: toNumber(cartSnap.data().quantity, 1) + 1,
        });
      } else {
        await setDoc(cartRef, {
          title: product.title,
          price: toNumber(product.price, 0),
          image: String(product.image ?? ""),
          quantity: 1,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, []);

  const filteredItems = useMemo(() => {
    return cartItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [cartItems, search]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const increaseQuantity = useCallback(
    async (id: string) => {
      const item = cartItems.find((i) => i.id === id);

      if (!item) return;

      const ref = doc(db, "cart", id);

      await updateDoc(ref, {
        quantity: item.quantity + 1,
      });
    },
    [cartItems],
  );

  const decreaseQuantity = useCallback(
    async (id: string) => {
      const item = cartItems.find((i) => i.id === id);

      if (!item || item.quantity <= 1) return;

      const ref = doc(db, "cart", id);

      await updateDoc(ref, {
        quantity: item.quantity - 1,
      });
    },
    [cartItems],
  );

  const deleteItem = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "cart", id));
  }, []);

  const clearCart = useCallback(async () => {
    await Promise.all(
      cartItems.map((item) => deleteDoc(doc(db, "cart", item.id))),
    );
  }, [cartItems]);

  return {
    cartItems,
    setCartItems,

    filteredItems,

    total,
    totalPrice: total,
    subtotal: total,
    totalItems,

    search,
    setSearch,

    addToCart,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
    clearCart,
  };
}
