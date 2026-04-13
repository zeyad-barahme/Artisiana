import { StyleSheet, Text, View } from "react-native";

export default function Checkout() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Checkout Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // 👈 مهم
  },
  text: {
    fontSize: 24,
    color: "#000",
  },
});
