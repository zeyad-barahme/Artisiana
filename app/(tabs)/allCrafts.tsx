import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../../api/firebase"; 
import AppBar from '../../components/layout/AppBar';
import ProductCard from "../../components/ProductCard1w";
import BottomNavBar from '../../components/layout/BottomNavBar';

const localImages: { [key: string]: any } = {
  "a": require("../../assets/images/A1/a.webp"),
  "b": require("../../assets/images/A1/b.jpg"),
  "c": require("../../assets/images/A1/c.png"),
  "d": require("../../assets/images/A1/d.jpg"),
  "e": require("../../assets/images/A1/e.jpg"),
  "h": require("../../assets/images/A1/f.jpg"),
};

export default function AllCrafts() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Rancho_400Regular });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
     
        const q = query(collection(db, "products"), where("category", "==", "All Crafts"));
        
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#FF5E22" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <AppBar />
        <Image
          source={require("../../assets/images/A1/08bfaa47c6dec68aae046dcf5e766154b122ef7e.png")}
          style={styles.image}
        />
        <Text style={styles.title}>All Crafts</Text>

        <View style={styles.productsContainer}>
          {products.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              price={item.price}
              image={localImages[item.image] || require("../../assets/images/A1/a.webp")}
              
              onPressCard={() => router.push({
                pathname: "/productDetails",
                params: { productId: item.id }
              })}
              onAdd={() => console.log("Added to cart:", item.id)}
            />
          ))}
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  image: { width: "100%", height: 280 },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Rancho_400Regular",
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});