import {
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter, type Href } from "expo-router"; 

export default function Home() {
  const router = useRouter(); 

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Text */}
      <Text style={styles.text}>
        We’re glad to have you back. Start exploring now.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/profile" as Href)} // 🔥 هذا كان ناقص
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },

  logo: {
    width: 180,
    height: 180,
    marginTop: 40,
  },

  text: {
    fontSize: 16,
    color: "#4A3F35",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#F47C4C",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});