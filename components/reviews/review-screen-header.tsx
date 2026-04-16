import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReviewScreenHeader() {
  const router = useRouter();

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.iconButton}
        onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#222222" />
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" style={styles.iconButton}>
        <Ionicons name="cart-outline" size={22} color="#FF7A45" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 4,
  },
});
