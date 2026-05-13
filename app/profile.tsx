import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/api/firebase";
import AppBar from "@/components/layout/AppBar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import {
  getLocalAvatarUri,
  setLocalAvatarUri,
} from "@/services/profile-avatar-local";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/services/user-profile";
import {
  getOrdersByUser,
  type CheckoutOrder,
} from "@/services/orders/checkoutOrder.service";

const orderImages: Record<string, any> = {
  ac: require("../assets/images/A1/ac.png"),
  ac1: require("../assets/images/A1/ac1.webp"),
  ac2: require("../assets/images/A1/ac2.jpg"),
  ac3: require("../assets/images/A1/ac3.webp"),
  ac4: require("../assets/images/A1/ac4.avif"),
  ac5: require("../assets/images/A1/ac5.webp"),
  ac6: require("../assets/images/A1/ac6.webp"),

  ce: require("../assets/images/A1/ce.png"),
  ce1: require("../assets/images/A1/ce1.webp"),
  ce2: require("../assets/images/A1/ce2.webp"),
  ce3: require("../assets/images/A1/ce3.webp"),
  ce4: require("../assets/images/A1/ce4.jpg"),
  ce5: require("../assets/images/A1/ce5.webp"),
  ce6: require("../assets/images/A1/ce6.jpg"),

  a: require("../assets/images/A1/a.webp"),
  b: require("../assets/images/A1/b.jpg"),
  c: require("../assets/images/A1/c.png"),
  d: require("../assets/images/A1/d.jpg"),
  e: require("../assets/images/A1/e.jpg"),
  f: require("../assets/images/A1/f.jpg"),
};

const getOrderImageSource = (image?: string) => {
  if (!image) {
    return require("../assets/images/A1/a.webp");
  }

  if (image.startsWith("http")) {
    return { uri: image };
  }

  return orderImages[image] || require("../assets/images/A1/a.webp");
};

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setOrdersLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setImage(null);
        setOrders([]);
        setLoading(false);
        setOrdersLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);

        const fallback: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
          imageUrl: null,
        };

        const resolved = profile ?? fallback;
        const localAvatarUri = await getLocalAvatarUri(firebaseUser.uid);

        setUser(resolved);
        setImage(localAvatarUri ?? resolved.imageUrl ?? null);
      } catch (error) {
        console.log("Error loading profile:", error);
        Alert.alert("Error", "Could not load profile data.");
      } finally {
        setLoading(false);
      }

      try {
        const userOrders = await getOrdersByUser(firebaseUser.uid);
        setOrders(userOrders);
      } catch (ordersError) {
        console.log("Error loading orders:", ordersError);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleImageAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!user) return;

    const uri = asset.uri;
    setImage(uri);

    try {
      await setLocalAvatarUri(user.uid, uri);
      await updateUserProfile(user.uid, { imageUrl: uri });
      setUser({ ...user, imageUrl: uri });
    } catch (error) {
      console.log("Error updating avatar:", error);
      Alert.alert("Error", "Could not update profile photo.");
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow gallery access to choose a profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      await handleImageAsset(result.assets[0]);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow camera access to take a profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      await handleImageAsset(result.assets[0]);
    }
  };

  const onPressAvatar = () => {
    Alert.alert("Profile photo", "Choose image source", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Tap your profile picture to change your photo."
    );
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "This feature will be added soon.");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/entry-gate" as Href);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F47C4C" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No user logged in.</Text>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/login" as Href)}
        >
          <Text style={styles.loginText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userInitial = user.name?.charAt(0)?.toUpperCase() || "U";
  const subscriptionPlan = (user as any).subscriptionPlan || "Basic";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AppBar />

          <View style={styles.profileBox}>
            <TouchableOpacity onPress={onPressAvatar} activeOpacity={0.8}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.switchText}>Switchs Profile</Text>

              <Text style={styles.name}>{user.name || "User"}</Text>
              <Text style={styles.email}>{user.email}</Text>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={handleEditProfile}
              >
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Orders</Text>

            {ordersLoading ? (
              <Text style={styles.sectionText}>Loading orders...</Text>
            ) : orders.length === 0 ? (
              <Text style={styles.sectionText}>No orders yet.</Text>
            ) : (
              orders.map((order, index) => {
                const items = order.items || [];
                const itemsCount = items.length;

                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderTopRow}>
                      <Text style={styles.orderNumber}>Order #{index + 1}</Text>

                      <Text style={styles.orderStatus}>
                        {order.status || "submitted"}
                      </Text>
                    </View>

                    <Text style={styles.orderDetails}>
                      Items: {itemsCount} • Total: $
                      {Number(order.total || 0).toFixed(2)}
                    </Text>

                    {items.map((item) => (
                      <View key={item.id} style={styles.orderItemRow}>
                        <View style={styles.orderItemImageBox}>
                          <Image
                            source={getOrderImageSource(item.image)}
                            style={styles.orderItemImage}
                            resizeMode="cover"
                          />

                          <View style={styles.quantityBadge}>
                            <Text style={styles.quantityText}>
                              {item.quantity}x
                            </Text>
                          </View>
                        </View>

                        <View style={styles.orderItemInfo}>
                          <Text style={styles.orderItemTitle}>
                            {item.title}
                          </Text>

                          <Text style={styles.orderItemPrice}>
                            ${Number(item.price || 0).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <Text style={styles.sectionText}>Plan : {subscriptionPlan}</Text>

            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => router.push("/(tabs)/subscription" as Href)}
            >
              <Text style={styles.smallBtnText}>Upgrade / Change plan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setting</Text>

            <TouchableOpacity
              style={styles.settingBtn}
              onPress={handleChangePassword}
            >
              <Text style={styles.settingBtnText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1ED",
  },

  page: {
    flex: 1,
    backgroundColor: "#FFF7F3",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 100,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },

  loginBtn: {
    backgroundColor: "#F47C4C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  loginText: {
    color: "#fff",
    fontWeight: "700",
  },

  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E0DC",
    marginTop: 14,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 18,
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  profileInfo: {
    flex: 1,
  },

  switchText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },

  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 6,
  },

  email: {
    fontSize: 14,
    color: "#333",
    marginBottom: 18,
  },

  editBtn: {
    width: 130,
    backgroundColor: "#FFD3C6",
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
  },

  editText: {
    color: "#F47C4C",
    fontSize: 14,
    fontWeight: "500",
  },

  section: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E0DC",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "#222",
    marginBottom: 14,
  },

  sectionText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },

  orderCard: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE2DD",
  },

  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  orderNumber: {
    fontSize: 15,
    color: "#222",
    fontWeight: "700",
  },

  orderDetails: {
    fontSize: 13,
    color: "#777",
    marginBottom: 10,
  },

  orderStatus: {
    fontSize: 13,
    color: "#F47C4C",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  orderItemImageBox: {
    width: 58,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFF1ED",
    position: "relative",
    marginRight: 12,
  },

  orderItemImage: {
    width: "100%",
    height: "100%",
  },

  orderItemInfo: {
    flex: 1,
  },

  orderItemTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },

  orderItemPrice: {
    fontSize: 13,
    color: "#777",
  },

  quantityBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: "#F47C4C",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },

  quantityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  smallBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FFD3C6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  smallBtnText: {
    color: "#F47C4C",
    fontSize: 14,
    fontWeight: "500",
  },

  settingBtn: {
    alignSelf: "flex-start",
    minWidth: 190,
    backgroundColor: "#FFD3C6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  settingBtnText: {
    color: "#F47C4C",
    fontSize: 14,
    fontWeight: "500",
  },

  logoutBtn: {
    alignSelf: "flex-start",
    minWidth: 130,
    backgroundColor: "#FFD3C6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  logoutText: {
    color: "#F47C4C",
    fontSize: 14,
    fontWeight: "500",
  },

  bottomSpacing: {
    height: 70,
  },
});