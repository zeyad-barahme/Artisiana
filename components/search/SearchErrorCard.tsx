import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY = "#F47C48";

type SearchErrorCardProps = {
  onRetry: () => void;
};

export default function SearchErrorCard({ onRetry }: SearchErrorCardProps) {
  return (
    <View style={styles.errorCard}>
      <Text style={styles.errorTitle}>Something went wrong</Text>

      <Text style={styles.errorText}>
        We could not load products and no offline data is available.
      </Text>

      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F4B8A0",
    marginTop: 20,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
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
});