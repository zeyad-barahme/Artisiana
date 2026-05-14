import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

type Props = {
  id?: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: any;
  desc: string;
  category?: string;
  rating?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAdd?: () => void;
  onPressCard?: () => void;
};

const ProductCard = memo(function ProductCard({
  title,
  price,
  oldPrice,
  image,
  desc,
  category,
  rating,
  isFavorite = false,
  onToggleFavorite,
  onAdd,
  onPressCard,
}: Props) {
  const stars = Math.round(rating || 5);
  const hasOldPrice = typeof oldPrice === "number" && oldPrice > price;

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPressCard} activeOpacity={0.85}>
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? "#F47C48" : "#C9AFA0"}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {category && (
          <Text style={styles.categoryText} numberOfLines={1}>
            {category}
          </Text>
        )}

        <Text style={styles.desc} numberOfLines={2}>
          {desc}
        </Text>

        <Text style={styles.rating} numberOfLines={1}>
          {"⭐".repeat(stars)}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.priceBox}>
          {hasOldPrice && (
            <Text style={styles.oldPrice} numberOfLines={1}>
              ${oldPrice.toFixed(2)}
            </Text>
          )}

          <Text style={styles.price} numberOfLines={1}>
            ${price.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onAdd}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 265,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    marginBottom: 18,
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    backgroundColor: "#eee",
  },

  favoriteButton: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  content: {
    flex: 1,
    marginTop: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },

  categoryText: {
    fontSize: 11,
    color: "#FF5E22",
    marginTop: 2,
    fontWeight: "600",
  },

  desc: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    lineHeight: 16,
  },

  rating: {
    fontSize: 12,
    color: "#FF5E22",
    marginTop: "auto",
    marginBottom: 6,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceBox: {
    maxWidth: "42%",
    flexShrink: 1,
  },

  oldPrice: {
    color: "#999",
    fontWeight: "600",
    fontSize: 11,
    textDecorationLine: "line-through",
    marginBottom: 1,
  },

  price: {
    color: "#FF5E22",
    fontWeight: "bold",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#FF5E22",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: "58%",
  },

  buttonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});