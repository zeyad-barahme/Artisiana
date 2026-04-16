import { Tabs } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="subscription" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="allCrafts" />
      <Tabs.Screen name="ceramics" />
      <Tabs.Screen name="accessories" />
      <Tabs.Screen name="checkout" />
    </Tabs>
  );
}