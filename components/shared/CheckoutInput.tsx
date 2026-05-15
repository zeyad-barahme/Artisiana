import { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type ReturnKeyTypeOptions,
} from "react-native";

type CheckoutInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  errorMessage?: string;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
};

const CheckoutInput = forwardRef<TextInput, CheckoutInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      keyboardType = "default",
      errorMessage,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
    },
    ref,
  ) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          ref={ref}
          style={[styles.input, errorMessage ? styles.inputError : null]}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.45)"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    );
  },
);

export default CheckoutInput;

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

  inputError: {
    borderWidth: 1,
    borderColor: "#FF4D4D",
  },

  errorText: {
    marginTop: 6,
    color: "#FF4D4D",
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
  },
});
