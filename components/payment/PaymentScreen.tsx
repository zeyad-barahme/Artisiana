import { useCart } from "@/hooks/useCart";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import CheckoutButton from "../checkout/CheckoutButton";
import CheckoutHeader from "../checkout/CheckoutHeader";
import { CheckoutProgress } from "../checkout/CheckoutProgress";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";

export default function PaymentScreen() {
  const { total } = useCart();
  const router = useRouter();

  const handlePay = () => {
    router.push("/success");
  };

  return (
    <View style={styles.container}>
      <CheckoutHeader backTo="/checkout" />

      <CheckoutProgress step={2} />

      <View style={styles.content}>
        <PaymentSummary total={total} />

        <PaymentForm />

        <View style={styles.buttonContainer}>
          <CheckoutButton title="Pay" onPress={handlePay} />
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
    marginTop: 50,
    paddingHorizontal: 29,
  },

  buttonContainer: {
    marginTop: 65,
    alignItems: "center",
  },
});
