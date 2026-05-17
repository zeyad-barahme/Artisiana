import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { Product } from "../../hooks/useHomeData";
import ProductCard1w from "../ProductCard1w";

type SearchProductWithImage = Product & {
  imageSource: any;
};

type SearchProductGridProps = {
  products: SearchProductWithImage[];
  favoriteIds: string[];
  onToggleFavorite: (item: Product) => void;
  onAddToCart: (item: Product) => void;
  onPressProduct: (productId: string) => void;
};

export default function SearchProductGrid({
  products,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onPressProduct,
}: SearchProductGridProps) {
  if (products.length === 0) {
    return <Text style={styles.emptyText}>No products found</Text>;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.grid}>
        {products.map((item) => (
          <View
            key={`${item.id}-${item.image || "image"}`}
            style={styles.cardWrapper}
          >
            <ProductCard1w
              id={item.id}
              title={item.title}
              category={item.category}
              price={item.price}
              rating={item.rating}
              image={item.imageSource}
              desc={item.desc || ""}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={() => onToggleFavorite(item)}
              onAdd={() => onAddToCart(item)}
              onPressCard={() => onPressProduct(item.id)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 140,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});