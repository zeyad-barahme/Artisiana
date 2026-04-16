import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import type { Href } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function BottomNavBar() {
  const pathname = usePathname();

  const isHome = pathname === '/(tabs)' || pathname === '/(tabs)/index';
  const isExplore = pathname === '/(tabs)/explore';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/(tabs)' as Href)}
        activeOpacity={0.8}
      >
        <Feather name="home" size={22} color={isHome ? '#F47C48' : '#F47C48'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/(tabs)/explore' as Href)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="grid-outline"
          size={22}
          color={isExplore ? '#F47C48' : '#F47C48'}
        />
      </TouchableOpacity>

      <View style={styles.logoCircle}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.centerLogo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
        <Feather name="bell" size={21} color="#F47C48" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
        <Feather name="user" size={21} color="#F47C48" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1E6DF',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5E7DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLogo: {
    width: 32,
    height: 32,
  },
});