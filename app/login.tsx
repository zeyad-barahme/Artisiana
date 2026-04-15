import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, type Href } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginForm = {
  email: string;
  password: string;
};

type StoredUser = {
  email: string;
  password: string;
  [key: string]: unknown;
};

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      // 🔍 نبحث عن المستخدم
      const user = users.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (user) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        Alert.alert("Success", "Login successful 🎉");
        router.push("/home" as Href); // 👉 يوديه للصفحة الجديدة
      } else {
        Alert.alert("Error", "Invalid email or password");
      }

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Image */}
        <Image
          source={require("../assets/images/login.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Titles */}
        <Text style={styles.title}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
              {errors.email && (
                <Text style={styles.error}>{String(errors.email.message)}</Text>
              )}
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <View style={styles.passwordBox}>
                <TextInput
                  placeholder="Password"
                  style={styles.inputFlex}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={{ fontSize: 16 }}>👁</Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.error}>
                  {String(errors.password.message)}
                </Text>
              )}
            </View>
          )}
        />

        {/* Forgot */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        {/* Signup redirect */}
        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => router.push("/signup" as Href)}
          >
            Sign up
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

  back: {
    fontSize: 24,
    marginTop: 10,
  },

  image: {
    width: "100%",
    height: 220,
    marginVertical: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#4A3F35",
    marginBottom: 5,
  },

  subtitle: {
    color: "#777",
    marginBottom: 25,
  },

  inputContainer: {
    marginBottom: 15,
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

  forgot: {
    alignSelf: "flex-end",
    marginBottom: 25,
    color: "#F47C4C",
    fontWeight: "500",
  },

  loginBtn: {
    backgroundColor: "#F47C4C",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signupText: {
    textAlign: "center",
    marginTop: 20,
  },

  signupLink: {
    fontWeight: "bold",
    color: "#F47C4C",
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});