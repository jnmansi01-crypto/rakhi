import { useState, useRef } from 'react';

export function useAudioRecorder(onRecordingComplete: (blob: Blob, url: string) => void) {
  const [recording, setRec] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        onRecordingComplete(blob, url);
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
