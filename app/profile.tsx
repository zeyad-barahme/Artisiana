import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
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
import {
  getLocalAvatarUri,
  setLocalAvatarUri,
} from "@/services/profile-avatar-local";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/services/user-profile";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setImage(null);
        return;
      }
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
    } catch (e) {
      console.log(e);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow gallery access to choose a profile photo.",
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
        "Please allow camera access to take a profile photo.",
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

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Artisana</Text>
        </View>

        {/* Profile */}
        <View style={styles.profileBox}>
          <TouchableOpacity onPress={onPressAvatar}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name?.charAt(0)}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutBtn, { marginHorizontal: 15 }]}
          onPress={async () => {
            await signOut(auth);
            router.replace("/login" as Href);
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    padding: 15,
  },

  brand: {
    color: "#F47C4C",
    fontSize: 18,
    fontWeight: "bold",
  },

  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
  },

  name: { fontWeight: "bold" },

  email: { color: "#666" },

  editBtn: {
    backgroundColor: "#FAD1C2",
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  editText: { color: "#F47C4C" },

  section: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 15,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  order: { marginBottom: 5 },

  smallBtn: {
    backgroundColor: "#FAD1C2",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  smallBtnText: { color: "#F47C4C" },

  logoutBtn: {
    backgroundColor: "#F47C4C",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  logoutText: { color: "#fff" },
});
