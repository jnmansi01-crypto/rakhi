import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5,           // Raised from 0.08 — 80KB was too aggressive and caused empty blobs on iOS HEIC photos
    maxWidthOrHeight: 1200,   // Allow slightly higher resolution for better quality
    useWebWorker: true,
    fileType: 'image/jpeg',   // Force JPEG output — ensures HEIC/HEIF photos are converted to a web-safe format
  };
  try {
    const compressedFile = await imageCompression(file, options);
    // Guard: if compression produced an empty file (can happen on iOS), return the original
    if (compressedFile.size === 0) {
      console.warn('Compression produced empty file, using original:', file.name);
      return file;
    }
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
}

export function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
