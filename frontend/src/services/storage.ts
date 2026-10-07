// ============================================================
// Firebase Storage service — image upload for reports
// ============================================================

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Upload a report image and return the public download URL.
 * @param file      - File object from an <input type="file">
 * @param userId    - The authenticated user's ID (used to scope path)
 * @param onProgress - Optional progress callback (0–100)
 */
export async function uploadReportImage(
  file: File,
  userId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `reports/${userId}/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);

  if (onProgress) {
    // Resumable upload with progress tracking
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        'state_changed',
        (snap: UploadTaskSnapshot) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          onProgress(pct);
        },
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref))
      );
    });
  }

  // Simple upload without progress
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

/**
 * Upload a user avatar/profile picture.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `avatars/${userId}/profile.${ext}`;
  const storageRef = ref(storage, path);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

/**
 * Delete a file from Firebase Storage by its full URL.
 */
export async function deleteStorageFile(url: string): Promise<void> {
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
}
