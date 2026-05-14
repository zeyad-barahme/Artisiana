import { auth } from "@/api/firebase";
import { useCart } from "@/hooks/useCart";
import { notifyOrderPlaced } from "@/services/notifications/notification.service";
import { createCheckoutOrder } from "@/services/orders/checkoutOrder.service";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import CheckoutHeader from "../checkout/CheckoutHeader";
import CheckoutButton from "../shared/CheckoutButton";
import { CheckoutProgress } from "../shared/CheckoutProgress";
import PaymentForm, { type PaymentFormValues } from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";
import { cleanPaymentDetails, formatExpireDate } from "./paymentValidation";

type PaymentContentProps = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

function PaymentContent({
  fullName,
  phoneNumber,
  address,
  city,
}: PaymentContentProps) {
  const { total, cartItems, clearCart } = useCart();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    mode: "onChange",
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expireDate: "",
      cvc: "",
    },
  });

  const cardNumberRef = useRef<TextInput>(null);
  const cardholderNameRef = useRef<TextInput>(null);
  const expireDateRef = useRef<TextInput>(null);
  const cvcRef = useRef<TextInput>(null);

  const createOrderMutation = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      const cleanedPayment = cleanPaymentDetails(values);

      if (!fullName || !phoneNumber || !address || !city) {
        throw new Error("Missing checkout details");
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error("Empty cart");
      }

      const orderTotal = total;
      const userId = auth.currentUser?.uid ?? null;

      const orderItems = cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? "",
      }));

      const orderId = await createCheckoutOrder({
        total: orderTotal,
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
        userId,
      });

      if (userId) {
        await notifyOrderPlaced({
          userId,
          orderId,
          total: orderTotal,
        });
      }

      await clearCart();

      return orderTotal;
    },

    onSuccess: (orderTotal) => {
      router.replace({
        pathname: "/success",
        params: {
          total: orderTotal.toString(),
        },
      } as any);
    },

    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (errorMessage === "Missing checkout details") {
        Alert.alert(
          "Missing Checkout Details",
          "Please go back and fill in all checkout details."
        );
        return;
      }

      if (errorMessage === "Empty cart") {
        Alert.alert("Empty Cart", "Your cart is empty.");
        return;
      }

      console.error("Failed to save order:", error);

      Alert.alert(
        "Order Error",
        "Could not save your order. Please try again."
      );
    },
  });

  const handlePay = (values: PaymentFormValues) => {
    if (createOrderMutation.isPending) {
      return;
    }

    createOrderMutation.mutate(values);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CheckoutHeader backTo="/checkout" />

        <CheckoutProgress step={2} />

        <View style={styles.content}>
          <PaymentSummary total={total} />

          <PaymentForm
            control={control}
            errors={errors}
            formatExpireDate={formatExpireDate}
            cardNumberRef={cardNumberRef}
            cardholderNameRef={cardholderNameRef}
            expireDateRef={expireDateRef}
            cvcRef={cvcRef}
          />

          <View style={styles.buttonContainer}>
            <CheckoutButton
              title={createOrderMutation.isPending ? "Saving..." : "Pay"}
              onPress={handleSubmit(handlePay)}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function PaymentScreen() {
  const params = useLocalSearchParams();

  const fullName = String(params.fullName ?? "");
  const phoneNumber = String(params.phoneNumber ?? "");
  const address = String(params.address ?? "");
  const city = String(params.city ?? "");
  const paymentReset = String(params.paymentReset ?? "default");

  return (
    <PaymentContent
      key={paymentReset}
      fullName={fullName}
      phoneNumber={phoneNumber}
      address={address}
      city={city}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  content: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 29,
  },

  buttonContainer: {
    marginTop: 65,
    alignItems: "center",
    paddingBottom: 30,
  },
});