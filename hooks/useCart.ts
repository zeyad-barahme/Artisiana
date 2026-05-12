import { useCartContext } from "@/context/CartContext";
import type { useCartLogic } from "@/hooks/useCartLogic";

export type { CartItem } from "@/hooks/useCartLogic";

export function useCart(): ReturnType<typeof useCartLogic> {
  return useCartContext();
}