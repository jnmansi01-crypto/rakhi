import { useState, useRef } from 'react';

export function useAudioRecorder(onRecordingComplete: (blob: Blob, url: string) => void) {
  const [recording, setRec] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];

      // Determine supported mimeTypes for cross-browser compatibility (especially iOS Safari)
      let options = {};
      const preferredTypes = [
        'audio/mp4',              // Preferred for iOS Safari (which doesn't support webm natively)
        'audio/webm;codecs=opus', // Preferred for Chrome/Firefox
        'audio/webm',
        'audio/ogg',
        'audio/wav'
      ];

      for (const type of preferredTypes) {
        if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(type)) {
          options = { mimeType: type };
          break;
        }
      }

      const mr = new MediaRecorder(stream, options);

      mr.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mr.onstop = () => {
        // Read the actual mimeType used during recording (fallback to browser standard)
        const mimeType = mr.mimeType || 'audio/webm';
        const blob = new Blob(chunks.current, { type: mimeType });

        // Guard: iOS Safari can sometimes produce a 0-byte blob — discard silently
        if (blob.size === 0) {
          console.warn('Voice recording produced an empty blob — discarding.');
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        const url  = URL.createObjectURL(blob);
        onRecordingComplete(blob, url);
        
        // Stop all media tracks to release microphone hardware lock
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      mediaRecorder.current = mr;
      setRec(true);
    } catch (err: any) { 
      console.error(err);
      alert('Microphone access requires a secure connection (HTTPS) or localhost. Please test on localhost, or deploy the app to test this feature on mobile.'); 
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRec(false);
  };

  return { recording, startRecording, stopRecording };
}
