import { useCart } from "@/hooks/useCart";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import CheckoutButton from "../checkout/CheckoutButton";
import CheckoutHeader from "../checkout/CheckoutHeader";
import { CheckoutProgress } from "../checkout/CheckoutProgress";

export default function SuccessScreen() {
  const router = useRouter();
  const { total } = useCart();

  const handleContinueShopping = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <CheckoutHeader backTo="/cart" />

      <CheckoutProgress step={3} />

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={78} color="#2F6B2F" />
        </View>

        <Text style={styles.title}>Payment Success</Text>

        <Text style={styles.message}>
          Your order has been placed successfully.{"\n"}
          Thank you for shopping with us!{"\n"}
          Your items are being prepared and will be delivered{"\n"}
          soon.
        </Text>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Payment</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

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
    paddingHorizontal: 24,
    marginTop: 55,
  },

  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#A8F29A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    color: "#000000",
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    marginBottom: 42,
  },

  message: {
    fontSize: 16,
    color: "rgba(0,0,0,0.68)",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
  },

  totalSection: {
    marginTop: 65,
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 22,
    color: "rgba(0,0,0,0.7)",
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    marginBottom: 18,
  },

  totalAmount: {
    fontSize: 32,
    color: "rgba(0,0,0,0.9)",
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    lineHeight: 32,
  },

  buttonContainer: {
    marginTop: 90,
    alignItems: "center",
  },
});
