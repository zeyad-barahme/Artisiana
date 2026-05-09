import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type Props = {
  id?: string;
  title: string;
  price: number;
  image: any; 
  desc: string;
  category?: string;
  rating?: number;
  onAdd?: () => void;
  onPressCard?: () => void;
};

export default function ProductCard({ title, price, image, desc, category, rating, onAdd, onPressCard }: Props) {

  return (
    <View style={styles.card}>

      {/* 🖼️ Product Image */}
      <TouchableOpacity onPress={onPressCard}>
        <Image
          source={typeof image === 'string' ? { uri: image } : image}
          style={styles.image}
        />
      </TouchableOpacity>

      {/* 📌 Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {category && <Text style={styles.categoryText}>{category}</Text>}

        <Text style={styles.desc} numberOfLines={2}>
          {desc}
        </Text>

        <Text style={styles.rating}>
          {"⭐".repeat(rating || 5)}
        </Text>
      </View>

      {/* 🔥 Bottom Row */}
      <View style={styles.bottomRow}>
        <Text style={styles.price}>
          ${price}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onAdd}
        >
          <Text style={styles.buttonText}>
            Add To Cart
          </Text>
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
    width: 180, // عرض ثابت ليناسب القائمة الأفقية في الهوم
    marginRight: 15,
    marginBottom: 20,
    marginTop: 20,
    height: 320,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  categoryText: {
    fontSize: 11,
    color: '#FF5E22',
    marginTop: 2,
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