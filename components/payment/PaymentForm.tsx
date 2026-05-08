import { StyleSheet, View } from "react-native";
import CheckoutInput from "../checkout/CheckoutInput";

type PaymentFormProps = {
  cardNumber: string;
  cardholderName: string;
  expireDate: string;
  cvc: string;
  onCardNumberChange: (text: string) => void;
  onCardholderNameChange: (text: string) => void;
  onExpireDateChange: (text: string) => void;
  onCvcChange: (text: string) => void;
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
}: PaymentFormProps) {
  return (
    <View style={styles.container}>
      <CheckoutInput
        label="Card Number"
        placeholder="Enter card number"
        value={cardNumber}
        onChangeText={onCardNumberChange}
        keyboardType="numeric"
      />

      <CheckoutInput
        label="Cardholder Name"
        placeholder="Enter cardholder name"
        value={cardholderName}
        onChangeText={onCardholderNameChange}
      />

      <View style={styles.row}>
        <View style={styles.smallInput}>
          <CheckoutInput
            label="Expire date"
            placeholder="MM / YY"
            value={expireDate}
            onChangeText={onExpireDateChange}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.smallInput}>
          <CheckoutInput
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
