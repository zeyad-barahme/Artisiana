import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useRouter, type Href } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Artestiana</Text>
        <Text style={styles.subtitle}>HANDMADE CRAFTS</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          onPress={() => router.push("/signup" as Href)}
        >
          <Text style={styles.primaryText}>Create my Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.8}
          onPress={() => router.push("/login" as Href)}
        >
          <Text style={styles.secondaryText}>I have an Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.05, // responsive
  },

  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },

  logo: {
    width: width * 0.4, // responsive
    height: width * 0.4,
    marginBottom: 15,
  },

  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#4A3F35",
  },

  subtitle: {
    fontSize: width * 0.03,
    letterSpacing: 2,
    color: "#8C7B6B",
    marginTop: 5,
  },

  buttonsContainer: {
    width: "85%",
    marginBottom: height * 0.03,
  },

  primaryBtn: {
    backgroundColor: "#F47C4C",
    paddingVertical: height * 0.02,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },

  primaryText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#CBB8A5",
    paddingVertical: height * 0.02,
    borderRadius: 30,
    alignItems: "center",
  },

  secondaryText: {
    color: "#4A3F35",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
});