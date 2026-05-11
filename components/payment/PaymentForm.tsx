import type { RefObject } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";
import CheckoutInput from "../shared/CheckoutInput";
import {
  validateCardholderNameField,
  validateCardNumberField,
  validateCvcField,
  validateExpireDateField,
} from "./paymentValidation";

export type PaymentFormValues = {
  cardNumber: string;
  cardholderName: string;
  expireDate: string;
  cvc: string;
};

type PaymentFormProps = {
  control: Control<PaymentFormValues>;
  errors: FieldErrors<PaymentFormValues>;
  formatExpireDate: (text: string) => string;
  cardNumberRef: RefObject<TextInput | null>;
  cardholderNameRef: RefObject<TextInput | null>;
  expireDateRef: RefObject<TextInput | null>;
  cvcRef: RefObject<TextInput | null>;
};

export default function PaymentForm({
  control,
  errors,
  formatExpireDate,
  cardNumberRef,
  cardholderNameRef,
  expireDateRef,
  cvcRef,
}: PaymentFormProps) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="cardNumber"
        rules={{
          validate: validateCardNumberField,
        }}
        render={({ field: { value, onChange } }) => (
          <CheckoutInput
            ref={cardNumberRef}
            label="Card Number"
            placeholder="Enter card number"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            errorMessage={errors.cardNumber?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="cardholderName"
        rules={{
          validate: validateCardholderNameField,
        }}
        render={({ field: { value, onChange } }) => (
          <CheckoutInput
            ref={cardholderNameRef}
            label="Cardholder Name"
            placeholder="Enter cardholder name"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.cardholderName?.message}
          />
        )}
      />

      <View style={styles.row}>
        <View style={styles.smallInput}>
          <Controller
            control={control}
            name="expireDate"
            rules={{
              validate: validateExpireDateField,
            }}
            render={({ field: { value, onChange } }) => (
              <CheckoutInput
                ref={expireDateRef}
                label="Expire date"
                placeholder="MM / YY"
                value={value}
                onChangeText={(text) => onChange(formatExpireDate(text))}
                keyboardType="numeric"
                errorMessage={errors.expireDate?.message}
              />
            )}
          />
        </View>

        <View style={styles.smallInput}>
          <Controller
            control={control}
            name="cvc"
            rules={{
              validate: validateCvcField,
            }}
            render={({ field: { value, onChange } }) => (
              <CheckoutInput
                ref={cvcRef}
                label="CVC"
                placeholder="Enter CVC"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                errorMessage={errors.cvc?.message}
              />
            )}
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
