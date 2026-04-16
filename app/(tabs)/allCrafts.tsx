import { Rancho_400Regular, useFonts } from "@expo-google-fonts/rancho";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import AppHeader from "../../components/AppHeader";
import ProductCard from "../../components/ProductCard1w";

export default function Home() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Rancho_400Regular,
  });

  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={8}
        onScroll={(event) => {
          const currentY = event.nativeEvent.contentOffset.y;
          const diff = currentY - lastScrollY;

          if (diff > 5) setShowNav(false);
          else if (diff < -5) setShowNav(true);

          setLastScrollY(currentY);
        }}
      >
        <AppHeader />

        <Image
          source={require("../../assets/images/A1/08bfaa47c6dec68aae046dcf5e766154b122ef7e.png")}
          style={styles.image}
        />

        <Text style={styles.title}>All Crafts</Text>

        <View style={styles.productsContainer}>
          <ProductCard
            title="Woven Basket Set"
            desc="Woven Wall Hanging Basket Set"
            price={35}
            image={require("../../assets/images/A1/a.webp")}
            onPressCard={() => router.push("/temp")}
            onAdd={() => router.push("/temp")}
          />

          <ProductCard
            title="Macrame Wall Hanging"
            desc="Boho Home Decor"
            price={8}
            image={require("../../assets/images/A1/b.jpg")}
            onPressCard={() => router.push("/temp")}
            onAdd={() => router.push("/temp")}
          />

          <ProductCard
            title="Kauna Long U Bag"
            desc="Eco Friendly Handmade Kauna Long U Bag"
            price={10}
            image={require("../../assets/images/A1/c.png")}
            onPressCard={() => router.push("/temp")}
            onAdd={() => router.push("/temp")}
          />
          <ProductCard
            title="crylic round miniature"
            desc="crylic round 4 inch hand painted miniature with easel"
            price={5}
            image={require("../../assets/images/A1/d.jpg")}
            onPressCard={() => router.push("/temp")}
            onAdd={() => router.push("/temp")}
          />
          <ProductCard
            title="painted kettle"
            desc="Hand painted kettle art, table decor, housewarming gift"
            price={18}
            image={require("../../assets/images/A1/e.jpg")}
            onPressCard={() => router.push("/temp")}
            onAdd={() => router.push("/temp")}
          />
          <ProductCard
            title="Wooden Flower"
            desc="Handmade Wooden Flower: Set Of 2 | Gift For Couples | Anniversary Gift"
            price={7}
            image={require("../../assets/images/A1/f.jpg")}
            onPressCard={() => router.push("/temp")}
            onAdd={() => router.push("/temp")}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { transform: [{ translateY: showNav ? 0 : 100 }] },
        ]}
      >
        <Appbar.Action
          icon="home-outline"
          color="#FF5E22"
          onPress={() => router.push("/temp")}
        />
        <Appbar.Action
          icon="apps"
          color="#FF5E22"
          onPress={() => router.push("/temp")}
        />

        <View style={styles.centerLogo}>
          <Image
            source={require("../../assets/images/A1/85baf6ab0c07af4b4fc9f32f981b7edb09861f2c.png")}
            style={styles.logoBottom}
          />
        </View>

        <Appbar.Action
          icon="bell-outline"
          color="#FF5E22"
          onPress={() => router.push("/temp")}
        />
        <Appbar.Action
          icon="account-outline"
          color="#FF5E22"
          onPress={() => router.push("/temp")}
        />
      </View>
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 55,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  centerLogo: { padding: 5 },
  logoBottom: { width: 40, height: 40, borderRadius: 20 },
});
