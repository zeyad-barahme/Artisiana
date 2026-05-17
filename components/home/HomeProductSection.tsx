import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import ProductCard1w from "../ProductCard1w";
import type { Product } from "../../hooks/useHomeData";

const PRIMARY = "#F47C48";

type HomeProductSectionProps = {
  products: Product[];
  isLoading: boolean;
  favoriteIds: string[];
  getProductImage: (image?: string) => any;
  onToggleFavorite: (item: Product) => void;
  onAddToCart: (item: Product, isOffer?: boolean) => void;
  onPressProduct: (productId: string) => void;
  isOffer?: boolean;
};

export default function HomeProductSection({
  products,
  isLoading,
  favoriteIds,
  getProductImage,
  onToggleFavorite,
  onAddToCart,
  onPressProduct,
  isOffer = false,
}: HomeProductSectionProps) {
  if (isLoading) {
    return (
      <ActivityIndicator size="small" color={PRIMARY} style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => (isOffer ? `offer-${item.id}` : item.id)}
      renderItem={({ item }) => {
        const originalPrice = Number(item.price || 0);
        const offerPrice = Number((originalPrice * 0.8).toFixed(2));

        return (
          <ProductCard1w
            id={item.id}
            title={item.title}
            category={item.category}
            oldPrice={isOffer ? originalPrice : undefined}
            price={isOffer ? offerPrice : item.price}
            rating={item.rating}
            image={getProductImage(item.image)}
            desc={item.desc || ""}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item)}
            onAdd={() => onAddToCart(item, isOffer)}
            onPressCard={() => onPressProduct(item.id)}
          />
        );
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.productsListContent}
    />
  );
}

const styles = StyleSheet.create({
  productsListContent: {
    paddingRight: 12,
    gap: 14,
  },

  loader: {
    marginVertical: 20,
  },
});