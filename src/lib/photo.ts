/**
 * Photo selection via expo-image-picker. Returns a data URL so the image can
 * be embedded directly in the PDF (and preview) without relying on file paths.
 */
import * as ImagePicker from 'expo-image-picker';

export async function pickPhoto(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 5],
    quality: 0.7,
    base64: true,
  });
  if (result.canceled || !result.assets?.length) {
    return null;
  }
  const asset = result.assets[0];
  if (asset.base64) {
    const mime = asset.mimeType || 'image/jpeg';
    return `data:${mime};base64,${asset.base64}`;
  }
  return asset.uri ?? null;
}

/** True if permission was denied so the caller can show guidance. */
export async function photoPermissionDenied(): Promise<boolean> {
  const perm = await ImagePicker.getMediaLibraryPermissionsAsync();
  return !perm.granted && !perm.canAskAgain;
}
