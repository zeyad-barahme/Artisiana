import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../api/firebase";

type CartItem = {
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

export function useCart() {
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

  const filteredItems = useMemo(() => {
    return cartItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [cartItems, search]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  return {
    cartItems,
    filteredItems,
    total,
    search,
    setSearch,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
  };
}
