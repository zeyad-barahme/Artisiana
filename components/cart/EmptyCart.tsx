import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyCart() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your cart is empty 🛒</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#999",
  },
});
