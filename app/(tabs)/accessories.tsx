import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "../../services/favorites/favorites.service";
import { notifyCartItemAdded } from "../../services/notifications/notification.service";

const localImages: { [key: string]: any } = {
  ac1: require("../../assets/images/A1/ac1.webp"),
  ac2: require("../../assets/images/A1/ac2.jpg"),
  ac3: require("../../assets/images/A1/ac3.webp"),
  ac4: require("../../assets/images/A1/ac4.avif"),
  ac5: require("../../assets/images/A1/ac5.webp"),
  ac6: require("../../assets/images/A1/ac6.webp"),
};

export default function Accessories() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [fontsLoaded] = useFonts({ Rancho_400Regular });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const { data: products, isLoading, isError } = useProducts("Accessories");

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

  const handleToggleFavorite = useCallback(
    async (item: any) => {
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
        <Text>Something went wrong while fetching products.</Text>
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
          source={require("../../assets/images/A1/ac.png")}
          style={styles.coverImage}
        />

        <Text style={styles.title}>Accessories</Text>

        <View style={styles.productsContainer}>
          {products?.map((item) => (
            <ProductCard
              key={item.id}
              {...item}
              image={
                localImages[item.image] ||
                require("../../assets/images/A1/ac1.webp")
              }
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item)}
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

  coverImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 15,
    marginTop: 25,
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