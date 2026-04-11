import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFonts } from "expo-font";

import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { Rancho_400Regular } from "@expo-google-fonts/rancho";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Rancho_400Regular,
    Itim_400Regular,
    Inter_400Regular,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
