import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import CheckoutButton from "./CheckoutButton";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutInput from "./CheckoutInput";
import { CheckoutProgress } from "./CheckoutProgress";

export default function CheckoutDetails() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = () => {
    if (
      fullName.trim() === "" ||
      phoneNumber.trim() === "" ||
      address.trim() === "" ||
      city.trim() === ""
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    router.push({
      pathname: "/payment",
      params: {
        fullName,
        phoneNumber,
        address,
        city,
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <CheckoutHeader />

      <CheckoutProgress step={1} />

      <View style={styles.form}>
        <CheckoutInput
          label="Full Name"
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <CheckoutInput
          label="Phone Number"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <CheckoutInput
          label="Address"
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />

        <CheckoutInput
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
