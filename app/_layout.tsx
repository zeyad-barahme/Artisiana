import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { Rancho_400Regular } from "@expo-google-fonts/rancho";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "entry-gate",
};

export default function RootLayout() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Itim_400Regular,
    Rancho_400Regular,
    Roboto_400Regular,
  });

  useEffect(() => {
    if (!authLoading && fontsLoaded) {
      if (user) {
        // المستخدم مسجل دخول → روح home
        router.replace("/(tabs)/home" as any);
      } else {
        // ما في مستخدم → روح entry-gate
        router.replace("/entry-gate" as any);
      }
    }
  }, [user, authLoading, fontsLoaded]);

  if (!fontsLoaded || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F2F2F2" }}>
        <ActivityIndicator size="large" color="#F47C4C" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="entry-gate" />

      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="discover" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="quick-sheet" />

      <Stack.Screen name="Reviews" />

      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}