import React from 'react';
import { TimelineAnchor, ChatMessage } from '../../../types';
import { useMediaReactionRecording } from '../../recorder';

interface UseSessionRecordingParams {
  currentTimeSec: number;
  formatTime: (sec: number) => string;
  isPlaying: boolean;
  togglePlay: () => void;
  setAnchors: React.Dispatch<React.SetStateAction<TimelineAnchor[]>>;
  setHasReaction: (val: boolean) => void;
  setSelectedAnchorId: (id: string | null) => void;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useSessionRecording({
  currentTimeSec,
  formatTime,
  isPlaying,
  togglePlay,
  setAnchors,
  setHasReaction,
  setSelectedAnchorId,
  setChatMessages,
}: UseSessionRecordingParams) {
  const handleKeepReaction = React.useCallback(
    (blob: Blob, durationSec: number) => {
      const blobUrl = URL.createObjectURL(blob);
      const timeFormatted = formatTime(currentTimeSec);
      const reactionId = `reaction-${currentTimeSec}-${durationSec}`;

      const reactionAnchor: TimelineAnchor = {
        id: reactionId,
        timeSec: currentTimeSec,
        timeFormatted,
        title: `My Reaction to ${timeFormatted}`,
        category: 'reaction',
        categoryLabel: 'MY REACTION',
        summary: `User recorded video/audio reflection at ${timeFormatted}.`,
        detail: `Duration: ${durationSec}s • Live WebM Capture`,
        isReaction: true,
        reactionDuration: `${durationSec}s`,
        mediaBlobUrl: blobUrl,
      };

      setAnchors((prev) => [...prev, reactionAnchor].sort((a, b) => a.timeSec - b.timeSec));
      setHasReaction(true);
      setSelectedAnchorId(reactionAnchor.id);

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-user-${currentTimeSec}`,
          sender: 'user',
          timestamp: timeFormatted,
          text: `I just recorded a reaction for ${timeFormatted}. Connect it to the timeline.`,
        },
        {
          id: `msg-asst-${currentTimeSec}`,
          sender: 'assistant',
          timestamp: timeFormatted,
          text: `Reaction attached! Your ${durationSec}s reflection is anchored at ${timeFormatted} and displayed on the Gem Rail.`,
        },
      ]);

      void fetch('/api/room/default-room/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reactionAnchor),
      }).catch(() => {});
    },
    [currentTimeSec, formatTime, setAnchors, setChatMessages, setHasReaction, setSelectedAnchorId]
  );

  const recorder = useMediaReactionRecording({
    onKeepReaction: handleKeepReaction,
  });

  const handleStartRecording = () => {
    if (isPlaying) {
      togglePlay();
    }
    recorder.openRecorder();
  };

  return {
    recorder,
    handleStartRecording,
  };
}
