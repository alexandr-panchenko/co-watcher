import React, { useState } from 'react';
import { TimelineAnchor, ViewMode, ScreenType, VideoLecture } from '../types';
import { useYouTubePlayback } from './player';
import { UnifiedComposerChat } from './chat';
import { SessionRecordingBanner } from './domain/session/SessionRecordingBanner';
import { SessionCompanionDock } from './domain/session/SessionCompanionDock';
import { SessionVideoStage } from './domain/session/SessionVideoStage';
import { useSessionChat } from './domain/session/useSessionChat';
import { useSessionRecording } from './domain/session/useSessionRecording';
import { useSessionCompanionDock } from './domain/session/useSessionCompanionDock';

interface SessionScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenFactCheck: () => void;
  hasReaction: boolean;
  setHasReaction: (val: boolean) => void;
  lecture: VideoLecture | null;
}

async function fetchLectureMoments(
  videoTargetUrl: string
): Promise<{ momentsCount: number; newComments: TimelineAnchor[] } | null> {
  try {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: 'default-room',
        videoUrl: videoTargetUrl,
      }),
    });
    if (res.ok) {
      return (await res.json()) as {
        momentsCount: number;
        newComments: TimelineAnchor[];
      };
    }
  } catch {
    // network or api error
  }
  return null;
}

async function sendChatApi(
  text: string,
  videoId: string
): Promise<string | null> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        roomId: 'default-room',
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { text: string };
      return data.text || 'Response received.';
    }
  } catch {
    // network error
  }
  return null;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  onNavigate,
  onOpenFactCheck,
  hasReaction,
  setHasReaction,
  lecture,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [anchors, setAnchors] = useState<TimelineAnchor[]>([]);
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | null>(null);

  // Format seconds to MM:SS
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initialVideoId =
    lecture?.videoId ||
    (lecture?.youtubeUrl?.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1]) ||
    'bCz4OMemCcA';

  // YouTube Playback Hook
  const playback = useYouTubePlayback({
    initialVideoId,
    initialTimeSec: 0,
  });

  const {
    isChatLoading,
    setIsChatLoading,
    chatMessages,
    setChatMessages,
    handleSendMessage,
    handleLoadYouTubeUrl,
  } = useSessionChat({
    videoId: playback.videoId,
    currentTimeSec: playback.currentTimeSec,
    formatTime,
    setAnchors,
    changeVideo: playback.changeVideo,
    fetchLectureMoments,
    sendChatApi,
  });

  const { recorder, handleStartRecording } = useSessionRecording({
    currentTimeSec: playback.currentTimeSec,
    formatTime,
    isPlaying: playback.isPlaying,
    togglePlay: playback.togglePlay,
    setAnchors,
    setHasReaction,
    setSelectedAnchorId,
    setChatMessages,
  });

  const dock = useSessionCompanionDock({
    anchors,
    currentTimeSec: playback.currentTimeSec,
    selectedAnchorId,
    seekTo: playback.seekTo,
    setSelectedAnchorId,
    onNavigate,
  });

  // Fetch real Gemini moments when lecture changes
  React.useEffect(() => {
    let isCancelled = false;
    if (!lecture) return;

    const videoTargetUrl = lecture.youtubeUrl || `https://www.youtube.com/watch?v=${initialVideoId}`;

    // Defer initial loading indicator to next event tick
    const initTimer = setTimeout(() => {
      if (isCancelled) return;
      setIsChatLoading(true);
      setChatMessages([
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'assistant',
          timestamp: '00:00',
          text: `Analyzing "${lecture.title}" with Gemini 3.8 Flash and Parallel Search for live citations...`,
        },
      ]);
    }, 0);

    void fetchLectureMoments(videoTargetUrl).then((data) => {
      if (isCancelled || !data) {
        setIsChatLoading(false);
        return;
      }
      setAnchors(data.newComments);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-done-${Date.now()}`,
          sender: 'assistant',
          timestamp: '00:00',
          text: `Extracted ${data.momentsCount} verified video moments with live citations. Ask any questions about this lecture!`,
        },
      ]);
      setIsChatLoading(false);
    });

    return () => {
      isCancelled = true;
      clearTimeout(initTimer);
    };
  }, [lecture, initialVideoId, setChatMessages, setIsChatLoading]);

  return (
    <div className="flex flex-col w-full min-h-stage bg-surface-base">
      {recorder.isRecordingMode && (
        <SessionRecordingBanner
          pausedTimeFormatted={formatTime(playback.currentTimeSec)}
          onClose={recorder.closeRecorder}
        />
      )}

      <div className="w-full flex-1 flex flex-col">
        <div
          className={`relative w-full px-4 md:px-6 py-4 ${
            viewMode === 'standard' ? 'lg:pr-stage-sidebar' : ''
          }`}
        >
          {/* Left Column: YouTube Player + Metadata + Gem Rail */}
          <SessionVideoStage
            playback={playback}
            hasReaction={hasReaction}
            anchors={anchors}
            viewMode={viewMode}
            videoTitle={lecture?.title}
            institution={lecture?.institution}
            onSelectAnchor={(id) => {
              const target = anchors.find((a) => a.id === id);
              if (target) {
                playback.seekTo(target.timeSec);
                setSelectedAnchorId(target.id);
              }
            }}
            onStartRecording={handleStartRecording}
            onChangeViewMode={setViewMode}
          />

          {/* Right Column: Companion Dock (Commentary Feed or Recording Studio) */}
          <SessionCompanionDock
            viewMode={viewMode}
            isRecordingMode={recorder.isRecordingMode}
            recordingSeconds={recorder.recordingSeconds}
            isRecordingActive={recorder.isRecordingActive}
            cameraOn={recorder.cameraOn}
            micAudioLevel={recorder.micAudioLevel}
            targetTimestampFormatted={formatTime(playback.currentTimeSec)}
            videoRef={recorder.videoRef}
            recordedBlobUrl={recorder.recordedBlobUrl}
            filteredAnchors={dock.filteredAnchors}
            activeAnchorId={dock.currentActiveId}
            selectedTag={dock.selectedTag}
            autoScroll={dock.autoScroll}
            onToggleRecordActive={
              recorder.isRecordingActive
                ? recorder.pauseRecording
                : recorder.resumeRecording
            }
            onRetakeRecording={recorder.retakeRecording}
            onToggleCamera={() => recorder.setCameraOn(!recorder.cameraOn)}
            onFinishRecording={recorder.stopAndKeep}
            onSelectAnchor={dock.handleSelectAnchor}
            onToggleTag={dock.handleToggleTag}
            onToggleAutoScroll={dock.handleToggleAutoScroll}
            onOpenFactCheck={onOpenFactCheck}
            onNavigateToAssembly={dock.handleNavigateToAssembly}
            onStartRecording={handleStartRecording}
          />
        </div>

        {/* Bottom Unified Composer & Guidance Chat */}
        <UnifiedComposerChat
          messages={chatMessages}
          isLoading={isChatLoading}
          onSendMessage={handleSendMessage}
          onLoadYouTubeUrl={handleLoadYouTubeUrl}
        />
      </div>
    </div>
  );
};
