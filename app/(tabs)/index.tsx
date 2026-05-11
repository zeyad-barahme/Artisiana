import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';

import CategoryCard from '../../components/common/CategoryCard';
import ProductCard1w from '../../components/ProductCard1w';
import AppBar from '../../components/layout/AppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { db } from '../../api/firebase';
import { heroData } from '../../components/data/homeData';
import { useCart } from '../../hooks/useCart';

const BG = '#FFF7F3';
const TEXT = '#222222';
const CARD = '#FFFFFF';
const PRIMARY = '#F47C48';

type Category = {
  id: string;
  title: string;
  image: string;
};

type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  rating?: number;
  category?: string;
  desc?: string;
};

const productImages: Record<string, any> = {
  ac: require('../../assets/images/A1/ac.png'),
  ac1: require('../../assets/images/A1/ac1.webp'),
  ac2: require('../../assets/images/A1/ac2.jpg'),
  ac3: require('../../assets/images/A1/ac3.webp'),
  ac4: require('../../assets/images/A1/ac4.avif'),
  ac5: require('../../assets/images/A1/ac5.webp'),
  ac6: require('../../assets/images/A1/ac6.webp'),

  ce: require('../../assets/images/A1/ce.png'),
  ce1: require('../../assets/images/A1/ce1.webp'),
  ce2: require('../../assets/images/A1/ce2.webp'),
  ce3: require('../../assets/images/A1/ce3.webp'),
  ce4: require('../../assets/images/A1/ce4.jpg'),
  ce5: require('../../assets/images/A1/ce5.webp'),
  ce6: require('../../assets/images/A1/ce6.jpg'),

  a: require('../../assets/images/A1/a.webp'),
  b: require('../../assets/images/A1/b.jpg'),
  c: require('../../assets/images/A1/c.png'),
  d: require('../../assets/images/A1/d.jpg'),
  e: require('../../assets/images/A1/e.jpg'),
  f: require('../../assets/images/A1/f.jpg'),
};

const getProductImage = (image?: string) => {
  if (!image) {
    return require('../../assets/images/A1/a.webp');
  }

  if (image.startsWith('http')) {
    return image;
  }

  return productImages[image] || require('../../assets/images/A1/a.webp');
};

export default function HomeScreen() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));

        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Category, 'id'>),
        }));

        setCategories(categoriesData);
      } catch (error) {
        console.log('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, 'id'>),
        }));

        setProducts(productsData);
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const goToProductDetails = (productId: string) => {
    router.push({
      pathname: '/(tabs)/productDetails',
      params: { productId },
    } as Href);
  };

  const handleAddToCart = (item: Product) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    });

    Alert.alert('Added', 'Product added to cart successfully.');
  };

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

        {loadingCategories ? (
          <ActivityIndicator size="small" color={PRIMARY} style={styles.loader} />
        ) : (
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
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/search' as Href)}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {loadingProducts ? (
          <ActivityIndicator size="small" color={PRIMARY} style={styles.loader} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard1w
                id={item.id}
                title={item.title}
                category={item.category}
                price={item.price}
                rating={item.rating}
                image={getProductImage(item.image)}
                desc={item.desc || ''}
                onAdd={() => handleAddToCart(item)}
                onPressCard={() => goToProductDetails(item.id)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        )}

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
  loader: {
    marginVertical: 20,
  },
  bottomSpacing: {
    height: 120,
  },
});