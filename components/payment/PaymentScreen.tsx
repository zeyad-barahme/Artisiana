import { auth } from "@/api/firebase";
import { useCart } from "@/hooks/useCart";
import {
  createCheckoutOrder
} from "@/services/orders/checkoutOrder.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import CheckoutButton from "../checkout/CheckoutButton";
import CheckoutHeader from "../checkout/CheckoutHeader";
import { CheckoutProgress } from "../checkout/CheckoutProgress";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";

export default function PaymentScreen() {
  const { total, cartItems } = useCart();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fullName = String(params.fullName ?? "");
  const phoneNumber = String(params.phoneNumber ?? "");
  const address = String(params.address ?? "");
  const city = String(params.city ?? "");

  const handlePay = async () => {
    if (isSaving) {
      return;
    }

    if (
      cardNumber.trim() === "" ||
      cardholderName.trim() === "" ||
      expireDate.trim() === "" ||
      cvc.trim() === ""
    ) {
      Alert.alert("Missing Information", "Please fill in all payment fields.");
      return;
    }

    if (!fullName || !phoneNumber || !address || !city) {
      Alert.alert(
        "Missing Checkout Details",
        "Please go back and fill in all checkout details.",
      );
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty.");
      return;
    }

    setIsSaving(true);

    try {
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? "",
      }));

      const cleanCardNumber = cardNumber.replace(/\s/g, "");
      const cardLast4 = cleanCardNumber.slice(-4);

      await createCheckoutOrder({
        total,
        items: orderItems,
        customer: {
          fullName,
          phoneNumber,
          address,
          city,
        },
        paymentInfo: {
          cardLast4,
          cardholderName,
          expireDate,
        },
        userId: auth.currentUser?.uid ?? null,
      });

      //await clearCartItems();

      router.push("/success");
    } catch (error) {
      console.error("Failed to save order:", error);

      Alert.alert(
        "Order Error",
        "Could not save your order. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CheckoutHeader backTo="/checkout" />

      <CheckoutProgress step={2} />

      <View style={styles.content}>
        <PaymentSummary total={total} />

        <PaymentForm
          cardNumber={cardNumber}
          cardholderName={cardholderName}
          expireDate={expireDate}
          cvc={cvc}
          onCardNumberChange={setCardNumber}
          onCardholderNameChange={setCardholderName}
          onExpireDateChange={setExpireDate}
          onCvcChange={setCvc}
        />

        <View style={styles.buttonContainer}>
          <CheckoutButton
            title={isSaving ? "Saving..." : "Pay"}
            onPress={handlePay}
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
    marginTop: 50,
    paddingHorizontal: 29,
  },

  buttonContainer: {
    marginTop: 65,
    alignItems: "center",
  },
});
