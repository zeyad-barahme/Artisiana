import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';

type Props = {
  title: string;
  price: number;
  image: ImageSourcePropType;
  desc: string;
  onAdd?: () => void;
  onPressCard?: () => void;
};

export default function ProductCard({ title, price, image, desc, onAdd, onPressCard }: Props) {

  return (
    <View style={styles.card}>

      <TouchableOpacity onPress={onPressCard}>
        <Image source={image} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>${price}</Text>

        <TouchableOpacity style={styles.button} onPress={onAdd}>
          <Text style={styles.buttonText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    width: '48%',
    marginBottom: 20,
    marginTop: 20,
    height: 300,
    justifyContent: 'space-between',
  },

  image: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },

  desc: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },

  rating: {
    color: '#FF5E22',
    fontSize: 12,
    marginTop: 'auto',
    marginBottom: 8,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    color: '#FF5E22',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#FF5E22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});
