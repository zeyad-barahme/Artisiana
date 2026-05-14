import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function EntryGateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();

  const isLargeScreen = width > 600;

  const contentWidth = isLargeScreen ? 420 : width * 0.85;
  const logoSize = isLargeScreen ? 260 : width * 0.4;
  const titleSize = isLargeScreen ? 34 : width * 0.07;
  const subtitleSize = isLargeScreen ? 14 : width * 0.03;
  const buttonTextSize = isLargeScreen ? 16 : width * 0.04;
  const buttonPadding = isLargeScreen ? 16 : height * 0.02;

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home" as Href);
    }
  }, [user, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={{
              width: logoSize,
              height: logoSize,
            }}
            resizeMode="contain"
          />

          <Text style={[styles.title, { fontSize: titleSize }]}>
            Artestiana
          </Text>

          <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>
            HANDMADE CRAFTS
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, { paddingVertical: buttonPadding }]}
            activeOpacity={0.8}
            onPress={() => router.push("/signup" as Href)}
          >
            <Text style={[styles.primaryText, { fontSize: buttonTextSize }]}>
              Create my Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { paddingVertical: buttonPadding }]}
            activeOpacity={0.8}
            onPress={() => router.push("/login" as Href)}
          >
            <Text style={[styles.secondaryText, { fontSize: buttonTextSize }]}>
              I have an Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 55,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 35,
  },

  title: {
    fontWeight: "bold",
    color: "#4A3F35",
    marginTop: 10,
  },

  subtitle: {
    letterSpacing: 2,
    color: "#8C7B6B",
    marginTop: 5,
  },

  buttonsContainer: {
    width: "100%",
    marginBottom: 35,
  },

  primaryBtn: {
    backgroundColor: "#F47C4C",
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#CBB8A5",
    borderRadius: 30,
    alignItems: "center",
  },

  secondaryText: {
    color: "#4A3F35",
    fontWeight: "500",
  },
});