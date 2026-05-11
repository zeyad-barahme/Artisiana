import { useCart } from "@/hooks/useCart";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/api/firebase";

export default function AppBar() {
  const { cartItems } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              setLoggingOut(true);
              await signOut(auth);
              router.replace("/entry-gate" as Href);
            } catch (error) {
              Alert.alert("Error", "Failed to logout");
              setLoggingOut(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.wrapper}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <Text style={styles.brandName}>Artisiana</Text>

      <TouchableOpacity
        style={styles.searchBox}
        activeOpacity={0.85}
        onPress={() => router.push("/(tabs)/search" as Href)}
      >
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.searchText}>search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push("/cart")}
      >
        <Feather name="shopping-cart" size={24} color="#FF7F50" />

        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Feather name="log-out" size={22} color="#F47C48" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  logoImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  brandName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F47C48",
    marginRight: 10,
  },

  searchBox: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#C9C2BE",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginRight: 10,
    backgroundColor: "#FFF",
  },

  searchIcon: {
    fontSize: 18,
    color: "#E08A61",
    marginRight: 8,
  },

  searchText: {
    fontSize: 16,
    color: "#E08A61",
  },

  cartButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF4D4D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  cartIcon: {
    fontSize: 24,
  },

  logoutButton: {
    marginLeft: 12,
    padding: 8,
  },
});
