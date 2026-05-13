import { auth } from "@/api/firebase";
import { useCart } from "@/hooks/useCart";
import { createCheckoutOrder } from "@/services/orders/checkoutOrder.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, TextInput, View } from "react-native";
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

  const [isSaving, setIsSaving] = useState(false);

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

  const handlePay = async (values: PaymentFormValues) => {
    if (isSaving) {
      return;
    }

    const cleanedPayment = cleanPaymentDetails(values);

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
      const orderTotal = total;

      const orderItems = cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? "",
      }));

      await createCheckoutOrder({
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
        userId: auth.currentUser?.uid ?? null,
      });

      await clearCart();

      router.replace({
        pathname: "/success",
        params: {
          total: orderTotal.toString(),
        },
      } as any);
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
            title={isSaving ? "Saving..." : "Pay"}
            onPress={handleSubmit(handlePay)}
          />
        </View>
      </View>
    </View>
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