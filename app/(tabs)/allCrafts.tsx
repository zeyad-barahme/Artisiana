import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { auth } from "../../api/firebase";
import AppBar from "../../components/layout/AppBar";
import BottomNavBar from "../../components/layout/BottomNavBar";
import ProductCard from "../../components/ProductCard1w";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { notifyCartItemAdded } from "../../services/notifications/notification.service";

const localImages: { [key: string]: any } = {
  a: require("../../assets/images/A1/a.webp"),
  b: require("../../assets/images/A1/b.jpg"),
  c: require("../../assets/images/A1/c.png"),
  d: require("../../assets/images/A1/d.jpg"),
  e: require("../../assets/images/A1/e.jpg"),
  f: require("../../assets/images/A1/f.jpg"),
  h: require("../../assets/images/A1/f.jpg"),
};

export default function AllCrafts() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [fontsLoaded] = useFonts({ Rancho_400Regular });

  const { data: products, isLoading, isError } = useProducts("All Crafts");

  const handleAddToCart = useCallback(
    (item: any) => {
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

  const handlePressCard = useCallback(
    (productId: string) => {
      router.push({
        pathname: "/(tabs)/productDetails",
        params: { productId },
      });
    },
    [router]
  );

  if (!fontsLoaded || isLoading) {
    return (
      <ActivityIndicator size="large" color="#FF5E22" style={{ flex: 1 }} />
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading products.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <AppBar />

        <Image
          source={require("../../assets/images/A1/08bfaa47c6dec68aae046dcf5e766154b122ef7e.png")}
          style={styles.image}
        />

        <Text style={styles.title}>All Crafts</Text>

        <View style={styles.productsContainer}>
          {products?.map((item) => (
            <ProductCard
              key={item.id}
              {...item}
              image={
                localImages[item.image] ||
                require("../../assets/images/A1/a.webp")
              }
              onAdd={() => handleAddToCart(item)}
              onPressCard={() => handlePressCard(item.id)}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  image: {
    width: "100%",
    height: 280,
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Rancho_400Regular",
  },

  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});