import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";

import ProductCard1w from "../../components/ProductCard1w";
import BottomNavBar from "../../components/layout/BottomNavBar";
import { useCart } from "../../hooks/useCart";
import { Product, useProducts } from "../../hooks/useHomeData";
import { auth } from "../../api/firebase";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "../../services/favorites/favorites.service";
import { notifyCartItemAdded } from "../../services/notifications/notification.service";
import {
  getOfflineProducts,
  initOfflineProductsDatabase,
  saveOfflineProducts,
} from "../../services/offline/offlineProducts.service";

const BG = "#FFF7F3";
const PRIMARY = "#F47C48";

const productImages: Record<string, any> = {
  ac: require("../../assets/images/A1/ac.png"),
  ac1: require("../../assets/images/A1/ac1.webp"),
  ac2: require("../../assets/images/A1/ac2.jpg"),
  ac3: require("../../assets/images/A1/ac3.webp"),
  ac4: require("../../assets/images/A1/ac4.avif"),
  ac5: require("../../assets/images/A1/ac5.webp"),
  ac6: require("../../assets/images/A1/ac6.webp"),

  ce: require("../../assets/images/A1/ce.png"),
  ce1: require("../../assets/images/A1/ce1.webp"),
  ce2: require("../../assets/images/A1/ce2.webp"),
  ce3: require("../../assets/images/A1/ce3.webp"),
  ce4: require("../../assets/images/A1/ce4.jpg"),
  ce5: require("../../assets/images/A1/ce5.webp"),
  ce6: require("../../assets/images/A1/ce6.jpg"),

  a: require("../../assets/images/A1/a.webp"),
  b: require("../../assets/images/A1/b.jpg"),
  c: require("../../assets/images/A1/c.png"),
  d: require("../../assets/images/A1/d.jpg"),
  e: require("../../assets/images/A1/e.jpg"),
  f: require("../../assets/images/A1/f.jpg"),
};

const getProductImage = (image?: string) => {
  if (!image) {
    return require("../../assets/images/A1/a.webp");
  }

  if (image.startsWith("http")) {
    return image;
  }

  return productImages[image] || require("../../assets/images/A1/a.webp");
};

export default function SearchScreen() {
  const { addToCart } = useCart();

  const searchInputRef = useRef<TextInput>(null);

  const [search, setSearch] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [offlineProducts, setOfflineProducts] = useState<Product[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoadingOffline, setIsLoadingOffline] = useState(true);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProducts();

  useEffect(() => {
    const loadFavorites = async () => {
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      try {
        const ids = await getUserFavorites(userId);
        setFavoriteIds(ids);
      } catch (error) {
        console.log("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    const setupOfflineDatabase = async () => {
      try {
        await initOfflineProductsDatabase();

        const cachedProducts = await getOfflineProducts();
        setOfflineProducts(cachedProducts);
      } catch (error) {
        console.log("SQLite init error:", error);
      } finally {
        setIsLoadingOffline(false);
      }
    };

    setupOfflineDatabase();
  }, []);

  useEffect(() => {
    const cacheOnlineProducts = async () => {
      if (products.length === 0) return;

      try {
        await saveOfflineProducts(products);
        setOfflineProducts(products);
        setIsOfflineMode(false);
      } catch (error) {
        console.log("SQLite save error:", error);
      }
    };

    cacheOnlineProducts();
  }, [products]);

  useEffect(() => {
    if (isError && offlineProducts.length > 0) {
      setIsOfflineMode(true);
    }
  }, [isError, offlineProducts.length]);

  const displayedProducts = useMemo(() => {
    if (isError && offlineProducts.length > 0) {
      return offlineProducts;
    }

    return products;
  }, [isError, offlineProducts, products]);

  const filteredProducts = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) return displayedProducts;

    return displayedProducts.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const desc = item.desc?.toLowerCase() || "";

      return (
        title.includes(text) ||
        category.includes(text) ||
        desc.includes(text)
      );
    });
  }, [search, displayedProducts]);

  const goToProductDetails = useCallback((productId: string) => {
    router.push({
      pathname: "/(tabs)/productDetails",
      params: { productId },
    } as Href);
  }, []);

  const handleToggleFavorite = useCallback(
    async (item: Product) => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        Alert.alert("Login Required", "Please login to save favorites.");
        return;
      }

      const isAlreadyFavorite = favoriteIds.includes(item.id);

      try {
        if (isAlreadyFavorite) {
          await removeFavorite(userId, item.id);

          setFavoriteIds((prev) =>
            prev.filter((productId) => productId !== item.id)
          );
        } else {
          await addFavorite(userId, item);

          setFavoriteIds((prev) => [...prev, item.id]);
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    },
    [favoriteIds]
  );

  const handleAddToCart = useCallback(
    (item: Product) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      });

      const userId = auth.currentUser?.uid;

      if (userId) {
        void notifyCartItemAdded({
          userId,
          productId: item.id,
          productTitle: item.title,
        });
      }
    },
    [addToCart]
  );

  const clearSearch = useCallback(() => {
    setSearch("");
    searchInputRef.current?.focus();
  }, []);

  const handleRetry = useCallback(() => {
    setIsOfflineMode(false);
    refetch();
  }, [refetch]);

  const shouldShowLoader = (isLoading || isLoadingOffline) && !isOfflineMode;

  const shouldShowError =
    isError && offlineProducts.length === 0 && !isLoadingOffline;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchWrapper}>
          <TextInput
            ref={searchInputRef}
            style={styles.input}
            placeholder="Search handmade products..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSearch}
              activeOpacity={0.8}
            >
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {isOfflineMode ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              Offline mode: showing saved products.
            </Text>
          </View>
        ) : null}

        {shouldShowLoader ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={styles.loader}
          />
        ) : shouldShowError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>
              We could not load products and no offline data is available.
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key="two-columns"
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <ProductCard1w
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  price={item.price}
                  rating={item.rating}
                  image={getProductImage(item.image)}
                  desc={item.desc || ""}
                  isFavorite={favoriteIds.includes(item.id)}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                  onAdd={() => handleAddToCart(item)}
                  onPressCard={() => goToProductDetails(item.id)}
                />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products found</Text>
            }
          />
        )}
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },

  searchWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAD4C9",
    paddingHorizontal: 14,
    paddingRight: 42,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
  },

  clearButton: {
    position: "absolute",
    right: 12,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F6E7DF",
    alignItems: "center",
    justifyContent: "center",
  },

  clearText: {
    fontSize: 22,
    color: PRIMARY,
    lineHeight: 24,
    fontWeight: "600",
  },

  offlineBanner: {
    backgroundColor: "#FFF1E8",
    borderColor: "#F4B8A0",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  offlineText: {
    color: "#9A5A3F",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  columnWrapper: {
    justifyContent: "space-between",
    gap: 12,
  },

  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 140,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },

  loader: {
    marginTop: 30,
  },

  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F4B8A0",
    marginTop: 20,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
    marginBottom: 5,
  },

  errorText: {
    fontSize: 14,
    color: "#777",
    lineHeight: 20,
    marginBottom: 12,
  },

  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
  },

  retryButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
});