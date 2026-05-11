import Feather from "@expo/vector-icons/Feather";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const localImages: { [key: string]: any } = {
  a: require("../../assets/images/A1/a.webp"),
  b: require("../../assets/images/A1/b.jpg"),
  c: require("../../assets/images/A1/c.png"),
  d: require("../../assets/images/A1/d.jpg"),
  e: require("../../assets/images/A1/e.jpg"),
  h: require("../../assets/images/A1/f.jpg"),
  ac1: require("../../assets/images/A1/ac1.webp"),
  ac2: require("../../assets/images/A1/ac2.jpg"),
  ac3: require("../../assets/images/A1/ac3.webp"),
  ac4: require("../../assets/images/A1/ac4.avif"),
  ac5: require("../../assets/images/A1/ac5.webp"),
  ac6: require("../../assets/images/A1/ac6.webp"),
  ce1: require("../../assets/images/A1/ce1.webp"),
  ce2: require("../../assets/images/A1/ce2.webp"),
  ce3: require("../../assets/images/A1/ce3.webp"),
  ce4: require("../../assets/images/A1/ce4.jpg"),
  ce5: require("../../assets/images/A1/ce5.webp"),
  ce6: require("../../assets/images/A1/ce6.jpg"),
};

type CartItemProps = {
  image: string;
  title: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
};

export default function CartItem({
  image,
  title,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onDelete,
}: CartItemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={localImages[image] || require("../../assets/images/A1/a.webp")}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={onDecrease}>
            <Feather name="minus" size={20} color="#FF7F50" />
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity onPress={onIncrease}>
            <Feather name="plus" size={20} color="#FF7F50" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Feather name="trash-2" size={18} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 55,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    color: "#000000",
    marginBottom: 25,
    marginHorizontal: 15,
    fontFamily: "Roboto_400Regular",
  },

  price: {
    color: "#FF7F50",
    fontSize: 21,
    marginBottom: 6,
    marginHorizontal: 16,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantity: {
    fontSize: 17,
    color: "#FF7F50",
    marginHorizontal: 15,
  },

  deleteBtn: {
    backgroundColor: "#FF9999",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});