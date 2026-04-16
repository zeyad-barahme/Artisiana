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

