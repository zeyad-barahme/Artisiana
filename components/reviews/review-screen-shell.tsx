import React, { type ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function ReviewScreenShell({
  children,
  centered = false,
}: {
  children: ReactNode;
  centered?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, centered && styles.centered]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF0F2',
  },
  screen: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    alignItems: 'center',
  },
});
