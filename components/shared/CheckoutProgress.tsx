import { StyleSheet, View } from "react-native";

type CheckoutProgressProps = {
  step: 1 | 2 | 3;
};

export function CheckoutProgress({ step }: CheckoutProgressProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.line, step >= 1 ? styles.activeLine : null]} />
      <View style={[styles.line, step >= 2 ? styles.activeLine : null]} />
      <View style={[styles.line, step >= 3 ? styles.activeLine : null]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginHorizontal: 19,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  line: {
    width: 98,
    height: 2,
    backgroundColor: "#000000",
  },

  activeLine: {
    backgroundColor: "#FF7F50",
  },
});
