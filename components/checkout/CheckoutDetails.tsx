import {
  clearCheckoutDraft,
  loadCheckoutDraft,
  saveCheckoutDraft,
} from "@/services/checkout/checkoutDraft.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import CheckoutButton from "../shared/CheckoutButton";
import CheckoutInput from "../shared/CheckoutInput";
import { CheckoutProgress } from "../shared/CheckoutProgress";
import CheckoutHeader from "./CheckoutHeader";
import {
  cleanCheckoutDetails,
  validateAddressField,
  validateCityField,
  validateFullNameField,
  validatePhoneNumberField,
} from "./checkoutValidation";

type CheckoutFormValues = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

export default function CheckoutDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      city: "",
    },
  });

  const watchedValues = watch();

  const fullNameRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);

  useEffect(() => {
    const prepareCheckoutDetails = async () => {
      if (params.reset) {
        reset({
          fullName: "",
          phoneNumber: "",
          address: "",
          city: "",
        });

        await clearCheckoutDraft();
        return;
      }

      const savedDraft = await loadCheckoutDraft();

      if (savedDraft) {
        reset({
          fullName: savedDraft.fullName,
          phoneNumber: savedDraft.phoneNumber,
          address: savedDraft.address,
          city: savedDraft.city,
        });
      }
    };

    prepareCheckoutDetails();
  }, [params.reset, reset]);

  useEffect(() => {
    saveCheckoutDraft({
      fullName: watchedValues.fullName,
      phoneNumber: watchedValues.phoneNumber,
      address: watchedValues.address,
      city: watchedValues.city,
    });
  }, [
    watchedValues.fullName,
    watchedValues.phoneNumber,
    watchedValues.address,
    watchedValues.city,
  ]);

  const onSubmit = (values: CheckoutFormValues) => {
    const cleanedDetails = cleanCheckoutDetails(values);

    router.push({
      pathname: "/payment",
      params: {
        fullName: cleanedDetails.fullName,
        phoneNumber: cleanedDetails.phoneNumber,
        address: cleanedDetails.address,
        city: cleanedDetails.city,
        paymentReset: Date.now().toString(),
      },
    } as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CheckoutHeader backTo="/cart" />

        <CheckoutProgress step={1} />

        <View style={styles.form}>
          <Controller
            control={control}
            name="fullName"
            rules={{
              validate: validateFullNameField,
            }}
            render={({ field: { value, onChange } }) => (
              <CheckoutInput
                ref={fullNameRef}
                label="Full Name"
                placeholder="Enter full name"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.fullName?.message}
                returnKeyType="next"
                onSubmitEditing={() => phoneNumberRef.current?.focus()}
                blurOnSubmit={false}
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              validate: validatePhoneNumberField,
            }}
            render={({ field: { value, onChange } }) => (
              <CheckoutInput
                ref={phoneNumberRef}
                label="Phone Number"
                placeholder="Enter phone number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                errorMessage={errors.phoneNumber?.message}
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
                blurOnSubmit={false}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            rules={{
              validate: validateAddressField,
            }}
            render={({ field: { value, onChange } }) => (
              <CheckoutInput
                ref={addressRef}
                label="Address"
                placeholder="Enter address"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.address?.message}
                returnKeyType="next"
                onSubmitEditing={() => cityRef.current?.focus()}
                blurOnSubmit={false}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            rules={{
              validate: validateCityField,
            }}
            render={({ field: { value, onChange } }) => (
              <CheckoutInput
                ref={cityRef}
                label="City"
                placeholder="Enter city"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.city?.message}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CheckoutButton title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  form: {
    marginTop: 34,
    paddingHorizontal: 29,
  },

  buttonContainer: {
    marginTop: 70,
    alignItems: "center",
    paddingBottom: 30,
  },
});
