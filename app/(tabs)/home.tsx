import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../../api/firebase";
import CategoryCard from "../../components/common/CategoryCard";
import AppBar from "../../components/layout/AppBar";
import BottomNavBar from "../../components/layout/BottomNavBar";
import ProductCard1w from "../../components/ProductCard1w";
import { useCart } from "../../hooks/useCart";
import {
  Product,
  useCategories,
  useProducts,
} from "../../hooks/useHomeData";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "../../services/favorites/favorites.service";
import {
  notifyCartItemAdded,
  notifyOfferAddedToCart,
} from "../../services/notifications/notification.service";

const BG = "#FFF7F3";
const TEXT = "#222222";
const CARD = "#FFFFFF";
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

const getDiscountPrice = (price: number) => {
  return Number((price * 0.8).toFixed(2));
};

export default function HomeScreen() {
  const { addToCart } = useCart();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

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

  const handleRetry = useCallback(() => {
    refetchCategories();
    refetchProducts();
  }, [refetchCategories, refetchProducts]);

  const hasError = categoriesError || productsError;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppBar />

        <View style={styles.heroCard}>
          <View style={styles.heroTextWrapper}>
            <Text style={styles.heroText}>
              Explore unique handmade crafts created by talented artisans,
              featuring carefully designed products that celebrate creativity
              and authenticity.
            </Text>
          </View>

          <Image
            source={require("../../assets/images/hero_image.png")}
            style={styles.heroImage}
          />
        </View>

        {hasError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>
              We could not load the home data. Please try again.
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.centerSectionHeader}>
          <Text style={styles.centerSectionTitle}>Categories</Text>
        </View>

        {loadingCategories ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard title={item.title} image={item.image} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesListContent}
          />
        )}

        <View style={styles.centerSectionHeader}>
          <Text style={styles.centerSectionTitle}>Trending Now</Text>
        </View>

        {loadingProducts ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={trendingProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
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
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsListContent}
          />
        )}

        <View style={styles.centerSectionHeader}>
          <Text style={styles.centerSectionTitle}>Special Offers</Text>
        </View>

        {loadingProducts ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={specialOffers}
            keyExtractor={(item) => `offer-${item.id}`}
            renderItem={({ item }) => {
              const originalPrice = Number(item.price || 0);
              const offerPrice = getDiscountPrice(originalPrice);

              return (
                <ProductCard1w
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  oldPrice={originalPrice}
                  price={offerPrice}
                  rating={item.rating}
                  image={getProductImage(item.image)}
                  desc={item.desc || ""}
                  isFavorite={favoriteIds.includes(item.id)}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                  onAdd={() => handleAddToCart(item, true)}
                  onPressCard={() => goToProductDetails(item.id)}
                />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsListContent}
          />
        )}

        <View style={styles.footer}>
          <View style={styles.footerTopBox}>
            <Text style={styles.footerBrand}>Artisiana</Text>

            <Text style={styles.footerSubtitle}>
              Handmade crafts made with love and authenticity.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.85}
            onPress={() => openLink("tel:+972592129473")}
          >
            <View style={styles.contactIconBox}>
              <Feather name="phone" size={17} color={PRIMARY} />
            </View>

            <Text style={styles.contactText}>
              Contact us :{" "}
              <Text style={styles.contactNumber}>+972592129473</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.followSection}>
            <Text style={styles.followText}>Follow us</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() =>
                  openLink(
                    "https://www.facebook.com/share/18V5FmJ7Xt/?mibextid=wwXIfr"
                  )
                }
              >
                <Text style={styles.socialText}>f</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() =>
                  openLink(
                    "https://www.instagram.com/zeyad_barahme?igsh=aW1kang2MThnd2do"
                  )
                }
              >
                <Feather name="instagram" size={17} color={PRIMARY} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => openLink("https://wa.me/972592129473")}
              >
                <Feather name="message-circle" size={17} color={PRIMARY} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => openLink("https://x.com")}
              >
                <Text style={styles.xText}>𝕏</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerDivider} />

          <Text style={styles.copyRight}>
            © 2026 Artisiana. All rights reserved.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

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
    backgroundColor: BG,
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  heroCard: {
    marginTop: 18,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroTextWrapper: {
    flex: 1,
    paddingRight: 12,
    justifyContent: "center",
  },

  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4A4A4A",
    fontWeight: "500",
  },

  heroImage: {
    width: 135,
    height: 155,
    borderRadius: 16,
  },

  errorCard: {
    marginTop: 18,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F4B8A0",
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
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

  centerSectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    alignItems: "center",
  },

  centerSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },

  categoriesListContent: {
    paddingRight: 12,
    gap: 12,
  },

  productsListContent: {
    paddingRight: 12,
    gap: 14,
  },

  loader: {
    marginVertical: 20,
  },

  footer: {
    marginTop: 34,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#F1E1D8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  footerTopBox: {
    alignItems: "center",
  },

  footerBrand: {
    fontSize: 24,
    color: PRIMARY,
    fontWeight: "800",
    fontStyle: "italic",
    textAlign: "center",
  },

  footerSubtitle: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
    lineHeight: 17,
    textAlign: "center",
    maxWidth: 260,
  },

  contactButton: {
    marginTop: 14,
    backgroundColor: "#FFF7F3",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  contactIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFE7DD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  contactText: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
    fontWeight: "700",
  },

  contactNumber: {
    color: PRIMARY,
    fontWeight: "900",
  },

  followSection: {
    marginTop: 16,
    alignItems: "center",
  },

  followText: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    marginBottom: 10,
  },

  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  socialButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF7F3",
    borderWidth: 1,
    borderColor: "#FFE0D3",
    alignItems: "center",
    justifyContent: "center",
  },

  socialText: {
    fontSize: 20,
    color: PRIMARY,
    fontWeight: "900",
  },

  xText: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "900",
  },

  footerDivider: {
    height: 1,
    backgroundColor: "#F1E1D8",
    marginTop: 14,
    marginBottom: 10,
  },

  copyRight: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },

  bottomSpacing: {
    height: 120,
  },
});