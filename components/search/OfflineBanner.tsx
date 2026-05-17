import { StyleSheet, Text, View } from "react-native";

export default function OfflineBanner() {
  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        Offline mode: showing saved products.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#FFF1E8",
    borderColor: "#F4B8A0",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  offlineText: {
    color: "#9A5A3F",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});