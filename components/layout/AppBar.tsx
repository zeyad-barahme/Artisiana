import { useCart } from "@/hooks/useCart";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppBarProps = {
  isVisible?: boolean;
  floating?: boolean;
};

export default function AppBar({
  isVisible = true,
  floating = false,
}: AppBarProps) {
  const { totalItems } = useCart();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(0)).current;

  const appBarDynamicStyle = useMemo(
    () => ({
      width,
      height: 78 + insets.top,
      paddingTop: insets.top + 8,
      transform: [{ translateY }],
    }),
    [width, insets.top, translateY]
  );

  const hiddenTranslateY = useMemo(() => {
    return -(90 + insets.top);
  }, [insets.top]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : hiddenTranslateY,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isVisible, hiddenTranslateY, translateY]);

  const handleLogoPress = useCallback(() => {
    router.push("/(tabs)/home" as Href);
  }, []);

  const handleSearchPress = useCallback(() => {
    router.push("/(tabs)/search" as Href);
  }, []);

  const handleCartPress = useCallback(() => {
    router.push("/(tabs)/cart" as Href);
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        floating && styles.floatingWrapper,
        appBarDynamicStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.logoSection}
        activeOpacity={0.85}
        onPress={handleLogoPress}
      >
        <View style={styles.logoCircle}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
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
          onPress={handleSearchPress}
        >
          <Feather name="search" size={15} color="#FF7F50" />

          <Text style={styles.searchText} numberOfLines={1}>
            search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleCartPress}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    paddingHorizontal: 18,
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

  floatingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },

  logoSection: {
    width: 68,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    backgroundColor: "#F5E7DE",
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
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