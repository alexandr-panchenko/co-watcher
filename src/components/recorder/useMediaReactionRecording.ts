import { useState, useEffect, useRef, useCallback } from 'react';

interface UseMediaReactionRecordingProps {
  onKeepReaction: (recordedBlob: Blob, durationSec: number) => void;
}

export function useMediaReactionRecording({
  onKeepReaction,
}: UseMediaReactionRecordingProps) {
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micAudioLevel, setMicAudioLevel] = useState(65);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Setup camera/audio stream when entering recording mode
  useEffect(() => {
    let active = true;

    async function initStream() {
      if (!isRecordingMode) {
        // Clean up streams
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (audioContextRef.current) {
          void audioContextRef.current.close().catch(() => {});
          audioContextRef.current = null;
        }
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: cameraOn,
            audio: true,
          });

          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            void videoRef.current.play().catch(() => {});
          }

          // Audio meter via Web Audio API
          const AudioContextClass = window.AudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!active || !streamRef.current) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i] ?? 0;
              }
              const avg = sum / dataArray.length;
              setMicAudioLevel(Math.min(95, Math.max(20, Math.floor(avg * 1.5))));
              requestAnimationFrame(checkVolume);
            };
            requestAnimationFrame(checkVolume);
          }
        }
      } catch (err) {
        console.warn('getUserMedia error (falling back to simulated levels):', err);
      }
    }

    void initStream();

    return () => {
      active = false;
    };
  }, [isRecordingMode, cameraOn]);

  // Recording timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecordingMode && isRecordingActive) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => (prev < 30 ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingMode, isRecordingActive]);

  const startActualRecording = useCallback(() => {
    recordedChunksRef.current = [];
    setRecordedBlobUrl(null);
    setRecordingSeconds(0);
    setIsRecordingActive(true);

    if (streamRef.current && typeof MediaRecorder !== 'undefined') {
      try {
        const mimeType = MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';
        const recorder = new MediaRecorder(streamRef.current, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setRecordedBlobUrl(url);
        };

        recorder.start(500);
      } catch (e) {
        console.warn('MediaRecorder init failed:', e);
      }
    }
  }, []);

  const pauseRecording = useCallback(() => {
    setIsRecordingActive(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    }
  }, []);

  const resumeRecording = useCallback(() => {
    setIsRecordingActive(true);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }
  }, []);

  const stopAndKeep = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    const duration = recordingSeconds > 0 ? recordingSeconds : 15;
    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });

    setIsRecordingActive(false);
    setIsRecordingMode(false);
    onKeepReaction(blob, duration);
  }, [recordingSeconds, onKeepReaction]);

  const retakeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    recordedChunksRef.current = [];
    setRecordedBlobUrl(null);
    setRecordingSeconds(0);
    startActualRecording();
  }, [startActualRecording]);

  const openRecorder = useCallback(() => {
    setIsRecordingMode(true);
    startActualRecording();
  }, [startActualRecording]);

  const closeRecorder = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingMode(false);
    setIsRecordingActive(false);
  }, []);

  return {
    isRecordingMode,
    isRecordingActive,
    recordingSeconds,
    cameraOn,
    micAudioLevel,
    videoRef,
    recordedBlobUrl,
    setCameraOn,
    openRecorder,
    closeRecorder,
    pauseRecording,
    resumeRecording,
    retakeRecording,
    stopAndKeep,
  };
}
