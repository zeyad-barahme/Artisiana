import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
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

import { auth } from "@/api/firebase";
import AppBar from "@/components/layout/AppBar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import OrderCard from "@/components/profile/OrderCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileImagePreviewModal from "@/components/profile/ProfileImagePreviewModal";
import ProfileSection from "@/components/profile/ProfileSection";
import { useAutoHideAppBar } from "@/hooks/useAutoHideAppBar";
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
  markOrderAsReceived,
  type CheckoutOrder,
} from "@/services/orders/checkoutOrder.service";
import { notifyProfileUpdated } from "@/services/notifications/notification.service";

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
  const { isAppBarVisible, showAppBarWhileScrolling } = useAutoHideAppBar();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<
    Record<string, boolean>
  >({});

  const loadOrders = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    try {
      setOrdersLoading(true);
      const userOrders = await getOrdersByUser(firebaseUser.uid);
      setOrders(userOrders);
    } catch (error) {
      console.log("Error loading orders:", error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

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
        setImage(localAvatarUri || resolved.imageUrl || null);
      } catch (error) {
        console.log("Error loading profile:", error);
        Alert.alert("Error", "Could not load profile data.");
      } finally {
        setLoading(false);
      }

      await loadOrders();
    });

    return () => unsub();
  }, [loadOrders]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const activeOrders = useMemo(() => {
    return orders.filter((order) => order.status !== "received");
  }, [orders]);

  const receivedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "received");
  }, [orders]);

  const subscriptionPlan = useMemo(() => {
    return (user as any)?.subscriptionPlan || "Basic";
  }, [user]);

  const userInitial = useMemo(() => {
    return user?.name?.charAt(0)?.toUpperCase() || "U";
  }, [user?.name]);

  const toggleOrderExpanded = useCallback((orderId: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  const handleMarkOrderAsReceived = useCallback((order: CheckoutOrder) => {
    Alert.alert("Confirm received", "Did you receive this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, received",
        onPress: async () => {
          try {
            await markOrderAsReceived(order.id);

            setOrders((prevOrders) =>
              prevOrders.map((currentOrder) =>
                currentOrder.id === order.id
                  ? { ...currentOrder, status: "received" }
                  : currentOrder
              )
            );
          } catch (error) {
            console.log("Error marking order as received:", error);
            Alert.alert("Error", "Could not update order status.");
          }
        },
      },
    ]);
  }, []);

  const handleImageAsset = useCallback(
    async (asset: ImagePicker.ImagePickerAsset) => {
      if (!user) return;

      const uri = asset.uri;
      setImage(uri);
      setImagePreviewVisible(false);

      try {
        await setLocalAvatarUri(user.uid, uri);
        await updateUserProfile(user.uid, { imageUrl: uri });
        await notifyProfileUpdated(user.uid);
        setUser({ ...user, imageUrl: uri });
      } catch (error) {
        console.log("Error updating avatar:", error);
        Alert.alert("Error", "Could not update profile photo.");
      }
    },
    [user]
  );

  const pickFromGallery = useCallback(async () => {
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
  }, [handleImageAsset]);

  const pickFromCamera = useCallback(async () => {
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
  }, [handleImageAsset]);

  const openImagePickerOptions = useCallback(() => {
    Alert.alert("Profile photo", "Choose image source", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [pickFromCamera, pickFromGallery]);

  const handleDeletePhoto = useCallback(() => {
    if (!user) return;

    Alert.alert("Delete photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setImage(null);
            setImagePreviewVisible(false);

            await setLocalAvatarUri(user.uid, "");
            await updateUserProfile(user.uid, { imageUrl: null });
            await notifyProfileUpdated(user.uid);

            setUser({ ...user, imageUrl: null });
          } catch (error) {
            console.log("Error deleting avatar:", error);
            Alert.alert("Error", "Could not delete profile photo.");
          }
        },
      },
    ]);
  }, [user]);

  const onPressAvatar = useCallback(() => {
    if (image) {
      setImagePreviewVisible(true);
      return;
    }

    openImagePickerOptions();
  }, [image, openImagePickerOptions]);

  const handleEditProfile = useCallback(() => {
    openImagePickerOptions();
  }, [openImagePickerOptions]);

  const handleChangePassword = useCallback(() => {
    Alert.alert("Change Password", "This feature will be added soon.");
  }, []);

  const handleLogout = useCallback(() => {
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
  }, [router]);

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

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <AppBar isVisible={isAppBarVisible} floating />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={showAppBarWhileScrolling}
          onScrollBeginDrag={showAppBarWhileScrolling}
          onScrollEndDrag={showAppBarWhileScrolling}
          onMomentumScrollEnd={showAppBarWhileScrolling}
          scrollEventThrottle={16}
        >
          <ProfileHeader
            name={user.name}
            email={user.email}
            image={image}
            userInitial={userInitial}
            onPressAvatar={onPressAvatar}
            onEditProfile={handleEditProfile}
          />

          <ProfileSection title="Active Orders">
            {ordersLoading ? (
              <Text style={styles.sectionText}>Loading orders...</Text>
            ) : activeOrders.length === 0 ? (
              <Text style={styles.sectionText}>No active orders.</Text>
            ) : (
              activeOrders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={index}
                  expanded={!!expandedOrderIds[order.id]}
                  onToggle={() => toggleOrderExpanded(order.id)}
                  onReceived={() => handleMarkOrderAsReceived(order)}
                  getImage={getOrderImageSource}
                />
              ))
            )}
          </ProfileSection>

          <ProfileSection title="Received Orders">
            {ordersLoading ? (
              <Text style={styles.sectionText}>Loading orders...</Text>
            ) : receivedOrders.length === 0 ? (
              <Text style={styles.sectionText}>No received orders yet.</Text>
            ) : (
              receivedOrders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={index}
                  expanded={!!expandedOrderIds[order.id]}
                  onToggle={() => toggleOrderExpanded(order.id)}
                  onReceived={() => handleMarkOrderAsReceived(order)}
                  getImage={getOrderImageSource}
                />
              ))
            )}
          </ProfileSection>

          <ProfileSection title="Subscription">
            <Text style={styles.sectionText}>Plan : {subscriptionPlan}</Text>

            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => router.push("/(tabs)/subscription" as Href)}
            >
              <Text style={styles.smallBtnText}>Upgrade / Change plan</Text>
            </TouchableOpacity>
          </ProfileSection>

          <ProfileSection title="Setting">
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={handleChangePassword}
            >
              <Text style={styles.settingBtnText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ProfileSection>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        <BottomNavBar />
      </View>

      <ProfileImagePreviewModal
        visible={imagePreviewVisible}
        image={image}
        name={user.name || "User"}
        onClose={() => setImagePreviewVisible(false)}
        onChange={openImagePickerOptions}
        onDelete={handleDeletePhoto}
      />
    </View>
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
    paddingTop: 105,
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

  sectionText: {
    fontSize: 15,
    color: "#777",
    marginBottom: 12,
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