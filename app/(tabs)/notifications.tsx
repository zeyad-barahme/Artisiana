import BottomNavBar from "@/components/layout/BottomNavBar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { db } from "@/api/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationType =
  | "order"
  | "payment"
  | "review"
  | "offer"
  | "subscription"
  | "profile"
  | "cart"
  | "system";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
  relatedScreen: string;
  relatedId: string;
  createdAt?: Timestamp | null;
}

interface NotificationDocument {
  title: string;
  message: string;
  time?: string;
  type: NotificationType;
  isRead: boolean;
  relatedScreen: string;
  relatedId: string;
  userId?: string | null;
  createdAt?: Timestamp | null;
}

const notificationMeta: Record<
  NotificationType,
  { icon: string; backgroundColor: string }
> = {
  order: { icon: "\u{1F4E6}", backgroundColor: "#FFF0E8" },
  payment: { icon: "\u{1F4B3}", backgroundColor: "#F0F6FF" },
  review: { icon: "\u{2B50}", backgroundColor: "#FFF8DF" },
  offer: { icon: "\u{1F381}", backgroundColor: "#FFEAF0" },
  subscription: { icon: "\u{1F451}", backgroundColor: "#FFF4DA" },
  profile: { icon: "\u{1F464}", backgroundColor: "#F2F0FF" },
  cart: { icon: "\u{1F6D2}", backgroundColor: "#EEF9F1" },
  system: { icon: "\u{1F514}", backgroundColor: "#EEF4FF" },
};

const notificationTypes: NotificationType[] = [
  "order",
  "payment",
  "review",
  "offer",
  "subscription",
  "profile",
  "cart",
  "system",
];

const isNotificationType = (type: unknown): type is NotificationType => {
  return typeof type === "string" && notificationTypes.includes(type as NotificationType);
};

const getCreatedAtMillis = (createdAt: unknown) => {
  if (createdAt instanceof Timestamp) {
    return createdAt.toMillis();
  }

  if (
    createdAt &&
    typeof createdAt === "object" &&
    "toMillis" in createdAt &&
    typeof createdAt.toMillis === "function"
  ) {
    return createdAt.toMillis();
  }

  return 0;
};

const formatNotificationTime = (createdAt?: Timestamp | null, fallbackTime = "") => {
  if (!createdAt || typeof createdAt.toDate !== "function") {
    return fallbackTime || "Just now";
  }

  const createdDate = createdAt.toDate();
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} h ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} d ago`;
  }

  return createdDate.toLocaleDateString();
};

export default function NotificationsScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setNotifications([]);
      setErrorMessage("Please sign in to see your notifications.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const nextNotifications: NotificationItem[] = snapshot.docs
          .sort((firstDoc, secondDoc) => {
            const firstData = firstDoc.data() as Partial<NotificationDocument>;
            const secondData = secondDoc.data() as Partial<NotificationDocument>;

            return (
              getCreatedAtMillis(secondData.createdAt) -
              getCreatedAtMillis(firstData.createdAt)
            );
          })
          .map((notificationDoc) => {
            const data = notificationDoc.data() as Partial<NotificationDocument>;
            const createdAt = data.createdAt ?? null;
            const fallbackTime = typeof data.time === "string" ? data.time : "";

            return {
              id: notificationDoc.id,
              title: typeof data.title === "string" ? data.title : "",
              message: typeof data.message === "string" ? data.message : "",
              time: formatNotificationTime(createdAt, fallbackTime),
              type: isNotificationType(data.type) ? data.type : "system",
              isRead: typeof data.isRead === "boolean" ? data.isRead : false,
              relatedScreen:
                typeof data.relatedScreen === "string" ? data.relatedScreen : "",
              relatedId: typeof data.relatedId === "string" ? data.relatedId : "",
              createdAt,
            };
          });

        setNotifications(nextNotifications);
        setErrorMessage("");
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load notifications from Firestore:", error);
        setNotifications([]);
        setErrorMessage("Unable to load notifications right now.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), {
        isRead: true,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) {
      return;
    }

    try {
      const unreadNotificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid)
      );

      const notificationsSnapshot = await getDocs(unreadNotificationsQuery);

      const unreadNotifications = notificationsSnapshot.docs.filter(
        (notificationDoc) => {
          const data = notificationDoc.data() as Partial<NotificationDocument>;
          return data.isRead === false;
        }
      );

      if (unreadNotifications.length === 0) {
        return;
      }

      const batch = writeBatch(db);

      unreadNotifications.forEach((notificationDoc) => {
        batch.update(notificationDoc.ref, {
          isRead: true,
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    markNotificationAsRead(notification.id);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/home");
  };

  const hasNotifications = notifications.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={22} color="#2F2A27" />
        </TouchableOpacity>

        <Text style={styles.pageHeaderTitle}>Notifications</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              Stay updated with your orders, reviews, and offers
            </Text>
          </View>

          {hasNotifications ? (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}
              activeOpacity={0.8}
            >
              <Text style={styles.markAllButtonText}>Mark all as read</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyMessage}>Loading notifications...</Text>
          </View>
        ) : hasNotifications ? (
          <View style={styles.list}>
            {notifications.map((notification) => {
              const meta = notificationMeta[notification.type];

              return (
                <TouchableOpacity
                  key={notification.id}
                  style={[styles.card, !notification.isRead && styles.unreadCard]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: meta.backgroundColor },
                    ]}
                  >
                    <Text style={styles.iconText}>{meta.icon}</Text>
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{notification.title}</Text>
                      {!notification.isRead ? <View style={styles.unreadDot} /> : null}
                    </View>

                    <Text style={styles.message}>{notification.message}</Text>
                    <Text style={styles.time}>{notification.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>{"\u{1F514}"}</Text>
            </View>

            <Text style={styles.emptyTitle}>No notifications yet</Text>

            <Text style={styles.emptyMessage}>
              {errorMessage || "You will see updates here when something happens"}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF7F3",
  },

  pageHeader: {
    alignItems: "center",
    backgroundColor: "#FFF7F3",
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: 16,
  },

  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    shadowColor: "#6F3D2B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    width: 40,
    elevation: 2,
  },

  pageHeaderTitle: {
    color: "#2F2A27",
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    marginRight: 40,
    textAlign: "center",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 96,
  },

  header: {
    gap: 18,
    marginBottom: 22,
  },

  headerText: {
    gap: 8,
  },

  title: {
    color: "#2F2A27",
    fontSize: 32,
    fontWeight: "800",
  },

  subtitle: {
    color: "#7A6F68",
    fontSize: 15,
    lineHeight: 22,
  },

  markAllButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B3D",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  markAllButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  list: {
    gap: 14,
  },

  card: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#6F3D2B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },

  unreadCard: {
    backgroundColor: "#FFFCFA",
    borderColor: "#FFD4C5",
  },

  iconCircle: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },

  iconText: {
    fontSize: 23,
  },

  cardContent: {
    flex: 1,
    gap: 6,
  },

  cardTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  cardTitle: {
    color: "#302A26",
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },

  unreadDot: {
    backgroundColor: "#FF6B3D",
    borderRadius: 5,
    height: 10,
    width: 10,
  },

  message: {
    color: "#655D58",
    fontSize: 14,
    lineHeight: 20,
  },

  time: {
    color: "#9A9089",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 80,
  },

  emptyIconCircle: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#6F3D2B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 80,
    elevation: 3,
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    color: "#302A26",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyMessage: {
    color: "#7A6F68",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});