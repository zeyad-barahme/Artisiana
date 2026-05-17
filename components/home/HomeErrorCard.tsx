import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TEXT = "#222222";
const PRIMARY = "#F47C48";

type HomeErrorCardProps = {
  onRetry: () => void;
};

export default function HomeErrorCard({ onRetry }: HomeErrorCardProps) {
  return (
    <View style={styles.errorCard}>
      <Text style={styles.errorTitle}>Something went wrong</Text>

      <Text style={styles.errorText}>
        We could not load the home data. Please try again.
      </Text>

      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});