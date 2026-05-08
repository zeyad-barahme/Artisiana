import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("app.db");

let isInitialized = false;

async function initAvatarTable() {
  if (isInitialized) return;
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS profile_avatars (
      uid TEXT PRIMARY KEY NOT NULL,
      image_uri TEXT
    );
  `);
  isInitialized = true;
}

export async function getLocalAvatarUri(uid: string): Promise<string | null> {
  await initAvatarTable();
  const db = await dbPromise;
  const row = await db.getFirstAsync<{ image_uri: string | null }>(
    "SELECT image_uri FROM profile_avatars WHERE uid = ?",
    [uid]
  );
  return row?.image_uri ?? null;
}

export async function setLocalAvatarUri(uid: string, uri: string) {
  await initAvatarTable();
  const db = await dbPromise;
  await db.runAsync(
    `
      INSERT INTO profile_avatars (uid, image_uri)
      VALUES (?, ?)
      ON CONFLICT(uid) DO UPDATE SET image_uri = excluded.image_uri
    `,
    [uid, uri]
  );
}
