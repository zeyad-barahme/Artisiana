import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter, type Href } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/firebase";
import { uploadAvatar } from "@/services/storage";
import { getUserProfile, updateUserProfile, type UserProfile } from "@/services/user-profile";

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
      setUser(resolved);
      setImage(resolved.imageUrl ?? null);
    });
    return () => unsub();
  }, []);

  // 📸 اختيار صورة
  const pickImage = async () => {
    if (!user) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets?.[0];
      if (!asset) return;
      const uri = asset.uri;
      setImage(uri);

      try {
        const url = await uploadAvatar({ uid: user.uid, uri });
        await updateUserProfile(user.uid, { imageUrl: url });
        setUser({ ...user, imageUrl: url });
        setImage(url);
      } catch (e) {
        console.log(e);
      }
    }
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
          
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name?.charAt(0)}
                </Text>
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

      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navItem}>🏠</Text>
        <Text style={styles.navItem}>⬛</Text>
        <Text style={styles.navActive}>👤</Text>
        <Text style={styles.navItem}>🔔</Text>
        <Text style={styles.navItem}>🛒</Text>
      </View>

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

  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 10,
  },

  navItem: { fontSize: 20, color: "#999" },

  navActive: { fontSize: 20, color: "#F47C4C" },
});