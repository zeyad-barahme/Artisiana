export type Category = {
  id: string;
  title: string;
  image: string;
};

export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: string;
};

export const heroData = {
  title:
    'Explore unique handmade crafts created by talented artisans, featuring carefully designed products that celebrate creativity and authenticity.',
  image:
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
};

export const categories: Category[] = [
  {
    id: '1',
    title: 'All Crafts',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Ceramics',
    image:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80',
  },
];

export const trendingProducts: Product[] = [
  {
    id: '1',
    title: 'Boho Ceramic Vase',
    category: 'Ceramics',
    price: 24.99,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1612196808214-b7e239e5d136?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: '2',
    title: 'Embroidered Cushion',
    category: 'Home Decor',
    price: 32.5,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: '3',
    title: 'Handmade Necklace',
    category: 'Accessories',
    price: 18.75,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: '4',
    title: 'Clay Mug Set',
    category: 'Ceramics',
    price: 21.0,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80',
  },
];