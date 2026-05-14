import { useAuth } from "@/hooks/useAuth";
import { GiveYouGlory_400Regular } from "@expo-google-fonts/give-you-glory";
import { Halant_400Regular } from "@expo-google-fonts/halant";
import { useFonts } from "expo-font";
import { useRouter, type Href } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EntryGateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    GiveYouGlory_400Regular,
    Halant_400Regular,
  });

  const isLargeScreen = width > 600;

  const contentWidth = isLargeScreen ? 420 : width * 0.85;
  const logoSize = isLargeScreen ? 260 : width * 0.4;
  const titleSize = isLargeScreen ? 34 : width * 0.085;
  const subtitleSize = isLargeScreen ? 26 : width * 0.06;
  const buttonTextSize = isLargeScreen ? 16 : width * 0.04;
  const buttonPadding = isLargeScreen ? 16 : height * 0.02;

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home" as Href);
    }
  }, [user, router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoCircle,
              {
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
              },
            ]}
          >
            <Image
              source={require("../assets/images/Logo.png")}
              style={{
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
              }}
              resizeMode="cover"
            />
          </View>

          <Text style={[styles.title, { fontSize: titleSize }]}>
            Welcome To Artisiana .
          </Text>

          <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>
            Discover Handmade Crafts
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

  logoCircle: {
    overflow: "hidden",
    backgroundColor: "#F5E7DE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45,
  },

  title: {
    fontFamily: "GiveYouGlory_400Regular",
    color: "#F47C48",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 40,
  },

  subtitle: {
    fontFamily: "Halant_400Regular",
    color: "#8C7B6B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 34,
  },

  buttonsContainer: {
    width: "100%",
    marginBottom: 35,
  },

  primaryBtn: {
    backgroundColor: "#F47C48",
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#F5E7DE",
    borderRadius: 30,
    alignItems: "center",
  },

  secondaryText: {
    color: "#4A3F35",
    fontWeight: "600",
  },
});