import { useCart } from "@/hooks/useCart";
import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";
import { useProductDetails } from "../../hooks/useProductDetails";

const localImages: { [key: string]: any } = {
  a: require("../../assets/images/A1/a.webp"),
  b: require("../../assets/images/A1/b.jpg"),
  c: require("../../assets/images/A1/c.png"),
  d: require("../../assets/images/A1/d.jpg"),
  e: require("../../assets/images/A1/e.jpg"),
  f: require("../../assets/images/A1/f.jpg"),
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
};

const getProductImage = (image?: string) => {
  if (!image) return require("../../assets/images/A1/a.webp");
  if (image.startsWith("http")) return { uri: image };
  return localImages[image] || require("../../assets/images/A1/a.webp");
};

export default function ProductDetails() {
  const { totalItems } = useCart();
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = (params.productId || params.id) as string;
  const { addToCart } = useCart();

  const [fontsLoaded] = useFonts({ Rancho_400Regular });

  const { data: product, isLoading, isError } = useProductDetails(productId);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const goToReviews = () =>
    product &&
    router.push({
      pathname: "/Reviews/Reviews",
      params: { productId: product.id },
    });
  const goToAddReview = () =>
    product &&
    router.push({
      pathname: "/Reviews/AddReview",
      params: { productId: product.id },
    });

  if (!fontsLoaded || isLoading) {
    return (
      <ActivityIndicator size="large" color="#FF5E22" style={{ flex: 1 }} />
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Product not found!
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#FF5E22", fontWeight: "bold" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Appbar.Action icon="arrow-left" color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/(tabs)/cart" as Href)}
          activeOpacity={0.8}
        >
          <Feather name="shopping-cart" size={27} color="#FF7F50" />

          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Product Details</Text>
        <Image
          source={getProductImage(product.image)}
          style={styles.mainImage}
        />
        <Text style={styles.productName}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.rating}>
          {"⭐".repeat(Math.round(product.rating || 5))}
        </Text>

        <Text style={styles.descriptionTitle}>Description:</Text>
        <Text style={styles.description}>
          {product.desc || "No description available for this product."}
        </Text>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.fullCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.cartButtonText}>Add To Cart</Text>
          </TouchableOpacity>

          <View style={styles.reviewsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goToReviews}
            >
              <Text style={styles.secondaryButtonText}>Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goToAddReview}
            >
              <Text style={styles.secondaryButtonText}>Add Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontSize: 34,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 25,
    fontFamily: "Rancho_400Regular",
    color: "#000",
  },
  mainImage: {
    width: "90%",
    height: 260,
    alignSelf: "center",
    borderRadius: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    color: "#000",
  },
  price: {
    fontSize: 24,
    color: "#FF5E22",
    marginTop: 15,
    marginLeft: 20,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20,
    color: "#FF5E22",
  },
  descriptionTitle: {
    fontSize: 24,
    marginTop: 25,
    marginLeft: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    marginHorizontal: 20,
    lineHeight: 24,
  },
  actionsSection: {
    marginTop: 35,
    paddingHorizontal: 20,
  },
  fullCartButton: {
    backgroundColor: "#FF5E22",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF5E22",
    paddingVertical: 12,
    width: "48%",
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#FF5E22",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF4D4D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});
