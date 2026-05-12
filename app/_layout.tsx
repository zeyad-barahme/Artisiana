import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { Rancho_400Regular } from "@expo-google-fonts/rancho";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export const unstable_settings = {
  initialRouteName: "entry-gate",
};

export default function RootLayout() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const queryClientRef = useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Itim_400Regular,
    Rancho_400Regular,
    Roboto_400Regular,
  });

  useEffect(() => {
    if (!authLoading && fontsLoaded) {
      if (user) {
        router.replace("/(tabs)/home" as any);
      } else {
        router.replace("/entry-gate" as any);
      }
    }
  }, [user, authLoading, fontsLoaded, router]);

  if (!fontsLoaded || authLoading) {
    return (
      <QueryClientProvider client={queryClientRef.current}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F2F2F2",
          }}
        >
          <ActivityIndicator size="large" color="#F47C4C" />
        </View>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
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
    </QueryClientProvider>
  );
}