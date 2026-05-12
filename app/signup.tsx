import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, type Href } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { auth } from "@/api/firebase";
import { createUserProfile } from "@/services/user-profile";

type SignupForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );

      await createUserProfile({
        uid: cred.user.uid,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
      });

      Alert.alert("Success", "Account created successfully 🎉");

      reset();
      router.replace("/discover" as Href);
    } catch (e) {
      console.log("Signup error:", e);
      Alert.alert("Error", "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create an account</Text>

        <View style={styles.form}>
          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#B8B8B8"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  autoCorrect={false}
                />

                {errors.name && (
                  <Text style={styles.error}>
                    {String(errors.name.message)}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#B8B8B8"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  value={value}
                  onChangeText={onChange}
                />

                {errors.email && (
                  <Text style={styles.error}>
                    {String(errors.email.message)}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Phone */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor="#B8B8B8"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />

                {errors.phone && (
                  <Text style={styles.error}>
                    {String(errors.phone.message)}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordBox}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#B8B8B8"
                    style={styles.inputFlex}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                  />
                )}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text>👁</Text>
              </TouchableOpacity>
            </View>

            {errors.password && (
              <Text style={styles.error}>
                {String(errors.password.message)}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm password"
                  placeholderTextColor="#B8B8B8"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                />

                {errors.confirmPassword && (
                  <Text style={styles.error}>
                    {String(errors.confirmPassword.message)}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.signupText}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Text>
        </TouchableOpacity>

        {/* Login */}
        <Text style={styles.loginText}>
          Already have an Account?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => router.push("/login" as Href)}
          >
            Log in
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 30,
    color: "#4A3F35",
  },

  form: {
    gap: 15,
  },

  inputContainer: {
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#4A3F35",
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  inputFlex: {
    flex: 1,
    paddingVertical: 15,
    color: "#4A3F35",
  },

  signupBtn: {
    backgroundColor: "#F47C4C",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },

  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  loginText: {
    marginTop: 20,
    textAlign: "center",
  },

  loginLink: {
    fontWeight: "bold",
    color: "#F47C4C",
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});