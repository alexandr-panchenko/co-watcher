import { useState, useEffect, useRef, useCallback } from 'react';

interface UseYouTubePlaybackOptions {
  initialVideoId: string;
  initialTimeSec?: number;
  isRecordingMode?: boolean;
}

export function useYouTubePlayback({
  initialVideoId,
  initialTimeSec = 845,
  isRecordingMode = false,
}: UseYouTubePlaybackOptions) {
  const [videoId, setVideoId] = useState<string>(initialVideoId);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(initialTimeSec);
  const [durationSec, setDurationSec] = useState<number>(2294);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const playerRef = useRef<YT.Player | null>(null);
  const containerId = 'yt-player-container-main';

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.YT || !window.YT.Player) {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      const el = document.getElementById(containerId);
      if (!el || playerRef.current) return;

      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          start: Math.floor(initialTimeSec),
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            setIsReady(true);
            const dur = event.target.getDuration();
            if (dur && dur > 0) setDurationSec(dur);
            event.target.setVolume(volume);
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        playerRef.current = null;
      }
    };
  }, [videoId, initialTimeSec, volume]);

  // Sync playback time tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isRecordingMode) {
      interval = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime();
            if (typeof time === 'number' && !isNaN(time)) {
              setCurrentTimeSec(Math.floor(time));
            }
          } catch {
            // fallback
          }
        } else {
          setCurrentTimeSec((prev) => Math.min(prev + 1, durationSec));
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isRecordingMode, durationSec]);

  // Pause playback when entering recording mode
  const wasRecordingRef = useRef(isRecordingMode);
  useEffect(() => {
    if (isRecordingMode && !wasRecordingRef.current) {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
      setTimeout(() => {
        setIsPlaying(false);
      }, 0);
    }
    wasRecordingRef.current = isRecordingMode;
  }, [isRecordingMode]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') {
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const seekTo = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, durationSec));
    setCurrentTimeSec(clamped);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(clamped, true);
      } catch {
        // ignore
      }
    }
  }, [durationSec]);

  const toggleSpeed = useCallback(() => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex] ?? 1.0;
    setPlaybackSpeed(nextSpeed);
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(nextSpeed);
    }
  }, [playbackSpeed]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (playerRef.current) {
      if (nextMuted && typeof playerRef.current.mute === 'function') {
        playerRef.current.mute();
      } else if (!nextMuted && typeof playerRef.current.unMute === 'function') {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    if (isMuted) setIsMuted(false);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(val);
    }
  }, [isMuted]);

  const changeVideo = useCallback((newVideoId: string) => {
    setVideoId(newVideoId);
    setIsReady(false);
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById(newVideoId, 0);
      setCurrentTimeSec(0);
    }
  }, []);

  return {
    videoId,
    containerId,
    isPlaying,
    currentTimeSec,
    durationSec,
    playbackSpeed,
    volume,
    isMuted,
    isReady,
    togglePlay,
    seekTo,
    toggleSpeed,
    toggleMute,
    handleVolumeChange,
    changeVideo,
  };
}
