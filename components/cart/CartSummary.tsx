import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartSummary({ total }: any) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total :</Text>
        <Text style={styles.totalPrice}>${total}</Text>
      </View>

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => router.push("/checkout")}
      >
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 68,
    left: 0,
    right: 0,

    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",

    alignItems: "center",
  },

  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  totalText: {
    fontSize: 22,
    marginRight: 10,
  },

  totalPrice: {
    fontSize: 22,
    color: "#3EAC28",
    fontWeight: "600",
  },

  checkoutBtn: {
    backgroundColor: "#FF7F50",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
