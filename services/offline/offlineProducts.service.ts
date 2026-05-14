import * as SQLite from "expo-sqlite";

import { Product } from "../../hooks/useHomeData";

type OfflineProductRow = {
  id: string;
  title: string;
  price: number;
  image: string | null;
  desc: string | null;
  category: string | null;
  rating: number | null;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("artisiana_offline.db");
  }

  return databasePromise;
};

export const initOfflineProductsDatabase = async () => {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS offline_products (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      desc TEXT,
      category TEXT,
      rating REAL,
      updatedAt TEXT NOT NULL
    );
  `);
};

export const saveOfflineProducts = async (products: Product[]) => {
  const db = await getDatabase();

  await initOfflineProductsDatabase();

  for (const product of products) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO offline_products
      (id, title, price, image, desc, category, rating, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        product.id,
        product.title,
        Number(product.price || 0),
        product.image || null,
        product.desc || "",
        product.category || "",
        Number(product.rating || 5),
        new Date().toISOString(),
      ]
    );
  }
};

export const getOfflineProducts = async (): Promise<Product[]> => {
  const db = await getDatabase();

  await initOfflineProductsDatabase();

  const rows = await db.getAllAsync<OfflineProductRow>(`
    SELECT id, title, price, image, desc, category, rating
    FROM offline_products
    ORDER BY updatedAt DESC;
  `);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    price: Number(row.price || 0),
    image: row.image || "",
    desc: row.desc || "",
    category: row.category || "",
    rating: Number(row.rating || 5),
  }));
};