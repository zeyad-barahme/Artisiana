import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  image: string;
};

export default function CategoryCard({ title, image }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
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