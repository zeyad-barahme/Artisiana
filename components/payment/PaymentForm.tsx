import { StyleSheet, View } from "react-native";
import CheckoutInput from "../checkout/CheckoutInput";

export default function PaymentForm() {
  return (
    <View style={styles.container}>
      <CheckoutInput
        label="Card Number"
        placeholder="Enter card number"
        value=""
        onChangeText={() => {}}
        keyboardType="numeric"
      />

      <CheckoutInput
        label="Cardholder Name"
        placeholder="Enter cardholder name"
        value=""
        onChangeText={() => {}}
      />

      <View style={styles.row}>
        <View style={styles.smallInput}>
          <CheckoutInput
            label="Expire date"
            placeholder="MM / YY"
            value=""
            onChangeText={() => {}}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.smallInput}>
          <CheckoutInput
            label="CVC"
            placeholder="Enter CVC"
            value=""
            onChangeText={() => {}}
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
