import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import type { Href } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomNavBar() {
  const pathname = usePathname();

  const isHome = pathname === '/(tabs)' || pathname === '/(tabs)/index';
  const isExplore = pathname === '/(tabs)/explore';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => router.push('/(tabs)' as Href)}>
        <Feather
          name="home"
          size={28}
          color={isHome ? '#F47C48' : '#F47C48'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as Href)}>
        <Ionicons
          name="grid-outline"
          size={28}
          color={isExplore ? '#F47C48' : '#F47C48'}
        />
      </TouchableOpacity>

      <View style={styles.logoCircle}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.centerLogo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={28} color="#F47C48" />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialCommunityIcons
          name="account-circle-outline"
          size={30}
          color="#F47C48"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 18,
    right: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F5E7DE',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  centerLogo: {
    width: 42,
    height: 42,
  },
});