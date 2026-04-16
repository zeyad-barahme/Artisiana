import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ProductCard from '../../components/common/ProductCard';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { trendingProducts } from '../../components/data/homeData';

const BG = '#FFF7F3';

export default function SearchScreen() {
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) return trendingProducts;

    return trendingProducts.filter(
      (item) =>
        item.title.toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text)
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>

        <TextInput
          style={styles.input}
          placeholder="Search handmade products..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                title={item.title}
                category={item.category}
                price={item.price}
                rating={item.rating}
                image={item.image}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAD4C9',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
  },
  cardWrapper: {
    marginBottom: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});