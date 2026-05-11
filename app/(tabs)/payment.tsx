import PaymentScreen from "@/components/payment/PaymentScreen";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Payment() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <PaymentScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
  },
});
