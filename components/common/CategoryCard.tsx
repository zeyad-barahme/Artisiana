import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';

type Props = {
  title: string;
  image: string;
};

export default function CategoryCard({ title, image }: Props) {
  const handlePress = () => {
    if (title === 'All Crafts') {
      router.push('/(tabs)/allCrafts' as Href);
    } else if (title === 'Ceramics') {
      router.push('/(tabs)/ceramics' as Href);
    } else if (title === 'Accessories') {
      router.push('/(tabs)/accessories' as Href);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    marginRight: 14,
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 95,
    borderRadius: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
    textAlign: 'center',
  },
});