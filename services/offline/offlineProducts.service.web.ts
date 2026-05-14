import AsyncStorage from "@react-native-async-storage/async-storage";

import { Product } from "../../hooks/useHomeData";

const OFFLINE_PRODUCTS_KEY = "artisiana_offline_products";

export const initOfflineProductsDatabase = async () => {
  return Promise.resolve();
};

export const saveOfflineProducts = async (products: Product[]) => {
  await AsyncStorage.setItem(OFFLINE_PRODUCTS_KEY, JSON.stringify(products));
};

export const getOfflineProducts = async (): Promise<Product[]> => {
  const data = await AsyncStorage.getItem(OFFLINE_PRODUCTS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as Product[];
  } catch {
    return [];
  }
};