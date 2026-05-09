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
  "ac1": require("../../assets/images/A1/ac1.webp"),
  "ac2": require("../../assets/images/A1/ac2.jpg"),
  "ac3": require("../../assets/images/A1/ac3.webp"),
  "ac4": require("../../assets/images/A1/ac4.avif"),
  "ac5": require("../../assets/images/A1/ac5.webp"),
  "ac6": require("../../assets/images/A1/ac6.webp"),
};

export default function Accessories() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Rancho_400Regular });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const q = query(collection(db, "products"), where("category", "==", "Accessories"));
        
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching accessories: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
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
          source={require("../../assets/images/A1/ac.png")}
          style={styles.coverImage}
        />

        <Text style={styles.title}>Accessories</Text>

        <View style={styles.productsContainer}>
          {products.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              price={item.price}
              image={localImages[item.image] || require("../../assets/images/A1/ac1.webp")}
              
              onPressCard={() => router.push({
                pathname: "/productDetails",
                params: { productId: item.id }
              })}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  coverImage: { 
    width: "100%", 
    height: 280, 
    resizeMode: "cover" 
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 15,
    marginTop: 25,
    fontFamily: "Rancho_400Regular",
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});