import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
};

export default function ProductCard({
  title,
  category,
  price,
  rating,
  image,
}: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.row}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.rating}>⭐ {rating}</Text>
        </View>

        <Text style={styles.price}>${price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: '#777',
    fontSize: 13,
  },
  rating: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#F47C48',
  },
});