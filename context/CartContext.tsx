import { useCartLogic } from "@/hooks/useCartLogic";
import { createContext, useContext } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: any) {
  const cart = useCartLogic();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
