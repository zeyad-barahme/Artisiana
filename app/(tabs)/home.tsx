import React, { useCallback, useMemo } from "react";
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
import { router } from "expo-router";
import type { Href } from "expo-router";

import CategoryCard from "../../components/common/CategoryCard";
import ProductCard1w from "../../components/ProductCard1w";
import AppBar from "../../components/layout/AppBar";
import BottomNavBar from "../../components/layout/BottomNavBar";
import { heroData } from "../../components/data/homeData";
import { useCart } from "../../hooks/useCart";
import {
  Product,
  useCategories,
  useProducts,
} from "../../hooks/useHomeData";

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

export default function HomeScreen() {
  const { addToCart } = useCart();

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
    return products.slice(0, 8);
  }, [products]);

  const goToProductDetails = useCallback((productId: string) => {
    router.push({
      pathname: "/(tabs)/productDetails",
      params: { productId },
    } as Href);
  }, []);

  const handleAddToCart = useCallback(
    (item: Product) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      });

      Alert.alert("Added", "Product added to cart successfully.");
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
            <Text style={styles.heroSmallTitle}>Handmade Crafts</Text>
            <Text style={styles.heroText}>{heroData.title}</Text>
          </View>

          <Image source={{ uri: heroData.image }} style={styles.heroImage} />
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        {loadingCategories ? (
          <ActivityIndicator size="small" color={PRIMARY} style={styles.loader} />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard title={item.title} image={item.image} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/search" as Href)}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {loadingProducts ? (
          <ActivityIndicator size="small" color={PRIMARY} style={styles.loader} />
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
                onAdd={() => handleAddToCart(item)}
                onPressCard={() => goToProductDetails(item.id)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Artisiana</Text>
          <Text style={styles.footerSubtitle}>
            Handmade crafts made with love.
          </Text>

          <View style={styles.footerDivider} />

          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.8}
            onPress={() => openLink("tel:0592129473")}
          >
            <Text style={styles.footerLabel}>Phone</Text>
            <Text style={styles.footerValue}>0592129473</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.8}
            onPress={() =>
              openLink(
                "https://www.facebook.com/share/18V5FmJ7Xt/?mibextid=wwXIfr"
              )
            }
          >
            <Text style={styles.footerLabel}>Facebook</Text>
            <Text style={styles.footerValue}>Open Facebook Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.8}
            onPress={() =>
              openLink(
                "https://www.instagram.com/zeyad_barahme?igsh=aW1kang2MThnd2do"
              )
            }
          >
            <Text style={styles.footerLabel}>Instagram</Text>
            <Text style={styles.footerValue}>Open Instagram Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.8}
            onPress={() => openLink("https://wa.me/972592129473")}
          >
            <Text style={styles.footerLabel}>WhatsApp</Text>
            <Text style={styles.footerValue}>+972592129473</Text>
          </TouchableOpacity>
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
    borderRadius: 26,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  heroTextWrapper: {
    flex: 1,
    paddingRight: 14,
    justifyContent: "center",
  },
  heroSmallTitle: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "700",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 17,
    lineHeight: 28,
    color: "#4A4A4A",
    fontWeight: "500",
  },
  heroImage: {
    width: 135,
    height: 155,
    borderRadius: 22,
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
  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 29,
    fontWeight: "800",
    color: TEXT,
  },
  seeAllText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "700",
  },
  horizontalListContent: {
    paddingRight: 12,
    gap: 10,
  },
  loader: {
    marginVertical: 20,
  },
  footer: {
    marginTop: 34,
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 4,
  },
  footerSubtitle: {
    fontSize: 14,
    color: "#777",
    lineHeight: 22,
  },
  footerDivider: {
    height: 1,
    backgroundColor: "#F1E1D8",
    marginVertical: 14,
  },
  footerItem: {
    paddingVertical: 9,
  },
  footerLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 3,
    fontWeight: "600",
  },
  footerValue: {
    fontSize: 15,
    color: PRIMARY,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 120,
  },
});