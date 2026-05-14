import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import type { Href } from "expo-router";

import { auth } from "../../api/firebase";
import BottomNavBar from "../../components/layout/BottomNavBar";
import ProductCard1w from "../../components/ProductCard1w";
import { useCart } from "../../hooks/useCart";
import { Product } from "../../hooks/useHomeData";
import {
  getUserFavoriteProducts,
  removeFavorite,
} from "../../services/favorites/favorites.service";
import { notifyCartItemAdded } from "../../services/notifications/notification.service";

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

export default function FavoritesScreen() {
  const { addToCart } = useCart();

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const items = await getUserFavoriteProducts(userId);
      setFavorites(items);
    } catch (error) {
      Alert.alert("Error", "Could not load favorites.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const goToProductDetails = useCallback((productId: string) => {
    router.push({
      pathname: "/(tabs)/productDetails",
      params: { productId },
    } as Href);
  }, []);

  const handleRemoveFavorite = useCallback(async (item: Product) => {
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    try {
      await removeFavorite(userId, item.id);

      setFavorites((prev) =>
        prev.filter((product) => product.id !== item.id)
      );
    } catch (error) {
      Alert.alert("Error", "Could not remove favorite.");
    }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Favorites</Text>

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={styles.loader}
          />
        ) : (
          <FlatList
            key="favorites-two-columns"
            data={favorites}
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
                  isFavorite={true}
                  onToggleFavorite={() => handleRemoveFavorite(item)}
                  onAdd={() => handleAddToCart(item)}
                  onPressCard={() => goToProductDetails(item.id)}
                />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No favorite products yet.</Text>
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
    marginTop: 60,
    fontSize: 16,
    color: "#777",
  },

  loader: {
    marginTop: 30,
  },
});