import { db } from "@/api/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router, usePathname } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomNavBar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const activeRoutes = useMemo(
    () => ({
      isHome: pathname === "/(tabs)/home",
      isFavorites: pathname === "/(tabs)/favorites",
      isNotifications: pathname === "/(tabs)/notifications",
      isProfile: pathname === "/profile",
    }),
    [pathname]
  );

  const hasUnreadNotifications = useMemo(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  const goToHome = useCallback(() => {
    router.push("/(tabs)/home" as Href);
  }, []);

  const goToFavorites = useCallback(() => {
    router.push("/(tabs)/favorites" as Href);
  }, []);

  const goToNotifications = useCallback(() => {
    router.push("/(tabs)/notifications" as Href);
  }, []);

  const goToProfile = useCallback(() => {
    router.push("/profile" as Href);
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      setUnreadCount(0);
      return;
    }

    const unreadNotificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(
      unreadNotificationsQuery,
      (snapshot) => {
        setUnreadCount(snapshot.size);
      },
      (error) => {
        console.error("Failed to listen for unread notifications:", error);
        setUnreadCount(0);
      }
    );

    return unsubscribe;
  }, [isLoading, user]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={goToHome}
        activeOpacity={0.8}
      >
        <Feather
          name="home"
          size={22}
          color={activeRoutes.isHome ? "#F47C48" : "#C9AFA0"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={goToFavorites}
        activeOpacity={0.8}
      >
        <Feather
          name="heart"
          size={22}
          color={activeRoutes.isFavorites ? "#F47C48" : "#C9AFA0"}
        />
      </TouchableOpacity>

      <View style={styles.logoCircle}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.centerLogo}
          resizeMode="cover"
        />
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        activeOpacity={0.8}
        onPress={goToNotifications}
      >
        <Feather
          name="bell"
          size={21}
          color={activeRoutes.isNotifications ? "#F47C48" : "#C9AFA0"}
        />

        {hasUnreadNotifications ? <View style={styles.notificationDot} /> : null}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        activeOpacity={0.8}
        onPress={goToProfile}
      >
        <Feather
          name="user"
          size={21}
          color={activeRoutes.isProfile ? "#F47C48" : "#C9AFA0"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1E6DF",
  },

  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#F5E7DE",
    justifyContent: "center",
    alignItems: "center",
  },

  centerLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  notificationDot: {
    position: "absolute",
    right: 8,
    top: 7,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#FF4D4D",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});