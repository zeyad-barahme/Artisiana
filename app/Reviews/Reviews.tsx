import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";

import ReviewScreenShell from "@/components/reviews/review-screen-shell";
import StarRating from "@/components/reviews/star-rating";
import type { ReviewItem } from "@/components/reviews/types";
import { useCart } from "@/hooks/useCart";
import { getReviews, getReviewSummary } from "@/services/reviews/reviews.service";

function ReviewRow({ item }: { item: ReviewItem }) {
  return (
    <View style={styles.reviewRow}>
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.avatarLabel}>{item.avatarLabel}</Text>
        </View>

        <View style={styles.reviewTextBlock}>
          <Text style={styles.userName}>{item.userName}</Text>

          <Text style={styles.commentText}>
            {item.comment || "No written comment was added."}
          </Text>
        </View>
      </View>

      <StarRating rating={item.rating} size={20} />
    </View>
  );
}

export default function Reviews() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { totalItems } = useCart();

  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadReviews() {
        setIsLoading(true);

        try {
          const allReviews = await getReviews();

          const filteredReviews = productId
            ? allReviews.filter((review: any) => review.productId === productId)
            : allReviews;

          if (!isActive) return;

          setReviews(filteredReviews);
          setErrorMessage("");
        } catch (error) {
          if (!isActive) return;

          console.log("Error loading reviews:", error);
          setErrorMessage("Could not load reviews right now.");
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadReviews();

      return () => {
        isActive = false;
      };
    }, [productId])
  );

  const reviewSummary = getReviewSummary(reviews);

  const goBackToProduct = () => {
    if (productId) {
      router.replace({
        pathname: "/(tabs)/productDetails",
        params: { productId },
      });
    } else {
      router.back();
    }
  };

  return (
    <ReviewScreenShell>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackToProduct} activeOpacity={0.8}>
          <Appbar.Action icon="arrow-left" color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/(tabs)/cart")}
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

      <Text style={styles.title}>Reviews</Text>

      <View style={styles.summaryCard}>
        <StarRating
          rating={reviewSummary.averageRating}
          totalStars={reviewSummary.totalStars}
          size={18}
        />

        <Text style={styles.summaryText}>{reviewSummary.headline}</Text>
      </View>

      {isLoading ? (
        <View style={styles.feedbackState}>
          <ActivityIndicator size="small" color="#FF8354" />
          <Text style={styles.feedbackText}>Loading reviews...</Text>
        </View>
      ) : null}

      {!isLoading && errorMessage ? (
        <View style={styles.feedbackState}>
          <Text style={styles.feedbackText}>{errorMessage}</Text>
        </View>
      ) : null}

      {!isLoading && !errorMessage && reviews.length === 0 ? (
        <View style={styles.feedbackState}>
          <Text style={styles.feedbackText}>
            No reviews yet for this product.
          </Text>
        </View>
      ) : null}

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewRow item={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.footerSpace} />}
        scrollEnabled={!isLoading && !errorMessage && reviews.length > 0}
      />
    </ReviewScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 18,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cartButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 8,
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

  title: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "700",
    color: "#222222",
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 28,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FBE9E3",
  },

  summaryText: {
    fontSize: 20,
    color: "#7B6A63",
    textTransform: "lowercase",
  },

  listContent: {
    paddingBottom: 8,
    flexGrow: 1,
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F1F1",
  },

  feedbackState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },

  feedbackText: {
    fontSize: 15,
    color: "#7B6A63",
  },

  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 16,
  },

  reviewTextBlock: {
    flex: 1,
    gap: 4,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A4A4A",
  },

  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },

  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#7B6A63",
  },

  footerSpace: {
    height: 20,
  },
});