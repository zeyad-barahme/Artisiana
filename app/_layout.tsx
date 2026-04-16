import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* Tabs group */}
      <Stack.Screen name="(tabs)" />

      {/* صفحات خارج التابات */}
      <Stack.Screen name="cart" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />

    </Stack>
  );
}
