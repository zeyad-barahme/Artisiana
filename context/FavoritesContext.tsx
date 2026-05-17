import { auth } from "@/api/firebase";
import type { Product } from "@/hooks/useHomeData";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "@/services/favorites/favorites.service";
import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FavoritesContextValue = {
  favoriteIds: string[];
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const refreshFavorites = useCallback(async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      setFavoriteIds([]);
      return;
    }

    try {
      const ids = await getUserFavorites(userId);
      setFavoriteIds(ids);
    } catch (error) {
      console.log("Error loading favorites:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      void refreshFavorites();
    });

    return unsubscribe;
  }, [refreshFavorites]);

  const toggleFavorite = useCallback(
    async (product: Product) => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error("Login Required");
      }

      const alreadyFavorite = favoriteIds.includes(product.id);

      if (alreadyFavorite) {
        await removeFavorite(userId, product.id);

        setFavoriteIds((prev) =>
          prev.filter((productId) => productId !== product.id)
        );

        return;
      }

      await addFavorite(userId, product);

      setFavoriteIds((prev) => {
        if (prev.includes(product.id)) {
          return prev;
        }

        return [...prev, product.id];
      });
    },
    [favoriteIds]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      refreshFavorites,
      toggleFavorite,
    }),
    [favoriteIds, refreshFavorites, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}