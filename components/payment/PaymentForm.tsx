import type { RefObject } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CheckoutInput from "../shared/CheckoutInput";

type PaymentFormProps = {
  cardNumber: string;
  cardholderName: string;
  expireDate: string;
  cvc: string;
  onCardNumberChange: (text: string) => void;
  onCardholderNameChange: (text: string) => void;
  onExpireDateChange: (text: string) => void;
  onCvcChange: (text: string) => void;
  cardNumberRef: RefObject<TextInput | null>;
  cardholderNameRef: RefObject<TextInput | null>;
  expireDateRef: RefObject<TextInput | null>;
  cvcRef: RefObject<TextInput | null>;
};

export default function PaymentForm({
  cardNumber,
  cardholderName,
  expireDate,
  cvc,
  onCardNumberChange,
  onCardholderNameChange,
  onExpireDateChange,
  onCvcChange,
  cardNumberRef,
  cardholderNameRef,
  expireDateRef,
  cvcRef,
}: PaymentFormProps) {
  return (
    <View style={styles.container}>
      <CheckoutInput
        ref={cardNumberRef}
        label="Card Number"
        placeholder="Enter card number"
        value={cardNumber}
        onChangeText={onCardNumberChange}
        keyboardType="numeric"
      />

      <CheckoutInput
        ref={cardholderNameRef}
        label="Cardholder Name"
        placeholder="Enter cardholder name"
        value={cardholderName}
        onChangeText={onCardholderNameChange}
      />

      <View style={styles.row}>
        <View style={styles.smallInput}>
          <CheckoutInput
            ref={expireDateRef}
            label="Expire date"
            placeholder="MM / YY"
            value={expireDate}
            onChangeText={onExpireDateChange}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.smallInput}>
          <CheckoutInput
            ref={cvcRef}
            label="CVC"
            placeholder="Enter CVC"
            value={cvc}
            onChangeText={onCvcChange}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
  },

  row: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallInput: {
    width: "47%",
  },
});
