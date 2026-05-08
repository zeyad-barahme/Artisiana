import { StyleSheet, Text, View } from "react-native";

type PaymentSummaryProps = {
  total: number;
};

export default function PaymentSummary({ total }: PaymentSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>For Payment :</Text>
      <Text style={styles.amount}>${total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "Roboto_400Regular",
  },

  amount: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "Roboto_400Regular",
  },
});
