import {
  clearCheckoutDraft,
  loadCheckoutDraft,
  saveCheckoutDraft,
} from "@/services/checkout/checkoutDraft.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import CheckoutButton from "./CheckoutButton";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutInput from "./CheckoutInput";
import { CheckoutProgress } from "./CheckoutProgress";
import {
  cleanCheckoutDetails,
  validateCheckoutDetails,
} from "./checkoutValidation";

export default function CheckoutDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const fullNameRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);

  useEffect(() => {
    const prepareCheckoutDetails = async () => {
      if (params.reset) {
        setFullName("");
        setPhoneNumber("");
        setAddress("");
        setCity("");
        await clearCheckoutDraft();
        return;
      }

      const savedDraft = await loadCheckoutDraft();

      if (savedDraft) {
        setFullName(savedDraft.fullName);
        setPhoneNumber(savedDraft.phoneNumber);
        setAddress(savedDraft.address);
        setCity(savedDraft.city);
      }
    };

    prepareCheckoutDetails();
  }, [params.reset]);

  useEffect(() => {
    saveCheckoutDraft({
      fullName,
      phoneNumber,
      address,
      city,
    });
  }, [fullName, phoneNumber, address, city]);

  const focusInvalidInput = (title: string) => {
    if (fullName.trim() === "") {
      fullNameRef.current?.focus();
      return;
    }

    if (phoneNumber.trim() === "") {
      phoneNumberRef.current?.focus();
      return;
    }

    if (address.trim() === "") {
      addressRef.current?.focus();
      return;
    }

    if (city.trim() === "") {
      cityRef.current?.focus();
      return;
    }

    if (title.includes("Full Name")) {
      fullNameRef.current?.focus();
      return;
    }

    if (title.includes("Phone Number")) {
      phoneNumberRef.current?.focus();
      return;
    }

    if (title.includes("Address")) {
      addressRef.current?.focus();
      return;
    }

    if (title.includes("City")) {
      cityRef.current?.focus();
      return;
    }

    fullNameRef.current?.focus();
  };

  const handleSubmit = () => {
    const validation = validateCheckoutDetails({
      fullName,
      phoneNumber,
      address,
      city,
    });

    if (!validation.isValid) {
      Alert.alert(validation.title, validation.message);
      focusInvalidInput(validation.title);
      return;
    }

    const cleanedDetails = cleanCheckoutDetails({
      fullName,
      phoneNumber,
      address,
      city,
    });

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
    <View style={styles.container}>
      <CheckoutHeader backTo="/cart" />

      <CheckoutProgress step={1} />

      <View style={styles.form}>
        <CheckoutInput
          ref={fullNameRef}
          label="Full Name"
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <CheckoutInput
          ref={phoneNumberRef}
          label="Phone Number"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <CheckoutInput
          ref={addressRef}
          label="Address"
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />

        <CheckoutInput
          ref={cityRef}
          label="City"
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CheckoutButton title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  form: {
    marginTop: 34,
    paddingHorizontal: 29,
  },

  buttonContainer: {
    marginTop: 70,
    alignItems: "center",
  },
});
