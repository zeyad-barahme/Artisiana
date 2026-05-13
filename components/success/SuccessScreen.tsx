import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import CheckoutHeader from "../checkout/CheckoutHeader";
import CheckoutButton from "../shared/CheckoutButton";
import { CheckoutProgress } from "../shared/CheckoutProgress";

export default function SuccessScreen() {
  const params = useLocalSearchParams();

  const total = Number(params.total ?? 0);

  const handleContinueShopping = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <CheckoutHeader backTo="/cart" />

      <CheckoutProgress step={3} />

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={78} color="#235C2E" />
        </View>

        <Text style={styles.title}>Payment Success</Text>

        <Text style={styles.message}>
          Your order has been placed successfully.{"\n"}
          Thank you for shopping with us!{"\n"}
          Your items are being prepared and will be delivered{"\n"}
          soon.
        </Text>

        <Text style={styles.totalLabel}>Total Payment</Text>

        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>

        <View style={styles.buttonContainer}>
          <CheckoutButton
            title="Continue Shopping"
            onPress={handleContinueShopping}
            width={190}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 55,
  },

  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#9BEF8D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    color: "#000000",
    marginBottom: 40,
    fontFamily: "Roboto_400Regular",
  },

  message: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    color: "#1E2A34",
    marginBottom: 65,
    fontFamily: "Roboto_400Regular",
  },

  totalLabel: {
    fontSize: 22,
    color: "#1E2A34",
    marginBottom: 18,
    fontFamily: "Roboto_400Regular",
  },

  totalAmount: {
    fontSize: 32,
    color: "#000000",
    marginBottom: 90,
    fontFamily: "Roboto_400Regular",
  },

  buttonContainer: {
    alignItems: "center",
  },
});