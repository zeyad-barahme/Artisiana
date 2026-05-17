import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import { router } from "expo-router";
import type { Href } from "expo-router";

import { auth } from "../../api/firebase";
import BottomNavBar from "../../components/layout/BottomNavBar";
import OfflineBanner from "../../components/search/OfflineBanner";
import SearchErrorCard from "../../components/search/SearchErrorCard";
import SearchHeader from "../../components/search/SearchHeader";
import SearchProductGrid from "../../components/search/SearchProductGrid";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../hooks/useCart";
import { Product, useProducts } from "../../hooks/useHomeData";
import { notifyCartItemAdded } from "../../services/notifications/notification.service";
import {
  getOfflineProducts,
  initOfflineProductsDatabase,
  saveOfflineProducts,
} from "../../services/offline/offlineProducts.service";

const BG = "#FFF7F3";
const PRIMARY = "#F47C48";

const fallbackImage = require("../../assets/images/A1/a.webp");

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

const preloadProductImages = async () => {
  const images = Object.values(productImages);

  await Asset.loadAsync([...images, fallbackImage]);
};

const getLocalImageSource = (source: any) => {
  const asset = Asset.fromModule(source);

  return {
    uri: asset.localUri || asset.uri,
  };
};

const getProductImage = (image?: string) => {
  const imageKey = image?.trim();

  if (!imageKey) {
    return getLocalImageSource(fallbackImage);
  }

  if (imageKey.startsWith("http")) {
    return { uri: imageKey };
  }

  const localImage = productImages[imageKey] || fallbackImage;

  return getLocalImageSource(localImage);
};

type ProductWithImageSource = Product & {
  imageSource: any;
};

export default function SearchScreen() {
  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const searchInputRef = useRef<TextInput>(null);

  const [search, setSearch] = useState("");
  const [offlineProducts, setOfflineProducts] = useState<Product[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoadingOffline, setIsLoadingOffline] = useState(true);
  const [areImagesReady, setAreImagesReady] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProducts();

  useEffect(() => {
    const setupOfflineDatabase = async () => {
      try {
        await preloadProductImages();
        setAreImagesReady(true);

        await initOfflineProductsDatabase();

        const cachedProducts = await getOfflineProducts();
        setOfflineProducts(cachedProducts);
      } catch (error) {
        console.log("SQLite or image preload error:", error);
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

  const filteredProductsWithImages = useMemo<ProductWithImageSource[]>(() => {
    return filteredProducts.map((item) => ({
      ...item,
      imageSource: getProductImage(item.image),
    }));
  }, [filteredProducts, areImagesReady]);

  const goToProductDetails = useCallback((productId: string) => {
    router.push({
      pathname: "/(tabs)/productDetails",
      params: { productId },
    } as Href);
  }, []);

  const handleToggleFavorite = useCallback(
    async (item: Product) => {
      try {
        await toggleFavorite(item);
      } catch (error) {
        Alert.alert("Login Required", "Please login to save favorites.");
      }
    },
    [toggleFavorite]
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
        <SearchHeader
          search={search}
          onChangeSearch={setSearch}
          onClearSearch={clearSearch}
          searchInputRef={searchInputRef}
        />

        {isOfflineMode ? <OfflineBanner /> : null}

        {shouldShowLoader ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={styles.loader}
          />
        ) : shouldShowError ? (
          <SearchErrorCard onRetry={handleRetry} />
        ) : (
          <SearchProductGrid
            products={filteredProductsWithImages}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onPressProduct={goToProductDetails}
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

  loader: {
    marginTop: 30,
  },
});