import { useState, useRef, useEffect } from 'react';

export function useAudioRecorder(onRecordingComplete: (blob: Blob, url: string) => void) {
  const [recording, setRec] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isSecure && window.location.protocol !== 'https:') {
        setErrorMsg('Microphone recording requires a secure HTTPS connection. Please switch to https:// for voice recording, or click Next to skip.');
      }
    }
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);

    if (typeof window !== 'undefined' && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      setErrorMsg('Microphone recording is unavailable on this connection (HTTP). Please access via https:// or test on localhost. You can click Next to skip.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];

      let options = {};
      const preferredTypes = [
        'audio/mp4',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg',
        'audio/wav'
      ];

      for (const type of preferredTypes) {
        if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(type)) {
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
        const mimeType = mr.mimeType || 'audio/webm';
        const blob = new Blob(chunks.current, { type: mimeType });

        if (blob.size === 0) {
          console.warn('Voice recording produced an empty blob — discarding.');
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        const url = URL.createObjectURL(blob);
        onRecordingComplete(blob, url);
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      mediaRecorder.current = mr;
      setRec(true);
    } catch (err: any) { 
      console.error(err);
      setErrorMsg('Microphone access requires HTTPS or permission approval. You can skip this step and click Next.'); 
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRec(false);
  };

  return { recording, errorMsg, startRecording, stopRecording };
}
