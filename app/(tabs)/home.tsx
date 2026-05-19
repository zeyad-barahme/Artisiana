import type { Href } from "expo-router";
import { router } from "expo-router";
import { useCallback, useRef, useMemo } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { auth } from "../../api/firebase";
import HomeCategoriesList from "../../components/home/HomeCategoriesList";
import HomeErrorCard from "../../components/home/HomeErrorCard";
import HomeFooter from "../../components/home/HomeFooter";
import HomeHero from "../../components/home/HomeHero";
import HomeProductSection from "../../components/home/HomeProductSection";
import HomeSectionHeader from "../../components/home/HomeSectionHeader";
import AppBar from "../../components/layout/AppBar";
import BottomNavBar from "../../components/layout/BottomNavBar";
import { useFavorites } from "../../context/FavoritesContext";
import { useAutoHideAppBar } from "../../hooks/useAutoHideAppBar";
import { useCart } from "../../hooks/useCart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Product,
  useCategories,
  useProducts,
} from "../../hooks/useHomeData";
import {
  notifyCartItemAdded,
  notifyOfferAddedToCart,
} from "../../services/notifications/notification.service";

const BG = "#FFF7F3";

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

const getDiscountPrice = (price: number) => {
  return Number((price * 0.8).toFixed(2));
};

export default function HomeScreen() {
  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { isAppBarVisible, showAppBarWhileScrolling } = useAutoHideAppBar();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: products = [],
    isLoading: loadingProducts,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts();

  const trendingProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const specialOffers = useMemo(() => {
    if (products.length > 4) {
      return products.slice(4, 8);
    }

    return products.slice(0, 4);
  }, [products]);

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
    (item: Product, isOffer = false) => {
      const finalPrice = isOffer
        ? getDiscountPrice(Number(item.price || 0))
        : item.price;

      addToCart({
        id: item.id,
        title: item.title,
        price: finalPrice,
        image: item.image,
        quantity: 1,
      });

      const userId = auth.currentUser?.uid;

      if (userId) {
        const notify = isOffer ? notifyOfferAddedToCart : notifyCartItemAdded;

        void notify({
          userId,
          productId: item.id,
          productTitle: item.title,
        });
      }
    },
    [addToCart]
  );

  const openLink = useCallback(async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Could not open this link.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while opening the link.");
    }
  }, []);
  const handleSelectCategory = useCallback(async (category: {
    id: string;
    title: string;
    image: string;
  }) => {
    try {
      await AsyncStorage.setItem(
        "lastSelectedCategory",
        JSON.stringify(category)
      );

      console.log("Saved category:", category.title);
    } catch (error) {
      console.log("Error saving selected category:", error);
    }
  }, []);
  const handleRetry = useCallback(() => {
    refetchCategories();
    refetchProducts();
  }, [refetchCategories, refetchProducts]);

  const hasError = categoriesError || productsError;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <AppBar isVisible={isAppBarVisible} floating />

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={showAppBarWhileScrolling}
        onScrollBeginDrag={showAppBarWhileScrolling}
        onScrollEndDrag={showAppBarWhileScrolling}
        onMomentumScrollEnd={showAppBarWhileScrolling}
        scrollEventThrottle={16}
      >
        <HomeHero />

        {hasError ? <HomeErrorCard onRetry={handleRetry} /> : null}

        <HomeSectionHeader title="Categories" />

        <HomeCategoriesList
          categories={categories}
          isLoading={loadingCategories}
          onSelectCategory={handleSelectCategory}
        />

        <HomeSectionHeader title="Trending Now" />

        <HomeProductSection
          products={trendingProducts}
          isLoading={loadingProducts}
          favoriteIds={favoriteIds}
          getProductImage={getProductImage}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onPressProduct={goToProductDetails}
        />

        <HomeSectionHeader title="Special Offers" />

        <HomeProductSection
          products={specialOffers}
          isLoading={loadingProducts}
          favoriteIds={favoriteIds}
          getProductImage={getProductImage}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onPressProduct={goToProductDetails}
          isOffer
        />

        <HomeFooter onOpenLink={openLink} />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 105,
  },

  bottomSpacing: {
    height: 120,
  },
});