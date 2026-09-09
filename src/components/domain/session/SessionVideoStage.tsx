import React from 'react';
import { TimelineAnchor, ViewMode } from '../../../types';
import { YouTubePlayer } from '../../player';
import { GemRail } from '../../rail';

interface PlaybackHandle {
  containerId: string;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
  isReady: boolean;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  toggleSpeed: () => void;
  toggleMute: () => void;
  handleVolumeChange: (volume: number) => void;
}

interface SessionVideoStageProps {
  playback: PlaybackHandle;
  hasReaction: boolean;
  anchors: TimelineAnchor[];
  viewMode: ViewMode;
  videoTitle?: string | undefined;
  institution?: string | undefined;
  onSelectAnchor: (id: string) => void;
  onStartRecording: () => void;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const SessionVideoStage: React.FC<SessionVideoStageProps> = ({
  playback,
  hasReaction,
  anchors,
  viewMode,
  videoTitle,
  institution,
  onSelectAnchor,
  onStartRecording,
  onChangeViewMode,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 min-w-0" id="main-video-stage">
      <YouTubePlayer
        containerId={playback.containerId}
        isPlaying={playback.isPlaying}
        currentTimeSec={playback.currentTimeSec}
        durationSec={playback.durationSec}
        playbackSpeed={playback.playbackSpeed}
        volume={playback.volume}
        isMuted={playback.isMuted}
        isReady={playback.isReady}
        hasReaction={hasReaction}
        onTogglePlay={playback.togglePlay}
        onSeek={playback.seekTo}
        onToggleSpeed={playback.toggleSpeed}
        onToggleMute={playback.toggleMute}
        onVolumeChange={playback.handleVolumeChange}
      />

      <GemRail
        anchors={anchors}
        currentTimeSec={playback.currentTimeSec}
        totalDurationSec={playback.durationSec}
        viewMode={viewMode}
        videoTitle={videoTitle}
        institution={institution}
        onSeek={playback.seekTo}
        onSelectAnchor={onSelectAnchor}
        onStartRecording={onStartRecording}
        onChangeViewMode={onChangeViewMode}
      />
    </div>
  );
};
