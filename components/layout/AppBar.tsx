import { useCart } from "@/hooks/useCart";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function AppBar() {
  const { totalItems } = useCart();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, { width }]}>
      <TouchableOpacity
        style={styles.logoSection}
        activeOpacity={0.85}
        onPress={() => router.push("/(tabs)/home" as Href)}
      >
        <Image
          source={require("../../assets/images/brand-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.brandSection}>
        <Text style={styles.brandName} numberOfLines={1}>
          Artisiana
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.searchBox}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/search" as Href)}
        >
          <Feather name="search" size={15} color="#FF7F50" />

          <Text style={styles.searchText} numberOfLines={1}>
            search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/(tabs)/cart" as Href)}
          activeOpacity={0.8}
        >
          <Feather name="shopping-cart" size={27} color="#FF7F50" />

          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 86,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  logoSection: {
    width: 68,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  logoImage: {
    width: 58,
    height: 58,
  },

  brandSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  brandName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF5A2F",
    fontStyle: "italic",
  },

  rightSection: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  searchBox: {
    width: 105,
    height: 38,
    borderWidth: 1.5,
    borderColor: "#C9C2BE",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 7,
  },

  searchText: {
    fontSize: 17,
    color: "#FF7F50",
    marginLeft: 6,
    fontWeight: "400",
  },

  cartButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
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
    fontSize: 10,
    fontWeight: "800",
  },
});
