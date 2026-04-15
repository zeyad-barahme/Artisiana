import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, type Href } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/firebase";
import { createUserProfile } from "@/services/user-profile";

type SignupForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SignupForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    console.log("SUBMIT 🔥", data);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );
      await createUserProfile({
        uid: cred.user.uid,
        name: data.name,
        email: data.email.trim(),
        phone: data.phone,
      });

      Alert.alert("Success", "Account created successfully 🎉");

      reset();
      router.push("/login" as Href);

    } catch (e) {
      console.log("ERROR:", e);
      Alert.alert("Error", "Signup failed. Please try again.");
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
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Name"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                />
                {errors.name && (
                  <Text style={styles.error}>{String(errors.name.message)}</Text>
                )}
              </View>
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
            rules={{ required: "Phone is required" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Phone number"
                  style={styles.input}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.phone && (
                  <Text style={styles.error}>{String(errors.phone.message)}</Text>
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
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Password"
                    style={styles.inputFlex}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
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
            rules={{
              required: "Confirm password",
              validate: (value: string) => {
                const password = watch("password") || "";
                return value === password || "Passwords do not match";
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm password"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
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
        >
          <Text style={styles.signupText}>Sign up</Text>
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