import { StyleSheet, Text, TextInput, View } from "react-native";

type CheckoutInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
};

export default function CheckoutInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}: CheckoutInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.45)"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },

  label: {
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    marginBottom: 8,
    fontFamily: "Roboto_400Regular",
  },

  input: {
    width: "100%",
    minHeight: 45,
    backgroundColor: "#F4F4F4",
    borderRadius: 5,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "rgba(0,0,0,0.8)",
    fontFamily: "Inter_400Regular",
    borderWidth: 0,
  },
});
