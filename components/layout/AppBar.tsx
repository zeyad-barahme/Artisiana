import { auth } from "@/api/firebase";
import { useCart } from "@/hooks/useCart";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AppBar() {
  const { cartItems } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
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
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.leftSection}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.brandName} numberOfLines={1}>
          Artisiana
        </Text>
      </View>

      <TouchableOpacity
        style={styles.searchBox}
        activeOpacity={0.85}
        onPress={() => router.push("/(tabs)/search" as Href)}
      >
        <Feather name="search" size={16} color="#E08A61" />

        <Text style={styles.searchText} numberOfLines={1}>
          search
        </Text>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/(tabs)/cart" as Href)}
          activeOpacity={0.8}
        >
          <Feather name="shopping-cart" size={25} color="#FF7F50" />

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
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={24} color="#F47C48" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
  },

  logoImage: {
    width: 46,
    height: 46,
    marginRight: 6,
  },

  brandName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#F47C48",
    maxWidth: 100,
  },

  searchBox: {
    width: 96,
    height: 44,
    borderWidth: 1.5,
    borderColor: "#C9C2BE",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    marginHorizontal: 8,
    backgroundColor: "#FFF",
  },

  searchText: {
    fontSize: 15,
    color: "#E08A61",
    marginLeft: 5,
    fontWeight: "500",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "auto",
  },

  cartButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 10,
  },

  cartBadge: {
    position: "absolute",
    top: -7,
    right: -7,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
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

  logoutButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
});