import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import CategoryCard from '../../components/common/CategoryCard';
import ProductCard from '../../components/common/ProductCard';
import AppBar from '../../components/layout/AppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { categories, heroData, trendingProducts } from '../../components/data/homeData';

const BG = '#FFF7F3';
const TEXT = '#222222';
const CARD = '#FFFFFF';
const PRIMARY = '#F47C48';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppBar />

        <View style={styles.heroCard}>
          <View style={styles.heroTextWrapper}>
            <Text style={styles.heroText}>{heroData.title}</Text>
          </View>

          <Image source={{ uri: heroData.image }} style={styles.heroImage} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard title={item.title} image={item.image} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/search' as Href)}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={trendingProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              category={item.category}
              price={item.price}
              rating={item.rating}
              image={item.image}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

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
    backgroundColor: BG,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  heroCard: {
    marginTop: 18,
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTextWrapper: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  heroText: {
    fontSize: 18,
    lineHeight: 30,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  heroImage: {
    width: 145,
    height: 170,
    borderRadius: 22,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: TEXT,
  },
  seeAllText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
  horizontalListContent: {
    paddingRight: 10,
  },
  bottomSpacing: {
    height: 120,
  },
});