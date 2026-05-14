import { useRouter, type Href } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace("/(tabs)/home" as Href);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/brand-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.text}>
        We're glad to have you back. Start exploring now.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
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
