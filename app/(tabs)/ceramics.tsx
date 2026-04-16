import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import AppBar from '../../components/layout/AppBar';
import ProductCard from "../../components/ProductCard1w";
import BottomNavBar from '../../components/layout/BottomNavBar';
export default function Ceramics() {
  const [fontsLoaded] = useFonts({
    Rancho_400Regular,
  });

  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={8}
        onScroll={(event) => {
          const currentY = event.nativeEvent.contentOffset.y;
          const diff = currentY - lastScrollY;

          if (diff > 5) {
            setShowNav(false); // 👇 نازل
          } else if (diff < -5) {
            setShowNav(true); // 👆 طالع
          }

          setLastScrollY(currentY);
        }}
      >
        {/* 🔥 App Bar */}
        <AppBar />

        {/* 🖼️ Cover */}
        <Image
          source={require("../../assets/images/A1/ce.png")}
          style={styles.image}
        />

        {/* 📌 Title */}
        <Text style={styles.title}>Ceramics</Text>

        {/* 🧩 Products */}
        <View style={styles.productsContainer}>
          <ProductCard
            title="Ceramic Vase"
            desc="Ceramic Vase Handmade Raw Stoneware Pottery Vases for Home Decor"
            price={25}
            image={require("../../assets/images/A1/ce1.webp")}
          />

          <ProductCard
            title=" Ceramic Bowl"
            desc="Handmade Carved Ceramic Serving Bowl: Dark Gray Pottery"
            price={9}
            image={require("../../assets/images/A1/ce2.webp")}
          />

          <ProductCard
            title="Ceramic Teapot's"
            desc="Our Australian designed Ceramic Teapot's have been handmade for all of the tea lovers out there!"
            price={15}
            image={require("../../assets/images/A1/ce3.webp")}
          />

          <ProductCard
            title="ceramic bears"
            desc="Chi’s handmade ceramic bears, blending art and function"
            price={10}
            image={require("../../assets/images/A1/ce4.jpg")}
          />

          <ProductCard
            title="Ceramic Bird"
            desc="Handmade Ceramic Bird Sculptures – Mini & Small Sizes"
            price={12}
            image={require("../../assets/images/A1/ce5.webp")}
          />

          <ProductCard
            title="Ceramic Mug"
            desc="Large You’ve Got This, Handmade Ceramic Green Stoneware Mug"
            price={8}
            image={require("../../assets/images/A1/ce6.jpg")}
          />
        </View>
      </ScrollView>

     <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  appName: {
    fontSize: 22,
    color: "#FF5E22",
    fontFamily: "Rancho_400Regular",
    marginLeft: 110,
  },

  icons: {
    flexDirection: "row",
  },

  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
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

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 55,
    borderTopWidth: 1,
    borderColor: "#eee",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  centerLogo: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
    marginTop: -4,
  },

  logoBottom: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
