import AsyncStorage from "@react-native-async-storage/async-storage";

const AVATAR_KEY_PREFIX = "profile_avatar_";

export async function getLocalAvatarUri(uid: string): Promise<string | null> {
  return AsyncStorage.getItem(`${AVATAR_KEY_PREFIX}${uid}`);
}

export async function setLocalAvatarUri(uid: string, uri: string): Promise<void> {
  await AsyncStorage.setItem(`${AVATAR_KEY_PREFIX}${uid}`, uri);
}