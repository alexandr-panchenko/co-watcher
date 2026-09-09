import React from 'react';
import { TimelineAnchor, ViewMode } from '../../../types';
import { ReactionStudio } from '../../recorder/ReactionStudio';
import { CommentaryFeed } from '../../rail/CommentaryFeed';

interface SessionCompanionDockProps {
  viewMode: ViewMode;
  isRecordingMode: boolean;
  recordingSeconds: number;
  isRecordingActive: boolean;
  cameraOn: boolean;
  micAudioLevel: number;
  targetTimestampFormatted: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recordedBlobUrl: string | null;
  filteredAnchors: TimelineAnchor[];
  activeAnchorId: string;
  selectedTag: string;
  autoScroll: boolean;
  onToggleRecordActive: () => void;
  onRetakeRecording: () => void;
  onToggleCamera: () => void;
  onFinishRecording: () => void;
  onSelectAnchor: (anchor: TimelineAnchor) => void;
  onToggleTag: () => void;
  onToggleAutoScroll: () => void;
  onOpenFactCheck: () => void;
  onNavigateToAssembly: () => void;
  onStartRecording: () => void;
}

export const SessionCompanionDock: React.FC<SessionCompanionDockProps> = ({
  viewMode,
  isRecordingMode,
  recordingSeconds,
  isRecordingActive,
  cameraOn,
  micAudioLevel,
  targetTimestampFormatted,
  videoRef,
  recordedBlobUrl,
  filteredAnchors,
  activeAnchorId,
  selectedTag,
  autoScroll,
  onToggleRecordActive,
  onRetakeRecording,
  onToggleCamera,
  onFinishRecording,
  onSelectAnchor,
  onToggleTag,
  onToggleAutoScroll,
  onOpenFactCheck,
  onNavigateToAssembly,
  onStartRecording,
}) => {
  return (
    <div
      className={`${
        viewMode === 'standard'
          ? 'lg:absolute lg:top-4 lg:right-6 lg:bottom-4 lg:w-dock w-full mt-4 lg:mt-0 flex flex-col'
          : 'w-full mt-4 flex flex-col max-h-96'
      }`}
    >
      {isRecordingMode ? (
        <ReactionStudio
          recordingSeconds={recordingSeconds}
          isRecordingActive={isRecordingActive}
          cameraOn={cameraOn}
          micAudioLevel={micAudioLevel}
          targetTimestampFormatted={targetTimestampFormatted}
          videoRef={videoRef}
          recordedBlobUrl={recordedBlobUrl}
          onToggleRecordActive={onToggleRecordActive}
          onRetake={onRetakeRecording}
          onToggleCamera={onToggleCamera}
          onFinishAndAttach={onFinishRecording}
        />
      ) : (
        <CommentaryFeed
          anchors={filteredAnchors}
          activeAnchorId={activeAnchorId}
          selectedTag={selectedTag}
          autoScroll={autoScroll}
          onSelectAnchor={onSelectAnchor}
          onToggleTag={onToggleTag}
          onToggleAutoScroll={onToggleAutoScroll}
          onOpenFactCheck={onOpenFactCheck}
          onNavigateToAssembly={onNavigateToAssembly}
          onRetakeReaction={onStartRecording}
        />
      )}
    </div>
  );
};
