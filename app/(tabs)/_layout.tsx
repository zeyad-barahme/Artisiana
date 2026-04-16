import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="allCrafts" />
      <Tabs.Screen name="ceramics" />
      <Tabs.Screen name="accessories" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}
