import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, Rancho_400Regular } from '@expo-google-fonts/rancho';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { useCart } from '../../hooks/useCart';

const localImages: { [key: string]: any } = {
  a: require('../../assets/images/A1/a.webp'),
  b: require('../../assets/images/A1/b.jpg'),
  c: require('../../assets/images/A1/c.png'),
  d: require('../../assets/images/A1/d.jpg'),
  e: require('../../assets/images/A1/e.jpg'),
  f: require('../../assets/images/A1/f.jpg'),

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
};

const getProductImage = (image?: string) => {
  if (!image) {
    return require('../../assets/images/A1/a.webp');
  }

  if (image.startsWith('http')) {
    return { uri: image };
  }

  return localImages[image] || require('../../assets/images/A1/a.webp');
};

export default function ProductDetails() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const productId = params.productId || params.id;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Rancho_400Regular,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'products', productId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          console.log('No such product!');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    Alert.alert(
      'تمت الإضافة',
      'تم إضافة المنتج إلى سلة المشتريات بنجاح!',
      [
        { text: 'متابعة التسوق', style: 'cancel' },
        {
          text: 'الذهاب للسلة',
          onPress: () => router.push('/(tabs)/cart'),
        },
      ]
    );
  };

  const goToReviews = () => {
    if (!product) return;

    router.push({
      pathname: '/reviews/Reviews',
      params: { productId: product.id },
    });
  };

  const goToAddReview = () => {
    if (!product) return;

    router.push({
      pathname: '/reviews/AddReview',
      params: { productId: product.id },
    });
  };

  if (!fontsLoaded || loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF5E22"
        style={{ flex: 1 }}
      />
    );
  }

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text>Product not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Appbar.Action icon="arrow-left" color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
          <Appbar.Action icon="cart-outline" color="#FF5E22" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Product Details</Text>

        <Image
          source={getProductImage(product.image)}
          style={styles.mainImage}
        />

        <Text style={styles.productName}>{product.title}</Text>

        <Text style={styles.price}>${product.price}</Text>

        <Text style={styles.rating}>
          {'⭐'.repeat(Math.round(product.rating || 5))}
        </Text>

        <Text style={styles.descriptionTitle}>Description:</Text>

        <Text style={styles.description}>
          {product.desc || 'No description available for this product.'}
        </Text>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.fullCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.cartButtonText}>Add To Cart</Text>
          </TouchableOpacity>

          <View style={styles.reviewsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goToReviews}
            >
              <Text style={styles.secondaryButtonText}>Reviews</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goToAddReview}
            >
              <Text style={styles.secondaryButtonText}>Add Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontSize: 34,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
    fontFamily: 'Rancho_400Regular',
    color: '#000',
  },
  mainImage: {
    width: '90%',
    height: 260,
    alignSelf: 'center',
    borderRadius: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    color: '#000',
  },
  price: {
    fontSize: 24,
    color: '#FF5E22',
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20,
    color: '#FF5E22',
  },
  descriptionTitle: {
    fontSize: 24,
    marginTop: 25,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    marginHorizontal: 20,
    lineHeight: 24,
  },
  actionsSection: {
    marginTop: 35,
    paddingHorizontal: 20,
  },
  fullCartButton: {
    backgroundColor: '#FF5E22',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF5E22',
    paddingVertical: 12,
    width: '48%',
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF5E22',
    fontSize: 16,
    fontWeight: 'bold',
  },
});