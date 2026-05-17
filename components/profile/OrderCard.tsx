import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";

type Props = {
  order: any;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onReceived: () => void;
  getImage: (image?: string) => any;
};

export default function OrderCard({
  order,
  index,
  expanded,
  onToggle,
  onReceived,
  getImage,
}: Props) {
  const items = order.items || [];
  const isReceived = order.status === "received";

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.summary} onPress={onToggle}>
        <View>
          <Text style={styles.orderNum}>Order #{index + 1}</Text>
          <Text>Items: {items.length}</Text>
        </View>

        <View style={styles.rightSide}>
          <Text style={[styles.status, isReceived && styles.receivedStatus]}>
            {order.status || "submitted"}
          </Text>

          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={isReceived ? "#2F8F46" : "#777"}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View>
          {!isReceived ? (
            <TouchableOpacity style={styles.button} onPress={onReceived}>
              <Text style={styles.buttonText}>Mark as received</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.receivedBadge}>
              <Text style={styles.receivedBadgeText}>Received</Text>
            </View>
          )}

          {items.map((item: any) => (
            <View key={item.id} style={styles.item}>
              <Image source={getImage(item.image)} style={styles.image} />

              <View>
                <Text>{item.title}</Text>
                <Text>${item.price}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rightSide: {
    alignItems: "flex-end",
  },

  orderNum: {
    fontWeight: "700",
  },

  status: {
    fontSize: 13,
    color: "#F47C4C",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  receivedStatus: {
    color: "#2F8F46",
  },

  button: {
    backgroundColor: "#F47C4C",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },

  receivedBadge: {
    backgroundColor: "#EEF9F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },

  receivedBadgeText: {
    color: "#2F8F46",
    fontWeight: "800",
  },

  item: {
    flexDirection: "row",
    marginTop: 10,
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});