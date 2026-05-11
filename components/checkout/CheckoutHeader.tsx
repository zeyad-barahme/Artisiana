import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CheckoutHeaderProps = {
  backTo?: string;
};

export default function CheckoutHeader({
  backTo = "/cart",
}: CheckoutHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.push(backTo as any)}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={24} color="#000000" />
      </TouchableOpacity>

      <Text style={styles.title}>Checkout Details</Text>

      <View style={styles.emptySpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 38,
    paddingHorizontal: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  title: {
    width: 230,
    fontSize: 24,
    color: "#000000",
    fontFamily: "Itim_400Regular",
    fontWeight: "400",
    textAlign: "center",
  },

  emptySpace: {
    width: 28,
  },
});
