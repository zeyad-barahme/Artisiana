import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.button}>
      <Text style={styles.icon}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  icon: {
    fontSize: 24,
    color: '#1D1D1D',
  },
});
