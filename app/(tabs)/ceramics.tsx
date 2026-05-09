import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../../api/firebase"; // تأكد من المسار الصحيح لملف الفايربيس
import AppBar from '../../components/layout/AppBar';
import ProductCard from "../../components/ProductCard1w";
import BottomNavBar from '../../components/layout/BottomNavBar';

const localImages: { [key: string]: any } = {
  "ce1": require("../../assets/images/A1/ce1.webp"),
  "ce2": require("../../assets/images/A1/ce2.webp"),
  "ce3": require("../../assets/images/A1/ce3.webp"),
  "ce4": require("../../assets/images/A1/ce4.jpg"),
  "ce5": require("../../assets/images/A1/ce5.webp"),
  "ce6": require("../../assets/images/A1/ce6.jpg"),
};

export default function Ceramics() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Rancho_400Regular });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCeramics = async () => {
      try {
        const q = query(collection(db, "products"), where("category", "==", "Ceramics"));
        
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching ceramics: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCeramics();
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
          source={require("../../assets/images/A1/ce.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Ceramics</Text>

        <View style={styles.productsContainer}>
          {products.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              price={item.price}
              image={localImages[item.image] || require("../../assets/images/A1/ce1.webp")}
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  image: { width: "100%", height: 280, resizeMode: "cover" },
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