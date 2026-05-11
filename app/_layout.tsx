import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { Rancho_400Regular } from "@expo-google-fonts/rancho";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

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
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
