import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CheckoutButtonProps = {
  title: string;
  onPress: () => void;
  width?: number;
};

export default function CheckoutButton({
  title,
  onPress,
  width = 138,
}: CheckoutButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, { width }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 42,
    backgroundColor: "#FF7F50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 20,
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
  },
});
