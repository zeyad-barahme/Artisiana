import { auth } from "@/api/firebase";
import { useCart } from "@/hooks/useCart";
import { createCheckoutOrder } from "@/services/orders/checkoutOrder.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import CheckoutButton from "../checkout/CheckoutButton";
import CheckoutHeader from "../checkout/CheckoutHeader";
import { CheckoutProgress } from "../checkout/CheckoutProgress";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";
import {
  cleanPaymentDetails,
  formatExpireDate,
  validatePaymentDetails,
} from "./paymentValidation";

export default function PaymentScreen() {
  const { total, cartItems } = useCart();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const cardNumberRef = useRef<TextInput>(null);
  const cardholderNameRef = useRef<TextInput>(null);
  const expireDateRef = useRef<TextInput>(null);
  const cvcRef = useRef<TextInput>(null);

  const fullName = String(params.fullName ?? "");
  const phoneNumber = String(params.phoneNumber ?? "");
  const address = String(params.address ?? "");
  const city = String(params.city ?? "");

  const focusInvalidPaymentInput = (title: string) => {
    if (cardNumber.trim() === "") {
      cardNumberRef.current?.focus();
      return;
    }

    if (cardholderName.trim() === "") {
      cardholderNameRef.current?.focus();
      return;
    }

    if (expireDate.trim() === "") {
      expireDateRef.current?.focus();
      return;
    }

    if (cvc.trim() === "") {
      cvcRef.current?.focus();
      return;
    }

    if (title.includes("Card Number")) {
      cardNumberRef.current?.focus();
      return;
    }

    if (title.includes("Cardholder Name")) {
      cardholderNameRef.current?.focus();
      return;
    }

    if (title.includes("Expire Date")) {
      expireDateRef.current?.focus();
      return;
    }

    if (title.includes("CVC")) {
      cvcRef.current?.focus();
      return;
    }

    cardNumberRef.current?.focus();
  };

  const handlePay = async () => {
    if (isSaving) {
      return;
    }

    const validation = validatePaymentDetails({
      cardNumber,
      cardholderName,
      expireDate,
      cvc,
    });

    if (!validation.isValid) {
      Alert.alert(validation.title, validation.message);
      focusInvalidPaymentInput(validation.title);
      return;
    }

    const cleanedPayment = cleanPaymentDetails({
      cardNumber,
      cardholderName,
      expireDate,
      cvc,
    });

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
          cardLast4: cleanedPayment.cardLast4,
          cardholderName: cleanedPayment.cardholderName,
          expireDate: cleanedPayment.expireDate,
        },
        userId: auth.currentUser?.uid ?? null,
      });

      // await clearCartItems();

      router.replace("/success");
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
          onExpireDateChange={(text) => setExpireDate(formatExpireDate(text))}
          onCvcChange={setCvc}
          cardNumberRef={cardNumberRef}
          cardholderNameRef={cardholderNameRef}
          expireDateRef={expireDateRef}
          cvcRef={cvcRef}
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
