import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
export default function AppBar() {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../../assets/images/Logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <Text style={styles.brandName}>Artisiana</Text>

      <TouchableOpacity
        style={styles.searchBox}
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/search' as Href)}
      >
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.searchText}>search</Text>
      </TouchableOpacity>
       
      <TouchableOpacity onPress={() => router.push("/cart")}>
            <Feather name="shopping-cart" size={24} color="#FF7F50" />
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F47C48',
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#C9C2BE',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  searchIcon: {
    fontSize: 18,
    color: '#E08A61',
    marginRight: 8,
  },
  searchText: {
    fontSize: 16,
    color: '#E08A61',
  },
  cartButton: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 24,
  },
});