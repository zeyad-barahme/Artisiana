import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { Rancho_400Regular } from "@expo-google-fonts/rancho";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "entry-gate",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Itim_400Regular,
    Rancho_400Regular,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return null;
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