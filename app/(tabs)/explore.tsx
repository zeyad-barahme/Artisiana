import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { useState } from "react";

const products = [
  {
    id: "1",
    title: "Handmade Vase",
    price: 20,
    image: "https://picsum.photos/200/200?random=1",
  },
  {
    id: "2",
    title: "Necklace",
    price: 15,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
  },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔍 Search..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
      />

      {filtered.length === 0 && (
        <Text style={styles.empty}>No results 😢</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6F3",
    padding: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  price: {
    color: "#E86A33",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
  },
});