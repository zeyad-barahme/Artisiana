import SuccessScreen from "@/components/success/SuccessScreen";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Success() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SuccessScreen />
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
