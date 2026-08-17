export async function uploadMedia(file: File | Blob, resourceType: 'image' | 'video' = 'image'): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Since we are using demo keys for now, we'll try to hit cloudinary but catch the error if demo keys are rejected
  if (!cloudName || !uploadPreset || cloudName === 'demo') {
    console.warn('Cloudinary using demo/missing credentials. Bypassing upload for testing.');
    // Return a dummy image or a dummy audio URL
    if (resourceType === 'video') {
       return 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'; // dummy audio
    }
    return `https://dummyimage.com/600x400/000/fff&text=demo_upload`;
  }

  const formData = new FormData();

  // Guard: Cloudinary rejects empty files with a cryptic error — catch this early
  if (file.size === 0) {
    throw new Error('The selected file appears to be empty or could not be read. Please try a different photo.');
  }

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(`Cloudinary upload timed out after 60 seconds. Please check your internet connection.`);
    }
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error(`Failed to reach Cloudinary (Network error or Ad-blocker).`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Cloudinary upload failed: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}
